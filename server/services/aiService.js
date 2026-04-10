import OpenAI from 'openai';

/**
 * Validates the API key and returns a configured OpenAI instance mapped to OpenRouter.
 */
const getOpenRouterClient = () => {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is not defined in environment variables. Please set OPENROUTER_API_KEY.");
  }
  
  // OpenRouter uses the exact same SDK as OpenAI, you just override the baseURL!
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'http://localhost:5173', // Your Vite client URL
      'X-Title': 'MERN Voice Assistant', 
    }
  });
};

/**
 * Sends a message to the OpenRouter API and retrieves the response.
 * @param {string} message - The user's message.
 * @returns {Promise<string>} The AI's response text.
 */
export const generateAIResponse = async (message) => {
  try {
    const openai = getOpenRouterClient();
    
    const response = await openai.chat.completions.create({
      // OpenRouter auto-routes, or you can specify free models like "nousresearch/nous-capybara-7b:free" or "google/gemini-pro"
      model: "openrouter/auto", 
      messages: [
        { role: "system", content: "You are a helpful, concise AI Voice Assistant. Respond conversationally but efficiently." },
        { role: "user", content: message }
      ],
      max_tokens: 250,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Service Error:", error.message);
    throw error;
  }
};
