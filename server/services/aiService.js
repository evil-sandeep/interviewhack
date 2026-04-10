import OpenAI from 'openai';

/**
 * Validates the API key and returns a configured OpenAI instance mapped to OpenRouter.
 */
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is not defined in environment variables. Please set OPENROUTER_API_KEY.");
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
 * Sends a conversation context array to the OpenRouter API and retrieves the response.
 * @param {Array} contextMessages - Array of strictly typed message objects
 * @returns {Promise<string>} The AI's response text.
 */
export const generateAIResponse = async (contextMessages) => {
  try {
    const openai = getOpenRouterClient();
    
    const response = await openai.chat.completions.create({
      model: "openrouter/auto", 
      messages: contextMessages,
      max_tokens: 400,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw error;
  }
};
