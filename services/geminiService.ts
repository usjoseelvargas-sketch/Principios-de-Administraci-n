import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { GEMINI_API_KEY, GEMINI_TEXT_MODEL } from '../constants';
import { GeminiServiceError } from "../types";

// Ensure API_KEY is handled correctly. For client-side, this is problematic.
// This service assumes API_KEY is available in the environment, which is typical for server-side.
// For a pure client-side app without a backend proxy, this API key would be exposed.
// In a real production app, this call would be made from a backend.
// For this exercise, we proceed assuming it's somehow configured (e.g. via a build step or a secure proxy not shown here).

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!process.env.API_KEY) {
    // This error will likely always be thrown in a typical client-side create-react-app setup
    // unless process.env.API_KEY is defined through webpack DefinePlugin or similar.
    console.error("API_KEY is not configured. Gemini API calls will fail.");
    throw new Error("API_KEY_MISSING");
  }
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};


export const generateText = async (prompt: string, systemInstruction?: string): Promise<string | GeminiServiceError> => {
  try {
    const client = getAiClient();
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      ...(systemInstruction && { config: { systemInstruction } })
    });
    return response.text;
  } catch (error: any) {
    console.error("Error generating text from Gemini:", error);
    if (error.message === "API_KEY_MISSING") {
         return { message: "Error: API Key for Gemini is not configured. Please contact support." };
    }
    return { message: error.message || "An unknown error occurred with the AI service." };
  }
};

export const generateTextWithJsonOutput = async (prompt: string, systemInstruction?: string): Promise<any | GeminiServiceError> => {
  try {
    const client = getAiClient();
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        ...(systemInstruction && { systemInstruction }),
        responseMimeType: "application/json",
      }
    });

    let jsonStr = response.text.trim();
    // A more robust way to clean potential markdown fences
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse JSON response from Gemini:", parseError, "Raw response:", jsonStr);
      // Attempt to find JSON within the string if parsing fails
      const jsonMatch = jsonStr.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (jsonMatch) {
          try {
              return JSON.parse(jsonMatch[0]);
          } catch (e) {
               return { message: "AI returned an invalid JSON format that could not be recovered." };
          }
      }
      return { message: "AI returned an invalid JSON format." };
    }

  } catch (error: any) {
    console.error("Error generating JSON from Gemini:", error);
     if (error.message === "API_KEY_MISSING") {
         return { message: "Error: API Key for Gemini is not configured. Please contact support." };
    }
    return { message: error.message || "An unknown error occurred with the AI service." };
  }
};


// Basic chat functionality (can be expanded)
let globalChat: Chat | null = null;

export const startOrGetChat = (systemInstruction?: string): Chat => {
  if (!globalChat) {
    const client = getAiClient();
    globalChat = client.chats.create({
        model: GEMINI_TEXT_MODEL,
        ...(systemInstruction && { config: { systemInstruction } })
    });
  }
  return globalChat;
}

export const sendMessageInChat = async (chat: Chat, message: string): Promise<string | GeminiServiceError> => {
    try {
        const response: GenerateContentResponse = await chat.sendMessage({message: message});
        return response.text;
    } catch (error: any) {
        console.error("Error sending chat message:", error);
         if (error.message === "API_KEY_MISSING") {
         return { message: "Error: API Key for Gemini is not configured. Please contact support." };
        }
        return { message: error.message || "An unknown error occurred with the AI chat." };
    }
}
// Placeholder for streaming chat if needed in future
// export const sendMessageInChatStream = async (chat: Chat, message: string) => { ... }


// Note: If process.env.API_KEY is not set (e.g. in a browser environment without specific webpack config),
// getAiClient() will throw an error, and all functions will return a GeminiServiceError.
// A more robust solution for client-side apps is to route API calls through a backend proxy
// that securely stores and uses the API key.
// For this coding exercise, we assume the key is present.

// Example of how you might use Search Grounding (Not implemented in UI for this version)
/*
export const generateTextWithSearch = async (prompt: string): Promise<GenerateContentResponseWithGrounding | GeminiServiceError> => {
  try {
    const client = getAiClient();
    const response: GenerateContentResponse = await client.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    // Cast to allow access to groundingMetadata - ensure your types are correctly defined
    return response as GenerateContentResponseWithGrounding;
  } catch (error: any) {
    console.error("Error generating text with search from Gemini:", error);
    return { message: error.message || "An unknown error occurred with the AI service." };
  }
};
*/