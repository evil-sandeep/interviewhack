import { generateAIResponse } from '../services/aiService.js';
import { getChatContext } from '../services/contextService.js';
import Chat from '../models/Chat.js';

// The hardcoded session is REMOVED! We now map dynamically off the verified JWT!

export const processChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const userId = req.user._id.toString();

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ success: false, error: "Message content is required" });
    }

    // 1. Fetch or instantiate Chat Document mapped precisely to the Verified User ID
    let chatDoc = await Chat.findOne({ userId });
    if (!chatDoc) {
      chatDoc = new Chat({ userId, messages: [] });
    }

    chatDoc.messages.push({ role: 'user', content: message.trim() });
    await chatDoc.save();

    const previousContext = await getChatContext(userId, 12); 
    
    const apiMessagesPayload = [
      { 
        role: "system", 
        content: `You are a high-performance Real-Time Interview Assistant. 
        Your goal is to help a candidate by providing brief, high-impact talking points for questions they are asked.
        
        IDENTITY: Professional, encouraging, and deeply technical.
        RESPONSE FORMAT:
        Question: [Repeat the identified question]
        Answer:
        * [High Impact Point 1]
        * [High Impact Point 2]
        * [Strategic Tip / Follow-up]
        
        Keep each point to ONE short sentence. Be extremely concise. Avoid generic fluff.` 
      },
      ...previousContext
    ];


    const reply = await generateAIResponse(apiMessagesPayload);

    chatDoc.messages.push({ role: 'assistant', content: reply });
    await chatDoc.save();

    return res.status(200).json({ reply });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const chatDoc = await Chat.findOne({ userId });
    
    if (!chatDoc) {
      return res.status(200).json({ messages: [] });
    }
    
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
    const userId = req.user._id.toString();
    await Chat.deleteOne({ userId });
    return res.status(200).json({ success: true, message: "History gracefully wiped" });
  } catch (error) {
    next(error);
  }
};
