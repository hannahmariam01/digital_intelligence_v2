import React, { useState, useRef, useEffect, useCallback } from "react";
import { connectLive } from "../geminiService";
import { Mic, MicOff, Activity, Volume2, AlertCircle } from "lucide-react";

const LiveView: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "connecting" | "active">(
    "idle"
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveSessionRef = useRef<{
    sendAudio: (data: Float32Array) => void;
    disconnect: () => void;
  } | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Animation loop ref
  // Fix: Added null as initial value to satisfy useRef argument requirement (Expected 1 argument, but got 0)
  const animationFrameRef = useRef<number | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);

  const drawVisualizer = useCallback(() => {
    if (!canvasRef.current || !analyzerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const analyzer = analyzerRef.current;

    if (!ctx) return;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyzer.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#020617"; // slate-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 1.5;

        // Gradient for bars
        const gradient = ctx.createLinearGradient(
          0,
          canvas.height - barHeight,
          0,
          canvas.height
        );
        gradient.addColorStop(0, "#60a5fa"); // blue-400
        gradient.addColorStop(1, "#3b82f6"); // blue-500

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();
  }, []);

  const stopSession = useCallback(() => {
    if (liveSessionRef.current) {
      liveSessionRef.current.disconnect();
      liveSessionRef.current = null;
    }

    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setIsActive(false);
    setStatus("idle");
  }, []);

  const startSession = async () => {
    setError(null);
    setStatus("connecting");

    try {
      // Initialize local audio context for Mic input
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });

      // Setup Analyzer for visualizer
      analyzerRef.current = audioContextRef.current.createAnalyser();
      analyzerRef.current.fftSize = 256;

      // Get Mic Stream
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      sourceRef.current = audioContextRef.current.createMediaStreamSource(
        streamRef.current
      );
      sourceRef.current.connect(analyzerRef.current);

      // Setup processor to capture raw PCM
      processorRef.current = audioContextRef.current.createScriptProcessor(
        4096,
        1,
        1
      );

      sourceRef.current.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      // Connect to Gemini Live
      const session = await connectLive(
        (audioBuffer) => {
          // For now, we are just playing the audio in the service.
          // We could visualize the output here if we connected a separate analyzer to the output context.
        },
        () => {
          stopSession();
          setError("Session disconnected by server.");
        }
      );

      liveSessionRef.current = session;

      // Send audio data to Gemini
      processorRef.current.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        session.sendAudio(inputData);
      };

      setIsActive(true);
      setStatus("active");
      drawVisualizer();
    } catch (err) {
      console.error(err);
      setError("Failed to access microphone or connect to Gemini.");
      stopSession();
    }
  };

  useEffect(() => {
    return () => {
      stopSession();
    };
  }, [stopSession]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background */}
      <div
        className={`absolute inset-0 bg-blue-900/10 transition-opacity duration-1000 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      ></div>
      <div
        className={`absolute w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] transition-all duration-1000 ${
          isActive ? "scale-150 opacity-50" : "scale-100 opacity-20"
        }`}
      ></div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight flex items-center justify-center gap-4">
            <Activity
              className={`w-10 h-10 ${
                isActive ? "text-green-400 animate-pulse" : "text-slate-600"
              }`}
            />
            Gemini Live
          </h1>
          <p className="text-slate-400 text-lg">
            Real-time, low-latency voice conversation with Gemini.
          </p>
        </div>

        <div className="relative">
          {/* Visualizer Canvas */}
          <div className="h-64 w-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl overflow-hidden flex items-end justify-center relative shadow-2xl">
            <canvas
              ref={canvasRef}
              width={600}
              height={256}
              className="w-full h-full opacity-80"
            />

            {/* Status Overlay */}
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-500 bg-slate-950/80">
                <div className="text-center">
                  <Volume2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Start session to visualize audio</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {error && (
            <div className="text-red-400 flex items-center gap-2 bg-red-950/30 px-4 py-2 rounded-full border border-red-900/50 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            onClick={isActive ? stopSession : startSession}
            disabled={status === "connecting"}
            className={`
                        relative group flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl
                        ${
                          isActive
                            ? "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20 shadow-red-900/20"
                            : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/30"
                        }
                        ${
                          status === "connecting"
                            ? "opacity-70 cursor-wait"
                            : ""
                        }
                    `}
          >
            {status === "connecting" ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Connecting...
              </div>
            ) : isActive ? (
              <>
                <MicOff className="w-6 h-6" />
                End Session
              </>
            ) : (
              <>
                <Mic className="w-6 h-6" />
                Start Conversation
              </>
            )}
          </button>

          <p className="text-slate-500 text-sm">
            {isActive
              ? "Listening... Speak naturally."
              : "Click start to begin a voice chat."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveView;
