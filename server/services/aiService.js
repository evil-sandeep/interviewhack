import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Validates the API key and returns a configured OpenAI instance mapped to OpenRouter.
 */
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API Key is not defined. Please set OPENROUTER_API_KEY.");
  }
  
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:5173',
      'X-Title': 'MERN Voice Assistant', 
    }
  });
};

/**
 * Converts OpenAI message format to Google Generative AI format.
 */
const convertToGoogleFormat = (messages) => {
  // Filter context to only include required parts for Gemini
  return messages.map(msg => {
    if (Array.isArray(msg.content)) {
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: msg.content.map(part => {
          if (part.type === 'text') return { text: part.text };
          if (part.type === 'input_audio') {
            return {
              inlineData: {
                data: part.input_audio.data,
                mimeType: `audio/${part.input_audio.format || 'webm'}`
              }
            };
          }
          return { text: "" };
        })
      };
    }
    return {
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    };
  });
};

/**
 * Sends a conversation context array to the AI provider.
 * Automatically chooses between Google SDK and OpenRouter based on available keys.
 */
export const generateAIResponse = async (contextMessages) => {
  const googleApiKey = process.env.GOOGLE_AI_API_KEY;
  const modelId = process.env.AI_MODEL_ID || "openrouter/free";

  // PREFER DIRECT GOOGLE SDK IF KEY IS PRESENT (Avoids 402 balance issues)
  if (googleApiKey && googleApiKey.trim() !== "") {
    try {
      console.log(`[AI Service] Using DIRECT Google Generative AI SDK (${modelId})`);
      const genAI = new GoogleGenerativeAI(googleApiKey);
      
      // Extract system message if present
      const systemMessage = contextMessages.find(m => m.role === 'system');
      const filteredContext = contextMessages.filter(m => m.role !== 'system');
      
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemMessage ? systemMessage.content : undefined
      });

      const history = convertToGoogleFormat(filteredContext);
      const userMessage = history.pop(); // Last message is the current query

      const chat = model.startChat({
        history: history,
        generationConfig: {
          maxOutputTokens: 450,
          temperature: 0.7,
        },
      });

      const result = await chat.sendMessage(userMessage.parts);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error("[AI Service] Direct Google SDK Error:", error.message);
      // Fallback to OpenRouter if configured and it wasn't a fatal auth error
      if (!process.env.OPENROUTER_API_KEY) throw error;
      console.log("[AI Service] Falling back to OpenRouter...");
    }
  }

  // DEFAULT TO OPENROUTER (OPENAI SDK)
  try {
    const openai = getOpenRouterClient();
    console.log(`[AI Service] Using OpenRouter API (${modelId})`);
    
    const response = await openai.chat.completions.create({
      model: modelId,
      messages: contextMessages,
      max_tokens: 450,
      temperature: 0.7,
    });

    if (!response.choices || response.choices.length === 0) {
      throw new Error("No response choices returned from OpenRouter.");
    }

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error(`AI Service Error (${modelId}):`, error.message);
    
    // Automatic Fallback to auto-router if explicit model fails on OpenRouter
    if (modelId !== "openrouter/free") {
      console.log("[AI Service] Attempting fallback to openrouter/free...");
      try {
         const openai = getOpenRouterClient();
         const fallbackResponse = await openai.chat.completions.create({
            model: "openrouter/free",
            messages: contextMessages,
            max_tokens: 450,
            temperature: 0.7,
         });
         return fallbackResponse.choices[0].message.content.trim();
      } catch (fallbackError) {
         console.error("AI Fallback Service Error:", fallbackError.message);
         throw fallbackError;
      }
    }
    
    throw error;
  }
};
