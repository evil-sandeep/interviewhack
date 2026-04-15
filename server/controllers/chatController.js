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

export const processAudioMessage = async (req, res, next) => {
  const { audio } = req.body;

  if (!audio) {
    return res.status(400).json({ success: false, error: "No audio data provided" });
  }

  try {
    const userId = req.user._id.toString();

    // 1. Fetch or instantiate Chat Document
    let chatDoc = await Chat.findOne({ userId });
    if (!chatDoc) {
      chatDoc = new Chat({ userId, messages: [] });
    }

    // 2. Retrieve recent history for context
    const previousContext = await getChatContext(userId, 8);
    
    // 3. Construct the Multimodal Message with Transcription Requirement
    const multimodalMessage = {
      role: "user",
      content: [
        { 
          type: "text", 
          text: "I am an interviewee. Always start your response by transcribing exactly what I said in brackets like [Transcribed: ...]. Then, provide brief, high-impact coaching points for the question or answer identified in the audio. Be extremely concise." 
        },
        { 
          type: "input_audio",
          input_audio: { 
            data: audio,
            format: "webm" 
          } 
        }
      ]
    };

    // 4. Generate AI response using the consistent system prompt
    const apiMessagesPayload = [
      { 
        role: "system", 
        content: `You are a high-performance Real-Time Interview Assistant. 
        IDENTITY: Professional, encouraging, and deeply technical.
        RESPONSE FORMAT:
        [Transcribed: the user's question]
        Answer:
        * [High Impact Point 1]
        * [High Impact Point 2]
        * [Strategic Tip / Follow-up]`
      },
      ...previousContext,
      multimodalMessage
    ];

    const reply = await generateAIResponse(apiMessagesPayload);

    // 5. Persist the interaction
    const transMatch = reply.match(/\[Transcribed:\s*(.*?)\]/i);
    const transcription = transMatch ? transMatch[1] : "[Voice Message]";
    
    chatDoc.messages.push({ role: 'user', content: transcription });
    chatDoc.messages.push({ role: 'assistant', content: reply.replace(/\[Transcribed:.*?\]/i, '').trim() });
    await chatDoc.save();

    res.status(200).json({
      success: true,
      reply: reply
    });
  } catch (error) {
    console.error("Audio Message Controller Error:", error);
    
    // Specific handling for OpenRouter balance issues
    if (error.status === 402 || error.message.includes('402')) {
      return res.status(402).json({
        success: false,
        error: "Insufficient balance on OpenRouter for audio. Please add at least $0.50 to your OpenRouter account or add a GOOGLE_AI_API_KEY to your .env file to use the direct free tier.",
        suggestion: "Add GOOGLE_AI_API_KEY to your .env file."
      });
    }

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
