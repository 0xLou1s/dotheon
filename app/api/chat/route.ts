import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { ChatMessage } from "@/lib/db/models/ChatMessage";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

// Create a custom provider instance
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Google API key is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { messages, walletAddress } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    console.log("Processing messages:", messages);

    try {
      // Connect to MongoDB
      await connectDB();

      const { text } = await generateText({
        model: google("gemini-2.0-flash"),
        system: SYSTEM_PROMPT,
        messages,
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

      // Store the conversation in MongoDB
      const chatSession = await ChatMessage.findOneAndUpdate(
        { walletAddress },
        {
          $push: {
            messages: [
              {
                role: "user",
                content: messages[messages.length - 1].content[0].text,
                timestamp: new Date(),
              },
              {
                role: "assistant",
                content: text,
                timestamp: new Date(),
              },
            ],
          },
        },
        { upsert: true, new: true }
      );

      console.log("Received response from Gemini and stored in DB");
      return NextResponse.json({ response: text });
    } catch (modelError) {
      console.error("Gemini API error:", modelError);
      return NextResponse.json(
        { error: "Error calling Gemini API" },
        { status: 500 }
      );
    }
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

    return NextResponse.json({ messages: chatSession?.messages || [] });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      { error: "Failed to fetch chat history" },
      { status: 500 }
    );
  }
} 