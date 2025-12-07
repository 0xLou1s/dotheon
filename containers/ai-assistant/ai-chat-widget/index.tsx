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
  MicIcon,
  SendIcon,
  StopCircleIcon,
  ChevronDownIcon,
  ExternalLink,
  BotMessageSquare,
} from "lucide-react";
import type { FormEventHandler } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { truncateAddress } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { ComponentMap } from "@/lib/ai/tools";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Message {
  id: string;
  from: "user" | "assistant";
  content: string;
  avatar: string;
  name: string;
  timestamp: string;
  toolName?: string;
}

export function AIChatWidget() {
  const pathname = usePathname();
  const { wallet, account, connectWallet } = useWallet();
  const isConnected = !!wallet && !!account;
  const address = account?.address;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentText, setCurrentText] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
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

  const handleToggleChat = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsOpen(!isOpen);

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

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

      let currentIndex = 0;
      const aiResponseText = data.response;
      const toolName = data.toolName;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        from: "assistant",
        content: "",
        avatar: "/assets/logo.jpg",
        name: "Dotheon Assistant",
        timestamp: new Date().toISOString(),
        toolName: toolName,
      };

      setMessages((prev) => [...prev, aiMessage]);

      streamIntervalRef.current = setInterval(() => {
        if (currentIndex < aiResponseText.length) {
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

  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  const displayWidget = () => {
    const undisplayPage = ["/ai"];
    if (undisplayPage.includes(pathname)) {
      return false;
    }
    return true;
  };

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
    <>
      {/* Backdrop overlay with blur effect */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 transition-all duration-300 z-40",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => handleToggleChat()}
      />

      {/* Chat toggle button with enhanced animations */}
      <Button
        className={cn(
          "fixed bottom-10 right-6 size-11 shadow-lg hover:shadow-xl transition-all duration-300 group z-50",
          "hover:scale-110 active:scale-95",
          !displayWidget() && "hidden",
          // Hide button when chat is open
          isOpen
            ? "opacity-0 pointer-events-none scale-75"
            : "opacity-100 pointer-events-auto scale-100"
        )}
        onClick={handleToggleChat}
        disabled={isAnimating}
      >
        <BotMessageSquare
          className={cn(
            "size-7 transition-transform duration-300 group-hover:-rotate-15"
          )}
        />
      </Button>

      <Card
        className={cn(
          "fixed bottom-10 right-6 w-[80vw] sm:w-[450px] p-0 rounded-2xl border z-50",
          "transition-all duration-300 ease-out transform-gpu",
          isOpen
            ? "translate-y-0 opacity-100 scale-100 pointer-events-auto"
            : "translate-y-8 opacity-0 scale-95 pointer-events-none"
        )}
        style={{
          transformOrigin: "bottom right",
        }}
      >
        <CardHeader className="p-0">
          <div
            className={cn(
              "flex items-center justify-between px-4 py-3",
              "transition-all duration-200",
              isOpen && "animate-in slide-in-from-top-2"
            )}
          >
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src="/assets/logo.jpg"
                  alt="Dotheon"
                  className="w-6 h-6 rounded-full"
                />
              </div>
              <h3 className="font-semibold">Dotheon's AI Assistant</h3>
            </div>
            <div>
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-200"
                asChild
              >
                <Link href="ai">
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="transition-all duration-200"
                onClick={handleToggleChat}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col max-h-[500px]">
            {/* Messages container with stagger animation */}
            {messages.length === 0 && (
              <p className="px-4 text-center text-xl lg:text-2xl font-semibold">
                How can I help you today?
              </p>
            )}
            <div
              className={cn(
                "flex-1 overflow-y-auto p-2 space-y-2",
                "transition-all duration-300",
                isOpen && "animate-in fade-in-50 slide-in-from-bottom-4"
              )}
              ref={chatContainerRef}
            >
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "animate-in fade-in-50 slide-in-from-bottom-2",
                    isOpen && `animation-delay-${Math.min(index * 100, 500)}ms`
                  )}
                  style={{
                    animationDelay: isOpen
                      ? `${Math.min(index * 50, 300)}ms`
                      : "0ms",
                  }}
                >
                  <AIMessage from={message.from}>
                    <AIMessageContent>
                      <AIResponse>{message.content}</AIResponse>
                      {message.from === "assistant" &&
                        message.content &&
                        renderToolComponent(message.toolName)}
                    </AIMessageContent>
                    {/* <AIMessageAvatar src={message.avatar} name={message.name} /> */}
                  </AIMessage>
                </div>
              ))}

              {isStreaming && (
                <div className="animate-in fade-in-50 slide-in-from-bottom-2">
                  <AIMessage from="assistant">
                    <AIMessageContent>
                      <AIResponse>{currentResponse}</AIResponse>
                    </AIMessageContent>
                    <AIMessageAvatar
                      src="/assets/logo.jpg"
                      name="Dotheon Assistant"
                    />
                  </AIMessage>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              className={cn(
                "p-4",
                "transition-all duration-300",
                isOpen && "animate-in slide-in-from-bottom-4"
              )}
            >
              <AIInput onSubmit={handleSubmit}>
                <AIInputTextarea
                  onChange={(e) => setCurrentText(e.target.value)}
                  value={currentText}
                  placeholder="Ask me anything..."
                />
                <AIInputToolbar>
                  <AIInputTools>
                    <AIInputButton
                      onClick={isListening ? stopListening : startListening}
                      disabled={!isSupported}
                      className={cn(
                        "hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200",
                        isListening ? "text-red-500 animate-pulse" : ""
                      )}
                    >
                      <MicIcon size={16} />
                    </AIInputButton>
                  </AIInputTools>
                  {isConnected ? (
                    <AIInputSubmit
                      disabled={!currentText.trim() && !isStreaming}
                      onClick={isStreaming ? stopStreaming : undefined}
                      className="transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      {isStreaming ? (
                        <StopCircleIcon size={16} className="animate-spin" />
                      ) : (
                        <SendIcon size={16} />
                      )}
                    </AIInputSubmit>
                  ) : (
                    <Button
                      onClick={connectWallet}
                      className="transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Connect Wallet
                    </Button>
                  )}
                </AIInputToolbar>
              </AIInput>
            </div>
          </div>
        </CardContent>

        {messages.length === 0 && (
          <CardFooter className="p-0 flex justify-center">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm text-foreground text-center">
                Powered by <span className="font-bold">Dotheon</span>
              </p>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
