import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Bot, User, Loader2, Sparkles, Copy, FileText, Briefcase, GraduationCap } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

interface Character {
  emoji: React.ReactNode;
  name: string;
  online: boolean;
  description: string;
}

const characters: Character[] = [
  { emoji: <FileText className="w-5 h-5" />, name: "Resume Expert", online: true, description: "Resume writing & optimization" },
  { emoji: <Briefcase className="w-5 h-5" />, name: "Job Coach", online: true, description: "Interview prep & job search" },
  { emoji: <GraduationCap className="w-5 h-5" />, name: "Career Advisor", online: true, description: "Career path guidance" },
  { emoji: <Sparkles className="w-5 h-5" />, name: "AI Assistant", online: true, description: "General help" },
];

export function AIAssistant() {
  const [selectedCharacter, setSelectedCharacter] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { theme, resolvedTheme } = useTheme();
  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleCharacterSelect = (index: number) => {
    setSelectedCharacter(index);
    setIsOpen(true);
    const char = characters[index];
    setMessages([
      {
        role: "assistant",
        content: getWelcomeMessage(char.name),
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const getWelcomeMessage = (name: string) => {
    switch (name) {
      case "Resume Expert":
        return "👋 Hi! I'm your Resume Expert. I specialize in:\n\n📄 **Resume Writing** - Creating compelling, ATS-friendly resumes\n✨ **Optimization** - Improving your existing resume\n🎯 **Formatting** - Professional layouts and design\n\nHow can I help with your resume today?";
      case "Job Coach":
        return "👋 Hi! I'm your Job Coach. I can help you with:\n\n💼 **Interview Preparation** - Practice questions and techniques\n🔍 **Job Search Strategy** - Finding the right opportunities\n📝 **Cover Letters** - Crafting compelling applications\n\nWhat would you like to work on?";
      case "Career Advisor":
        return "👋 Hi! I'm your Career Advisor. I specialize in:\n\n🎯 **Career Path Planning** - Finding your direction\n📈 **Skill Development** - Identifying growth areas\n🔄 **Career Transitions** - Making successful changes\n\nHow can I guide your career today?";
      default:
        return "👋 Hi! I'm your AI Assistant. I can help with:\n\n📄 **Resume Building** - Writing, optimizing, and formatting\n🔍 **Job Search** - Interview prep and career guidance\n💡 **Career Advice** - General tips and strategies\n\nWhat would you like help with today?";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

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

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCharacter(null);
    setMessages([]);
  };

  return (
    <>
      {/* Character Dock - Always visible at bottom */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 rounded-full px-4 py-3 shadow-xl border bg-card border-border backdrop-blur-sm">
              {characters.map((char, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.15, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCharacterSelect(index)}
                  className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all bg-primary/10 hover:bg-primary/20 text-primary"
                  title={char.name}
                >
                  {char.emoji}
                  {char.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && selectedCharacter !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="shadow-xl border-border overflow-hidden">
              {/* Header */}
              <div className="bg-primary p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-foreground/20 rounded-lg text-primary-foreground">
                    {characters[selectedCharacter].emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-foreground">{characters[selectedCharacter].name}</h3>
                    <p className="text-xs text-primary-foreground/70">{characters[selectedCharacter].description}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleClose} className="text-primary-foreground hover:bg-primary-foreground/20">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="h-[350px] p-4">
                <div ref={scrollRef} className="space-y-3">
                  {messages.map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className="flex gap-2 max-w-[85%] group">
                        {m.role === "assistant" && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div className={`rounded-xl px-3 py-2 ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                          <div className="flex flex-col gap-1">
                            <div className={`text-sm ${m.role === "assistant" ? "prose prose-sm max-w-none dark:prose-invert" : ""}`}>
                              {m.role === "assistant" ? (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content || ""}</ReactMarkdown>
                              ) : (
                                <p className="whitespace-pre-wrap">{m.content}</p>
                              )}
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                              {m.createdAt && (
                                <span className="text-[11px] opacity-60">
                                  {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              )}
                              <button
                                title="Copy message"
                                aria-label="Copy message"
                                onClick={() => copyText(m.content)}
                                className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10"
                              >
                                <Copy className="w-3 h-3 opacity-60" />
                              </button>
                            </div>
                          </div>
                        </div>
                        {m.role === "user" && (
                          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                            <User className="w-4 h-4 text-primary-foreground" />
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
                        <div className="bg-muted text-foreground rounded-xl px-3 py-2 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-border bg-card">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Ask ${characters[selectedCharacter].name}...`}
                    className="min-h-[44px] max-h-[120px] resize-none"
                    rows={1}
                  />
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
