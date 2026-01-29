import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface StreamingTextProps {
    content: string;
    isStreaming?: boolean;
}

export function StreamingText({ content, isStreaming = false }: StreamingTextProps) {
    // We can add specific animations here if we want to animate character by character,
    // but for now, let's focus on the clean markdown rendering and the cursor.

    return (
        <div className="relative">
            <div className="prose prose-sm max-w-none dark:prose-invert text-foreground leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                </ReactMarkdown>
            </div>
            {isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary animate-pulse rounded-sm" />
            )}
        </div>
    );
}
