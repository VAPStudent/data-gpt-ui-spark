
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, FileUp, Scroll } from "lucide-react";
import ChatMessage from "./ChatMessage";
import FileUpload from "../Upload/FileUpload";
import { useWorkspace } from "@/hooks/useWorkspace";
import EmptyState from "../UI/EmptyState";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const ChatWindow: React.FC = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { activeWorkspace } = useWorkspace();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!query.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: query,
      role: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response to: "${query}"`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat-container">
      {showUpload && (
        <div className="absolute inset-0 z-10 bg-background flex items-center justify-center">
          <div className="w-full max-w-2xl p-6 bg-white rounded-xl shadow-lg">
            <FileUpload onClose={() => setShowUpload(false)} />
          </div>
        </div>
      )}

      {!activeWorkspace ? (
        <EmptyState
          title="No workspace selected"
          description="Select a workspace from the sidebar or create a new one"
          icon={<Scroll className="h-10 w-10 text-datagpt-blue opacity-80" />}
        />
      ) : (
        <>
          <div 
            className="messages-container scrollbar-thin" 
            ref={messagesContainerRef}
          >
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                  <h3 className="text-2xl font-semibold mb-3 gradient-text">
                    Welcome to {activeWorkspace.name}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start querying your documents or upload PDFs to get insights from your data.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mb-2 w-full"
                    onClick={() => setShowUpload(true)}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload PDF Documents
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {messages.length > 3 && (
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-24 right-8 rounded-full shadow-md"
              onClick={scrollToBottom}
            >
              <Scroll className="h-4 w-4" />
            </Button>
          )}

          <div className="px-4 py-3 bg-background border-t">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setShowUpload(true)}
                className="shrink-0"
              >
                <FileUp className="h-4 w-4" />
              </Button>
              <div className="flex-1 flex bg-muted rounded-lg">
                <Textarea
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about your documents..."
                  className="flex-1 min-h-[50px] max-h-[120px] resize-none bg-transparent border-none focus-visible:ring-0"
                />
                <Button
                  className="h-auto self-end py-2 px-3 m-1 bg-datagpt-blue hover:bg-datagpt-blue/90"
                  disabled={!query.trim()}
                  onClick={handleSendMessage}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
