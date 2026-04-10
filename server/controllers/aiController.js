import { generateAIResponse } from '../services/aiService.js';

export const processChatMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    // Validate request
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({
        success: false,
        error: "Message content is required"
      });
    }

    // Call service to generate response
    const reply = await generateAIResponse(message);

    // Return the response according to spec
    return res.status(200).json({
      reply
    });

  } catch (error) {
    // Pass to global error handler
    next(error);
  }
};
