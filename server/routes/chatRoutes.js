import express from 'express';
import { processChatMessage, getHistory, clearHistory } from '../controllers/chatController.js';

const router = express.Router();

router.post('/message', processChatMessage);
router.get('/history', getHistory);
router.delete('/clear', clearHistory);

export default router;
