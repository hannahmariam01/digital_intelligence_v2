import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { streamChat } from "../geminiService";
import { Send, Upload, User, Bot, Loader2, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

const ChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      image: selectedImage || undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    const botMsgId = (Date.now() + 1).toString();
    const botMsg: ChatMessage = {
      id: botMsgId,
      role: "model",
      text: "",
      isStreaming: true,
    };
    setMessages((prev) => [...prev, botMsg]);

    try {
      const stream = streamChat(
        userMsg.text,
        messages.map((m) => ({ role: m.role, parts: [{ text: m.text }] })), // Simple history mapping
        userMsg.image
      );

      for await (const chunk of stream) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: "Sorry, I encountered an error." }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMsgId ? { ...msg, isStreaming: false } : msg
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 w-full relative overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-32">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
            <div className="bg-slate-900 p-6 rounded-full">
              <Bot className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-xl font-medium text-slate-300">
              Start a conversation with Gemini
            </h2>
            <p className="max-w-md text-center text-sm">
              Ask questions, plan trips, debug code, or upload an image for
              analysis.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user" ? "bg-indigo-600" : "bg-blue-600"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            <div
              className={`flex flex-col gap-2 max-w-[80%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Uploaded"
                  className="max-w-xs rounded-xl border border-slate-700 shadow-md"
                />
              )}
              {msg.text && (
                <div
                  className={`px-5 py-3 rounded-2xl shadow-sm ${
                    msg.role === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                  }`}
                >
                  {msg.role === "model" ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-slate-800 px-5 py-3 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
              <span className="text-slate-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-950/80 backdrop-blur-md border-t border-slate-800 p-4 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          {/* Image Preview in Input */}
          {selectedImage && (
            <div className="absolute -top-24 left-0 p-2 bg-slate-800 rounded-lg border border-slate-700 shadow-lg flex items-start gap-2">
              <img
                src={selectedImage}
                alt="Preview"
                className="h-16 w-16 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="flex gap-3 items-end bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
            <label className="p-3 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Upload className="w-5 h-5" />
            </label>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-200 placeholder-slate-500 resize-none py-3 max-h-32 min-h-[48px]"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedImage)}
              className="p-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-all shadow-lg shadow-blue-900/20"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatView;
