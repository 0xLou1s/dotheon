import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/ai/system-prompt";

// Create a custom provider instance
const google = createGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Check if API key is configured
    if (!process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
      console.error("Google API key is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    console.log("Processing messages:", messages);

    try {
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

      console.log("Received response from Gemini");
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