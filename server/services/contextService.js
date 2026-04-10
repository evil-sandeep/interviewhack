import Chat from '../models/Chat.js';

/**
 * Retrieves the user's conversational history and slices the latest context.
 * Useful for keeping OpenRouter memory short enough to save money and tokens.
 * @param {string} userId - The identifier of the user (e.g. 'default_user')
 * @param {number} limit - The number of previous messages to keep in memory (default 10)
 * @returns {Promise<Array>} Formatted message history for OpenAI API
 */
export const getChatContext = async (userId, limit = 8) => {
  try {
    const chatDoc = await Chat.findOne({ userId });
    
    if (!chatDoc || !chatDoc.messages || chatDoc.messages.length === 0) {
      return [];
    }

    // Get the last `limit` messages
    const recentMessages = chatDoc.messages.slice(-limit);

    // Filter strictly to 'user' and 'assistant' and strip MongoDB _id payloads
    return recentMessages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

  } catch (error) {
    console.error("Context Retrieval Error:", error);
    return []; // Proceed with empty memory rather than crashing if DB fails
  }
};
