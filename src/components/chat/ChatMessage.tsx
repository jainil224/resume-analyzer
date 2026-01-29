import React from "react";
import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreamingText } from "./StreamingText";
import { ThinkingSkeleton } from "./ThinkingSkeleton";
import { Button } from "@/components/ui/button";

export interface Message {
    role: "user" | "assistant";
    content: string;
    createdAt?: string;
}

interface ChatMessageProps {
    message: Message;
    isStreaming?: boolean;
    isLoading?: boolean;
}

export function ChatMessage({ message, isStreaming = false, isLoading = false }: ChatMessageProps) {
    const isUser = message.role === "user";
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (e) {
            console.error("Failed to copy", e);
        }
    };

    if (isLoading) {
        return (
            <div className="flex gap-3 justify-start items-end">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-card border border-border/50 text-card-foreground rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm max-w-[85%]">
                    <ThinkingSkeleton />
                </div>
            </div>
        )
    }

    return (
        <div className={cn("flex gap-3 w-full", isUser ? "justify-end" : "justify-start")}>
            {!isUser && (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1 backdrop-blur-sm">
                    <Bot className="w-5 h-5 text-primary" />
                </div>
            )}

            <div
                className={cn(
                    "group relative px-4 py-3 shadow-md max-w-[85%] transition-all duration-200",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm ml-12"
                        : "bg-card border border-border/50 text-card-foreground rounded-2xl rounded-bl-sm mr-12 hover:shadow-lg"
                )}
            >
                <div className="flex flex-col gap-1">
                    {isUser ? (
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    ) : (
                        <StreamingText content={message.content} isStreaming={isStreaming} />
                    )}

                    <div className={cn("flex items-center gap-2 mt-1", isUser ? "justify-end text-primary-foreground/70" : "justify-between text-muted-foreground")}>
                        {message.createdAt && (
                            <span className="text-[10px] font-medium opacity-70">
                                {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                        )}
                        {!isUser && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background/20"
                                onClick={handleCopy}
                                title="Copy message"
                            >
                                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {isUser && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                    <User className="w-5 h-5 text-primary-foreground" />
                </div>
            )}
        </div>
    );
}
