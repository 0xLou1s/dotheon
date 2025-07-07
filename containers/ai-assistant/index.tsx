"use client";

import { useState, useRef, useEffect } from "react";
import {
  AIMessage,
  AIMessageAvatar,
  AIMessageContent,
} from "@/components/ai/message";
import { AIResponse } from "@/components/ai/response";
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ai/input";
import {
  GlobeIcon,
  Loader2,
  MessageCircle,
  MicIcon,
  PlusIcon,
  SendIcon,
  StopCircleIcon,
} from "lucide-react";
import type { FormEventHandler } from "react";
import { AISuggestion, AISuggestions } from "@/components/ai/suggestion";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { truncateAddress } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { ComponentMap } from "@/lib/ai/tools";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EmptyState from "./empty-state";

interface Message {
  id: string;
  from: "user" | "assistant";
  content: string;
  avatar: string;
  name: string;
  timestamp: string;
  toolName?: string;
}

export type CodeBlock = {
  language: string;
  filename: string;
  code: string;
};

export type Model = {
  id: string;
  name: string;
  description?: string;
};

const suggestions = [
  "How can I mint vToken on Bifrost?",
  "Show me the statistics for all vToken",
];

export function Chat() {
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldScrollRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, startListening, stopListening, isSupported } =
    useSpeechRecognition({
      onResult: (transcript) => {
        setCurrentText((prev) => prev + transcript);
      },
      onError: (error) => {
        toast.error(`Speech recognition error: ${error}`);
      },
    });

  // Load chat history when wallet connects
  useEffect(() => {
    const loadChatHistory = async () => {
      if (isConnected && address) {
        try {
          const response = await fetch(`/api/chat?walletAddress=${address}`);
          const data = await response.json();

          if (response.ok && data.messages) {
            setIsLoadingMessages(true);
            const formattedMessages: Message[] = data.messages.map(
              (msg: any) => ({
                id: msg._id || Date.now().toString() + Math.random(),
                from: msg.role as "user" | "assistant",
                content: msg.content,
                avatar:
                  msg.role === "user"
                    ? `https://api.dicebear.com/7.x/bottts/svg?seed=${
                        address + "dotheon"
                      }`
                    : "/assets/logo.jpg",
                name:
                  msg.role === "user"
                    ? truncateAddress(address)
                    : "Dotheon Assistant",
                timestamp: msg.timestamp,
                toolName: msg.toolName,
              })
            );

            setMessages(formattedMessages);
            setIsLoadingMessages(false);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
          toast.error("Failed to load chat history");
        }
      }
    };

    loadChatHistory();
  }, [isConnected, address]);

  const scrollToBottom = () => {
    if (chatContainerRef.current && shouldScrollRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      shouldScrollRef.current = false;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const stopStreaming = () => {
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      setIsStreaming(false);
      setIsTyping(false);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: "assistant",
        content: currentResponse,
        avatar: "/assets/logo.jpg",
        name: "Dotheon Assistant",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    if (!isConnected || !address) {
      toast("Please connect your wallet to chat.");
      setTimeout(() => {
        openConnectModal?.();
      }, 1000);
      return;
    }

    shouldScrollRef.current = true;

    const userMessage: Message = {
      id: Date.now().toString(),
      from: "user",
      content: suggestion,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${
        address + "dotheon"
      }`,
      name: truncateAddress(address),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsStreaming(true);
    setCurrentResponse("");

    try {
      // Format messages for the API
      const formattedMessages = messages.map((msg) => ({
        role: msg.from === "user" ? "user" : "assistant",
        content: [
          {
            type: "text",
            text: msg.content,
          },
        ],
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...formattedMessages,
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: suggestion,
                },
              ],
            },
          ],
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Simulate streaming for now
      let currentIndex = 0;
      const aiResponseText = data.response;

      streamIntervalRef.current = setInterval(() => {
        if (currentIndex < aiResponseText.length) {
          setCurrentResponse((prev) => prev + aiResponseText[currentIndex]);
          currentIndex++;
        } else {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
          }
          setIsStreaming(false);
          setIsTyping(false);

          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            from: "assistant",
            content: aiResponseText,
            avatar: "/assets/logo.jpg",
            name: "Dotheon Assistant",
            timestamp: new Date().toISOString(),
            toolName: data.toolName,
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      }, 20);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to get AI response");
      setIsTyping(false);
      setIsStreaming(false);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;

    if (!message.trim() || !address) return;

    shouldScrollRef.current = true;

    const userMessage: Message = {
      id: Date.now().toString(),
      from: "user",
      content: message,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${
        address + "dotheon"
      }`,
      name: truncateAddress(address),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsStreaming(true);
    setCurrentResponse("");
    setCurrentText("");

    try {
      // Format messages for the API
      const formattedMessages = messages.map((msg) => ({
        role: msg.from === "user" ? "user" : "assistant",
        content: [
          {
            type: "text",
            text: msg.content,
          },
        ],
      }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...formattedMessages,
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: message,
                },
              ],
            },
          ],
          walletAddress: address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Simulate streaming for now
      let currentIndex = 0;
      const aiResponseText = data.response;
      const toolName = data.toolName;

      // Create the AI message object first
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: "assistant",
        content: "", // Start empty, will be filled during streaming
        avatar: "/assets/logo.jpg",
        name: "Dotheon Assistant",
        timestamp: new Date().toISOString(),
        toolName: toolName,
      };

      // Add the message to the list immediately
      setMessages((prev) => [...prev, aiMessage]);

      streamIntervalRef.current = setInterval(() => {
        if (currentIndex < aiResponseText.length) {
          // Update only the content of the AI message
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.id === aiMessage.id) {
              lastMessage.content = aiResponseText.slice(0, currentIndex + 1);
            }
            return newMessages;
          });
          currentIndex++;
        } else {
          if (streamIntervalRef.current) {
            clearInterval(streamIntervalRef.current);
          }
          setIsStreaming(false);
          setIsTyping(false);

          // Final update to ensure complete message
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.id === aiMessage.id) {
              lastMessage.content = aiResponseText;
            }
            return newMessages;
          });
        }
      }, 20);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get AI response";
      toast.error(errorMessage);
      setIsTyping(false);
      setIsStreaming(false);
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    }
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  const renderToolComponent = (toolName: string | undefined) => {
    if (!toolName) return null;

    const Component = ComponentMap[toolName];
    if (!Component) {
      console.warn(`No component found for tool: ${toolName}`);
      return null;
    }

    return (
      <div className="mt-4">
        <Component />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full w-full space-y-2">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4">
        {isLoadingMessages && (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}
        {messages.length === 0 && !isLoadingMessages && <EmptyState />}
        {messages.map((message) => (
          <AIMessage key={message.id} from={message.from}>
            <AIMessageContent>
              <AIResponse>{message.content}</AIResponse>
              {message.from === "assistant" &&
                message.content &&
                renderToolComponent(message.toolName)}
            </AIMessageContent>
            <AIMessageAvatar src={message.avatar} name={message.name} />
          </AIMessage>
        ))}
        {isStreaming && (
          <AIMessage from="assistant">
            <AIMessageContent>
              <AIResponse>{currentResponse}</AIResponse>
            </AIMessageContent>
            <AIMessageAvatar src="/assets/logo.jpg" name="Dotheon Assistant" />
          </AIMessage>
        )}
        <div ref={messagesEndRef} />
      </div>

      <AISuggestions className="hidden md:flex">
        {suggestions.map((suggestion) => (
          <AISuggestion
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            suggestion={suggestion}
            disabled={isStreaming || isTyping}
          />
        ))}
      </AISuggestions>

      <AIInput onSubmit={handleSubmit}>
        <AIInputTextarea
          onChange={(e) => setCurrentText(e.target.value)}
          value={currentText}
        />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton>
              <PlusIcon size={16} />
            </AIInputButton>
            <AIInputButton
              onClick={isListening ? stopListening : startListening}
              disabled={!isSupported}
              className={isListening ? "text-red-500" : ""}
            >
              <MicIcon size={16} />
            </AIInputButton>
            <AIInputButton disabled>
              <GlobeIcon size={16} />
              <span>Search</span>
            </AIInputButton>
          </AIInputTools>
          {isConnected ? (
            <AIInputSubmit
              disabled={!currentText.trim() && !isStreaming}
              onClick={isStreaming ? stopStreaming : undefined}
            >
              {isStreaming ? (
                <StopCircleIcon size={16} />
              ) : (
                <SendIcon size={16} />
              )}
            </AIInputSubmit>
          ) : (
            <Button onClick={openConnectModal}>Connect Wallet To Chat</Button>
          )}
        </AIInputToolbar>
      </AIInput>
    </div>
  );
}
