
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { MessageSquare, Database } from "lucide-react";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

type ChatMessageProps = {
  message: Message;
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
  
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
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
          
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
