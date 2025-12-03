import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { listUsers, deleteUser, listItems, deleteItem } from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);

router.get('/items', listItems);
router.delete('/items/:id', deleteItem);

export default router;
