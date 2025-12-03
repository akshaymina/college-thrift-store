import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { addToWishlist, removeFromWishlist, getWishlist, checkWishlist } from '../controllers/wishlistController.js';

const router = Router();

router.use(requireAuth);

router.post('/', addToWishlist);
router.get('/', getWishlist);
router.delete('/:itemId', removeFromWishlist);
router.get('/check/:itemId', checkWishlist);

export default router;
