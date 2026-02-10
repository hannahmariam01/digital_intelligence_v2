import {
  GoogleGenAI,
  GenerateContentResponse,
  LiveSession,
  Modality,
  LiveServerMessage,
} from "@google/genai";
import { MODELS } from "./constants";
import { createBlob, decode, decodeAudioData } from "./audioUtils";
import { InsightResponse } from "../types";

const ai = new GoogleGenAI({
  apiKey: process.env.VITE_API_KEY || "AIzaSyAvHo8a6kghrSfwYxr66gr2b1vnUqP6jZA",
});

// --- Chat Service ---

export async function* streamChat(
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  image?: string // Base64 string if present
) {
  // We use generateContentStream for single turn or managed history.
  // For simplicity in this demo, we'll send the full history as "contents" if needed,
  // but here we will just use the model to generate a response based on current input
  // usually keeping history in a Chat session is better, but here we treat it statelessly or semi-statelessly.

  // Construct the contents based on whether we have an image
  let contents: any[] = [];

  // Basic history adaptation for the prompt
  // In a real app, you'd use ai.chats.create() and manage history there.
  // We will just send the current message for this stateless playground example
  // to avoid complex history management in this file.

  const parts: any[] = [];
  if (image) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming JPEG for simplicity from file input
        data: image.split(",")[1], // remove data:image/jpeg;base64, prefix
      },
    });
  }
  parts.push({ text: message });

  const responseStream = await ai.models.generateContentStream({
    model: MODELS.TEXT,
    contents: [{ role: "user", parts }],
  });

  for await (const chunk of responseStream) {
    yield chunk.text;
  }
}

// --- Image Service ---

export async function generateImage(prompt: string): Promise<string> {
  // Using generateContent with the image model as instructed for "nano banana" equivalent
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE,
    contents: {
      parts: [{ text: prompt }],
    },
    config: {
      // For flash-image, we rely on it returning inlineData
    },
  });

  // Iterate through parts to find the image
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("No image generated.");
}

// --- Live Service ---

export async function connectLive(
  onAudioData: (audioBuffer: AudioBuffer) => void,
  onClose: () => void
): Promise<{
  sendAudio: (data: Float32Array) => void;
  disconnect: () => void;
}> {
  const inputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({ sampleRate: 16000 });
  const outputAudioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)({ sampleRate: 24000 });

  // We need to keep track of audio timing
  let nextStartTime = 0;

  const sessionPromise = ai.live.connect({
    model: MODELS.LIVE,
    callbacks: {
      onopen: () => {
        console.log("Live session connected");
      },
      onmessage: async (message: LiveServerMessage) => {
        const base64Audio =
          message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;

        if (base64Audio) {
          // Sync start time
          nextStartTime = Math.max(
            nextStartTime,
            outputAudioContext.currentTime
          );

          const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outputAudioContext,
            24000,
            1
          );

          // We pass the buffer back to the component to visualize,
          // but we play it here for sync reasons mostly, or we can just play it here.
          // The prompt implementation played it inside the callback.

          const source = outputAudioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputAudioContext.destination);
          source.start(nextStartTime);

          nextStartTime += audioBuffer.duration;

          // Callback for visualization
          onAudioData(audioBuffer);
        }

        if (message.serverContent?.interrupted) {
          nextStartTime = 0;
        }
      },
      onclose: () => {
        console.log("Live session closed");
        onClose();
      },
      onerror: (err) => {
        console.error("Live session error", err);
        onClose();
      },
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
      },
    },
  });

  return {
    sendAudio: (data: Float32Array) => {
      const pcmBlob = createBlob(data);
      sessionPromise.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    },
    disconnect: () => {
      sessionPromise.then((session) => session.close());
      inputAudioContext.close();
      outputAudioContext.close();
    },
  };
}

// --- Insights Service ---

export async function fetchDigitalInsight(): Promise<InsightResponse> {
  try {
    const response = await ai.models.generateContent({
      model: MODELS.TEXT,
      contents:
        "You are a futuristic corporate AI system. Generate a short, cryptic but insightful executive alert about 'Digital Intelligence' blind spots, execution constraints, or strategic drift in a cyberpunk style. Return ONLY the text in this format: 'Title: [Brief Title] Content: [1 sentence content]'. Keep it under 20 words total.",
    });
    const text = response.text || "";
    // Simple parse
    if (text.includes("Title:") && text.includes("Content:")) {
      const titlePart = text.split("Content:")[0];
      const contentPart = text.split("Content:")[1];
      return {
        title: titlePart.replace("Title:", "").trim(),
        content: contentPart.trim(),
        tags: ["Strategy", "AI"],
      };
    } else {
      return {
        title: "System Update",
        content: text,
        tags: ["System"],
      };
    }
  } catch (e) {
    console.error(e);
    return {
      title: "Connection Error",
      content: "Neural link unstable.",
      tags: ["Error"],
    };
  }
}
