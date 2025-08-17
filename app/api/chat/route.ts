import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { ChatMessage } from "@/lib/db/models/ChatMessage";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { tools } from "@/lib/ai/tools";
import type { Tool, ToolExecutionOptions } from "ai";

interface ToolCall {
  toolName: string;
  toolCallId: string;
  args: any;
}

interface AIResponse {
  text: string;
  toolCalls?: ToolCall[];
}

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

async function chat(messages: any[]): Promise<AIResponse> {
  await connectDB();

  const formattedMessages = messages.map((msg) => ({
    role: msg.role,
    content: msg.content[0]?.text || msg.content,
    id: msg.id || Date.now().toString(),
  }));

      const result = await generateText({
      model: google("gemini-2.0-flash"),
      system: SYSTEM_PROMPT,
      messages: formattedMessages,
      tools,
      providerOptions: {
        google: {
          safetySettings: [
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE",
            },
          ],
        },
      },
    });

    console.log("AI Response:", {
      text: result.text,
      toolCalls: result.toolCalls,
      toolCallsCount: result.toolCalls?.length || 0,
      lastUserMessage: formattedMessages[formattedMessages.length - 1]?.content
    });

  return result;
}

export async function POST(req: Request) {
  try {
    const { messages, walletAddress } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    const result = await chat(messages);

    const toolCalls = result.toolCalls?.map((call: ToolCall) => ({
      toolName: call.toolName,
      toolCallId: call.toolCallId,
      args: call.args,
    })) || [];

    let responseText: string = typeof result.text === "string" ? result.text : "";

    let toolName = toolCalls.length > 0 ? toolCalls[0].toolName : null;
    
    // Fallback: Force trigger tools based on user message content
    let toolResult: any = null;
    if (!toolName) {
      const lastUserMessage = messages[messages.length - 1]?.content?.[0]?.text?.toLowerCase() || "";
      
      if (lastUserMessage.includes('mint') || lastUserMessage.includes('stake') || lastUserMessage.includes('staking')) {
        toolName = 'mintVToken';
        toolResult = {
          initialToken: 'vDOT',
          initialAmount: ""
        };
        console.log("Fallback: Forcing mintVToken tool based on user message");
      } else if (lastUserMessage.includes('redeem') || lastUserMessage.includes('unstake') || lastUserMessage.includes('unstaking')) {
        toolName = 'redeemVToken';
        toolResult = {
          initialToken: 'vDOT',
          initialAmount: ""
        };
        console.log("Fallback: Forcing redeemVToken tool based on user message");
      }
    }

    // // if Gemini didn't return text but did call a tool → execute tool manually
    // if ((!responseText || responseText.trim() === "") && toolCalls.length > 0) {
    //   const toolCall = toolCalls[0];

    //   if (toolCall.toolName in tools) {
    //     const toolKey = toolCall.toolName as keyof typeof tools;
    //     const toolFn = tools[toolKey] as Tool<any, any>;

    //     if (toolFn && typeof toolFn.execute === "function") {
    //       const result = await toolFn.execute(toolCall.args, {
    //         toolCallId: toolCall.toolCallId,
    //         messages
    //       } as ToolExecutionOptions);
    //       responseText = result?.text || "Here's the information you requested.";
    //       toolResult = result; // Set toolResult from tool execution
    //     } else {
    //       responseText = "Tool not implemented or invalid.";
    //     }
    //   }
    // }

    if (!responseText || responseText.trim() === "") {
      console.error("Empty response from Gemini or tool.");
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 500 }
      );
    }

    // extract user message content
    const userMessage = messages[messages.length - 1];
    let userContent = "";
    if (typeof userMessage.content === "string") {
      userContent = userMessage.content;
    } else if (Array.isArray(userMessage.content) && userMessage.content[0]?.text) {
      userContent = userMessage.content[0].text;
    } else if (userMessage.content && typeof userMessage.content === "object") {
      userContent = userMessage.content.text || JSON.stringify(userMessage.content);
    }

    if (!userContent || userContent.trim() === "") {
      console.error("Empty user message content");
      return NextResponse.json(
        { error: "Invalid user message" },
        { status: 400 }
      );
    }

    const newUserMessage = {
      role: "user" as const,
      content: userContent,
      timestamp: new Date(),
    };

    const newAssistantMessage = {
      role: "assistant" as const,
      content: responseText.trim(),
      timestamp: new Date(),
      toolName,
      toolResult,
    };

    const updatedSession = await ChatMessage.findOneAndUpdate(
      { walletAddress },
      {
        $push: {
          messages: {
            $each: [newUserMessage, newAssistantMessage],
          },
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    const lastMessage = updatedSession.messages[updatedSession.messages.length - 1];
    console.log("Last saved message:", {
      role: lastMessage.role,
      content: lastMessage.content,
      toolName: lastMessage.toolName,
    });

    return NextResponse.json({
      response: responseText.trim(),
      toolName,
      toolResult,
    });

  } catch (error) {
    console.error("Error in chat route:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const chatSession = await ChatMessage.findOne({ walletAddress });

    if (!chatSession) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: chatSession.messages });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
}
