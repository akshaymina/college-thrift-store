import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { listUsers, deleteUser, restoreUser, listDeletedUsers, listItems, deleteItem, restoreItem, listDeletedItems } from '../controllers/adminController.js';

const router = Router();

router.use(requireAuth, requireAdmin);

router.get('/users', listUsers);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/restore', restoreUser);
router.get('/users/deleted/list', listDeletedUsers);

router.get('/items', listItems);
router.delete('/items/:id', deleteItem);
router.post('/items/:id/restore', restoreItem);
router.get('/items/deleted/list', listDeletedItems);

export default router;
