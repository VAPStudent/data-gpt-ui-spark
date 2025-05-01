
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageSquare, Database, FileText } from "lucide-react";
import { Citation } from "@/services/queryService";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  citations?: Citation[];
  isPending?: boolean;
};

type ChatMessageProps = {
  message: Message;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  const [showCitations, setShowCitations] = useState(false);
  
  return (
    <div className={cn(
      "flex mb-6",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex items-start max-w-[80%]",
        isUser ? "flex-row-reverse" : "flex-row"
      )}>
        <div className={cn(
          "flex items-center justify-center h-8 w-8 rounded-full shrink-0",
          isUser ? "ml-3 bg-datagpt-blue text-white" : "mr-3 bg-muted"
        )}>
          {isUser ? (
            <MessageSquare className="h-4 w-4" />
          ) : (
            <Database className="h-4 w-4" />
          )}
        </div>
        
        <div>
          <div className={cn(
            "rounded-xl p-4",
            isUser ? "bg-datagpt-blue text-white" : "bg-white border shadow-sm"
          )}>
            {message.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{message.content}</span>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
          
          {!isUser && message.citations && message.citations.length > 0 && (
            <div className="mt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs flex items-center gap-1 text-muted-foreground"
                onClick={() => setShowCitations(!showCitations)}
              >
                <FileText className="h-3 w-3" />
                {showCitations ? "Hide" : "Show"} {message.citations.length} citation{message.citations.length > 1 ? 's' : ''}
              </Button>
              
              {showCitations && (
                <div className="mt-2 ml-1 border-l-2 pl-3 border-muted-foreground/20">
                  {message.citations.map((citation, index) => (
                    <div key={index} className="mb-2 text-xs text-muted-foreground">
                      <div className="font-medium mb-1">
                        {citation.document_name} {citation.page && `- Page ${citation.page}`}
                      </div>
                      <div className="italic bg-muted p-2 rounded text-foreground/80">
                        "{citation.text}"
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div className={cn(
            "text-xs mt-1 text-muted-foreground",
            isUser ? "text-right" : "text-left"
          )}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
