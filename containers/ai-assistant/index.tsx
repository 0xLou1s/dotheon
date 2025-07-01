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
  AIInputModelSelect,
  AIInputModelSelectContent,
  AIInputModelSelectItem,
  AIInputModelSelectTrigger,
  AIInputModelSelectValue,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@/components/ai/input";
import {
  GlobeIcon,
  MicIcon,
  PlusIcon,
  SendIcon,
  StopCircleIcon,
} from "lucide-react";
import type { FormEventHandler } from "react";
import { AISuggestion, AISuggestions } from "@/components/ai/suggestion";

// Mock data types
export type Message = {
  id: string;
  from: "user" | "assistant";
  content: string;
  avatar: string;
  name: string;
  timestamp: string;
  codeBlocks?: CodeBlock[];
  isTyping?: boolean;
  tokens?: string[];
};

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
  "How can I mint a new token?",
  "How does the bonding curve work when minting?",
];

// Mock data
export const mockModels: Model[] = [
  { id: "gpt-4", name: "GPT-4", description: "Most capable model" },
];

// Mock AI response
const mockAIResponse = `Chat with AI Assistant is developing, please wait for the release of the AI Assistant. Get in touch with me on [Twitter](https://x.com/dotheon) if you have any questions.`;

export const mockMessages: Message[] = [
  {
    id: "1",
    from: "user",
    content: "Can you show me how to mint?",
    avatar: "https://www.lou1s.fun/lou1s-avt.png",
    name: "Lou1s",
    timestamp: "2024-03-20T10:01:00Z",
  },
  {
    id: "2",
    from: "assistant",
    content: `You can mint your token here 👉 [Mint Now](/vtokens/mint)

Let me know if you need help with the minting process! 🚀`,
    avatar: "https://github.com/openai.png",
    name: "OpenAI",
    timestamp: "2024-03-20T10:01:05Z",
  },
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [model, setModel] = useState<string>(mockModels[0].id);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldScrollRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
        avatar: "https://github.com/openai.png",
        name: "OpenAI",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    shouldScrollRef.current = true;

    const userMessage: Message = {
      id: Date.now().toString(),
      from: "user",
      content: suggestion,
      avatar: "https://www.lou1s.fun/lou1s-avt.png",
      name: "Lou1s",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsStreaming(true);
    setCurrentResponse("");

    // Simulate token streaming
    let currentIndex = 0;
    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < mockAIResponse.length) {
        setCurrentResponse((prev) => prev + mockAIResponse[currentIndex]);
        currentIndex++;
      } else {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
        setIsStreaming(false);
        setIsTyping(false);

        // Add the complete response as a message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          from: "assistant",
          content: mockAIResponse,
          avatar: "https://github.com/openai.png",
          name: "OpenAI",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    }, 50);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get("message") as string;

    if (!message.trim()) return;

    shouldScrollRef.current = true;

    const userMessage: Message = {
      id: Date.now().toString(),
      from: "user",
      content: message,
      avatar: "https://www.lou1s.fun/lou1s-avt.png",
      name: "Hayden Bleasel",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setIsStreaming(true);
    setCurrentResponse("");

    // Simulate token streaming
    let currentIndex = 0;
    streamIntervalRef.current = setInterval(() => {
      if (currentIndex < mockAIResponse.length) {
        setCurrentResponse((prev) => prev + mockAIResponse[currentIndex]);
        currentIndex++;
      } else {
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
        }
        setIsStreaming(false);
        setIsTyping(false);

        // Add the complete response as a message
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          from: "assistant",
          content: mockAIResponse,
          avatar: "https://github.com/openai.png",
          name: "OpenAI",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    }, 50);

    // Reset form
    event.currentTarget.reset();
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <AIMessage key={message.id} from={message.from}>
            <AIMessageContent>
              <AIResponse>{message.content}</AIResponse>
            </AIMessageContent>
            <AIMessageAvatar src={message.avatar} name={message.name} />
          </AIMessage>
        ))}
        {isStreaming && (
          <AIMessage from="assistant">
            <AIMessageContent>
              <AIResponse>{currentResponse}</AIResponse>
            </AIMessageContent>
            <AIMessageAvatar
              src="https://github.com/openai.png"
              name="OpenAI"
            />
          </AIMessage>
        )}
        {isTyping && !isStreaming && (
          <AIMessage from="assistant">
            <AIMessageContent>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </AIMessageContent>
            <AIMessageAvatar
              src="https://github.com/openai.png"
              name="OpenAI"
            />
          </AIMessage>
        )}
        <div ref={messagesEndRef} />
      </div>

      <AISuggestions className="py-2 hidden lg:block">
        {suggestions.map((suggestion) => (
          <AISuggestion
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            suggestion={suggestion}
          />
        ))}
      </AISuggestions>

      <AIInput onSubmit={handleSubmit}>
        <AIInputTextarea />
        <AIInputToolbar>
          <AIInputTools>
            <AIInputButton>
              <PlusIcon size={16} />
            </AIInputButton>
            <AIInputButton>
              <MicIcon size={16} />
            </AIInputButton>
            <AIInputButton disabled>
              <GlobeIcon size={16} />
              <span>Search</span>
            </AIInputButton>
            <AIInputModelSelect value={model} onValueChange={setModel}>
              <AIInputModelSelectTrigger>
                <AIInputModelSelectValue />
              </AIInputModelSelectTrigger>
              <AIInputModelSelectContent>
                {mockModels.map((model) => (
                  <AIInputModelSelectItem key={model.id} value={model.id}>
                    {model.name}
                  </AIInputModelSelectItem>
                ))}
              </AIInputModelSelectContent>
            </AIInputModelSelect>
          </AIInputTools>
          <AIInputSubmit onClick={isStreaming ? stopStreaming : undefined}>
            {isStreaming ? (
              <StopCircleIcon size={16} />
            ) : (
              <SendIcon size={16} />
            )}
          </AIInputSubmit>
        </AIInputToolbar>
      </AIInput>
    </div>
  );
}
