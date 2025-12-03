import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { trackView, getViewHistory, getTrendingItems } from '../controllers/viewHistoryController.js';

const router = Router();

router.post('/track', trackView);
router.get('/trending', getTrendingItems);
router.get('/history', requireAuth, getViewHistory);

export default router;
