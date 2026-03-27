import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { api, useAuth, useLanguage, useLLM } from "../App";
import { useNavigate } from "react-router-dom";
import { Send, Mic, MicOff, Loader2, Bot, User, Sparkles } from "lucide-react";

const ChatPage = () => {
  const { user } = useAuth();
  const { language, t, getSuggestedQuestions, getAiGreeting } = useLanguage();
  const { status } = useLLM();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const speechLangCodes = useMemo(
    () => ({
      en: "en-IN",
      hi: "hi-IN",
      kn: "kn-IN",
      te: "te-IN",
      ta: "ta-IN",
    }),
    [],
  );

  useEffect(() => {
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: getAiGreeting(),
        timestamp: new Date().toISOString(),
        source: "system",
      },
    ]);
  }, [language, getAiGreeting]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = speechLangCodes[language] || "en-IN";

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    rec.onerror = () => {
      setIsListening(false);
      toast.error(t("Voice input failed. Please try again."));
    };
    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
  }, [language, t, speechLangCodes]);

  const toggleVoiceInput = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      toast.error(t("Voice input not supported in this browser"));
      return;
    }

    if (isListening) {
      rec.stop();
      setIsListening(false);
      return;
    }

    rec.lang = speechLangCodes[language] || "en-IN";
    rec.start();
    setIsListening(true);
  };

  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post("/chat/message", {
        message: userMessage.content,
        language,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response || "Sorry, I couldn't help with that.",
          timestamp: data.timestamp || new Date().toISOString(),
          source: data.source || (data.source === "" ? "ai" : data.source),
        },
      ]);
    } catch (err) {
      toast.error(t("Failed to get response. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const suggested = messages.length <= 1 ? getSuggestedQuestions() : [];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-ayur-dark">{t("AI Consultation")}</h1>
            <p className="text-ayur-muted text-sm mt-1">{t("Ask any Ayurvedic health question")}</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                status.mode === "local"
                  ? "bg-ayur-success/20 text-ayur-success"
                  : status.mode === "cloud"
                    ? "bg-[#7C98A1]/20 text-[#7C98A1]"
                    : "bg-ayur-danger/20 text-ayur-danger"
              }`}
            >
              {status.mode === "local" ? t("Local LLM Active") : status.mode === "cloud" ? t("Cloud AI") : t("Offline")}
            </span>
          </div>
        </div>

        <div className="bg-white border border-ayur-border rounded-3xl overflow-hidden shadow-sm">
          <div className="h-[60vh] overflow-y-auto p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  data-testid={`chat-message-${message.role}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" ? "bg-ayur-primary" : "bg-[#EBF0EA]"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-ayur-primary" />
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === "user"
                          ? "bg-ayur-primary text-white"
                          : "bg-white border border-ayur-border text-ayur-dark"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.source && message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-ayur-border/70 text-xs text-ayur-muted">
                          <Sparkles className="h-3 w-3 text-ayur-muted" />
                          <span className="capitalize">{message.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {loading ? (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-9 h-9 rounded-2xl bg-[#EBF0EA] flex items-center justify-center">
                      <Bot className="h-4 w-4 text-ayur-primary animate-spin" />
                    </div>
                    <div className="bg-white border border-ayur-border rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-ayur-muted">
                        <Loader2 className="h-4 w-4 text-ayur-primary animate-spin" />
                        {t("Thinking...")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {suggested.length ? (
            <div className="px-4 pb-3 pt-1 border-t border-ayur-border">
              <p className="text-ayur-muted text-xs mb-2">{t("Suggested questions:")}</p>
              <div className="flex flex-wrap gap-2">
                {suggested.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(q)}
                    className="bg-[#EBF0EA] border border-ayur-border hover:bg-[#DDE3DD] rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
                    data-testid={`suggested-q-${i}`}
                    type="button"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="p-4 border-t border-ayur-border bg-ayur-light">
            <form onSubmit={sendMessage} className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`rounded-full p-3 ${
                  isListening ? "bg-ayur-accent text-white" : "bg-[#EBF0EA] text-ayur-primary"
                } hover:opacity-90`}
                data-testid="voice-input-btn"
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </button>

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("Ask your health question...")}
                disabled={loading}
                className="flex-1 bg-white border border-ayur-border rounded-2xl px-4 py-2 outline-none focus:ring-2 focus:ring-ayur-glow"
                data-testid="chat-input"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-ayur-primary text-white rounded-full px-5 py-3 hover:bg-[#3A634D] disabled:opacity-60 flex items-center justify-center"
                data-testid="send-message-btn"
                aria-label="Send"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        <p className="text-ayur-muted text-xs text-center pb-3">
          {t("Disclaimer")}
        </p>

        {/* hidden: ensures the user object is referenced for future profile personalization */}
        <div className="hidden">
          {user?.id}
          <button type="button" onClick={() => navigate("/prakriti")} />
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;

