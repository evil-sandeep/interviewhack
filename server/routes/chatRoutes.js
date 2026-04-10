import express from 'express';
import { processChatMessage, getHistory, clearHistory } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js'; // Import Security Layer

const router = express.Router();

// Enforce Auth validation upstream inside this entire router file
router.use(protect);

router.post('/message', processChatMessage);
router.get('/history', getHistory);
router.delete('/clear', clearHistory);

export default router;
