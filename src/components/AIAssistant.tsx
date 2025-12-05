import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Copy } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your Resume & Job Coach. I help with:\n\n📄 **Resume Building** - Writing, optimizing, and formatting your resume\n🔍 **Resume Analysis** - Evaluating and improving your resume content\n💼 **Job Search** - Interview prep, job strategies, and career guidance\n\nWhat would you like help with today?",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const content = input.trim().toLowerCase();

    // Check for common off-topic keywords
    const offTopicKeywords = [
      "recipe", "cook", "sports", "game", "music", "movie", "weather", "math", "physics",
      "history", "geography", "science", "joke", "funny", "hello", "how are you", "who are you",
      "what is", "tell me about", "explain"
    ];

    const isOffTopic = offTopicKeywords.some(keyword => content.includes(keyword)) &&
      !content.includes("resume") &&
      !content.includes("job") &&
      !content.includes("interview") &&
      !content.includes("career") &&
      !content.includes("cover letter");

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage, createdAt: new Date().toISOString() }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMessage }] }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed (${res.status})`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantBuffer = "";

      if (reader) {
        setMessages((prev) => [...prev, { role: "assistant", content: "", createdAt: new Date().toISOString() }]);

        let done = false;
        let buffer = "";
        while (!done) {
          const { value, done: readDone } = await reader.read();
          if (readDone) break;
          buffer += decoder.decode(value, { stream: true });

          let nl: number;
          while ((nl = buffer.indexOf("\n")) !== -1) {
            const line = buffer.slice(0, nl);
            buffer = buffer.slice(nl + 1);
            if (!line.trim()) continue;
            if (!line.startsWith("data: ")) continue;

            const data = line.replace(/^data: /, "").trim();
            if (data === "[DONE]") {
              done = true;
              break;
            }

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                assistantBuffer += delta;
                setMessages((prev) => {
                  const copy = [...prev];
                  const lastIndex = copy.map((m) => m.role).lastIndexOf("assistant");
                  if (lastIndex >= 0) {
                    copy[lastIndex] = { ...copy[lastIndex], content: assistantBuffer };
                  }
                  return copy;
                });
              }
            } catch (err) {
              // ignore parse errors
            }
          }
        }
      } else {
        const json = await res.json();
        const content = json.choices?.[0]?.message?.content || json.choices?.[0]?.text || JSON.stringify(json);
        setMessages((prev) => [...prev, { role: "assistant", content, createdAt: new Date().toISOString() }]);
      }
    } catch (err) {
      console.error("Assistant error:", err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry — there was an error. Please try again.", createdAt: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyText = async (t: string) => {
    try {
      await navigator.clipboard.writeText(t);
    } catch (e) {
      console.warn("Clipboard not available", e);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="fixed bottom-6 right-6 z-50">
            <Button onClick={() => setIsOpen(true)} size="lg" className="rounded-full w-14 h-14 bg-primary hover:bg-primary/90 shadow-glow">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }} className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)]">
            <Card className="shadow-xl border-border/50 overflow-hidden">
              <div className="bg-primary p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">Career Assistant</h3>
                    <p className="text-xs text-primary-foreground/70">Resume & Job Expert</p>
                    {import.meta.env.VITE_GEMINI_MODEL && <p className="text-[10px] text-primary-foreground/60">Model: {import.meta.env.VITE_GEMINI_MODEL}</p>}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-primary-foreground hover:bg-primary-foreground/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="h-[350px] p-4">
                <div ref={scrollRef} className="space-y-3">
                  {messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="flex gap-2 max-w-xs group">
                        {m.role === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className={`rounded-lg px-3 py-2 ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}>
                          <div className="flex flex-col gap-1">
                            <div className={`text-sm ${m.role === "assistant" ? "prose prose-sm max-w-none" : ""}`}>
                              {m.role === "assistant" ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || ""}</ReactMarkdown>
                              ) : (
                                <p className="whitespace-pre-wrap">{m.content}</p>
                              )}
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                              {m.createdAt && (
                                <span className={`text-[11px] ${m.role === "user" ? "text-blue-100" : "text-gray-600"}`}>
                                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                              <button
                                title="Copy message"
                                aria-label="Copy message"
                                onClick={() => copyText(m.content)}
                                className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${m.role === "user" ? "hover:bg-blue-700" : "hover:bg-gray-300"
                                  }`}
                              >
                                <Copy className={`w-3 h-3 ${m.role === "user" ? "text-blue-100" : "text-gray-700"}`} />
                              </button>
                            </div>
                          </div>
                        </div>
                        {m.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && messages[messages.length - 1]?.role === "user" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 justify-start">
                      <div className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <div className="bg-gray-200 text-gray-900 rounded-lg px-3 py-2 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about resumes, interviews or job searches..." className="min-h-[44px] max-h-[120px] resize-none" rows={1} />
                  <Button onClick={handleSend} disabled={!input.trim() || isLoading} size="icon" className="flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
