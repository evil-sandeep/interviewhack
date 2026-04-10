import express from 'express';
import { processChatMessage } from '../controllers/aiController.js';

const router = express.Router();

// POST /api/ai/chat
router.post('/chat', processChatMessage);

export default router;
