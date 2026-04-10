import { generateAIResponse } from '../services/aiService.js';
import { getChatContext } from '../services/contextService.js';
import Chat from '../models/Chat.js';

// Temporary hardcoded session pending future Authentication integration
const DEFAULT_USER_ID = "default_user";

export const processChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, error: "Message content is required" });
    }

    // 1. Fetch or instantiate Chat Document
    let chatDoc = await Chat.findOne({ userId: DEFAULT_USER_ID });
    if (!chatDoc) {
      chatDoc = new Chat({ userId: DEFAULT_USER_ID, messages: [] });
    }

    // 2. Save user's message locally to DB
    chatDoc.messages.push({ role: 'user', content: message.trim() });
    await chatDoc.save();

    // 3. Compile context wrapper (Includes user's newly saved message)
    const previousContext = await getChatContext(DEFAULT_USER_ID, 12); // Extracted last 12 interactions safely
    
    const apiMessagesPayload = [
      { role: "system", content: "You are a helpful, conversational, and deeply concise AI Voice Assistant. You remember the conversation context. Keep responses natural for text-to-speech output, avoid writing raw code heavily." },
      ...previousContext
    ];

    // 4. Send the holistic conversation wrapper to AI
    const reply = await generateAIResponse(apiMessagesPayload);

    // 5. Append AI reply to DB permanently
    chatDoc.messages.push({ role: 'assistant', content: reply });
    await chatDoc.save();

    // 6. Return response according to spec
    return res.status(200).json({ reply });

  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const chatDoc = await Chat.findOne({ userId: DEFAULT_USER_ID });
    
    if (!chatDoc) {
      return res.status(200).json({ messages: [] });
    }
    
    // Morph DB schema precisely into frontend UI prop structures
    const formattedMessages = chatDoc.messages.map(m => ({
      sender: m.role === 'user' ? 'user' : 'ai',
      text: m.content,
      timestamp: m.timestamp
    }));

    return res.status(200).json({ messages: formattedMessages });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await Chat.deleteOne({ userId: DEFAULT_USER_ID });
    return res.status(200).json({ success: true, message: "History gracefully wiped" });
  } catch (error) {
    next(error);
  }
};
