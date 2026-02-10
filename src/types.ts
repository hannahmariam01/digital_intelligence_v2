export enum View {
  CHAT = "CHAT",
  IMAGE = "IMAGE",
  LIVE = "LIVE",
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  image?: string; // base64
  isStreaming?: boolean;
}

export interface LiveSessionConfig {
  voiceName: string;
}

export interface InsightResponse {
  title: string;
  content: string;
  tags: string[];
}

export interface GlobePoint {
  coordinates: [number, number]; // Longitude, Latitude
  size: number;
}
