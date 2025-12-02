import { Router } from 'express';
import { body, param, query } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { listItems, getItem, createItem, updateItem, updateStatus, deleteItem } from '../controllers/itemController.js';
import { uploadImages } from '../middleware/upload.js';

const router = Router();


// List with search/filter/pagination
router.get('/', [
query('page').optional().isInt({ min: 1 }),
query('limit').optional().isInt({ min: 1, max: 100 }),
query('minPrice').optional().isFloat({ min: 0 }),
query('maxPrice').optional().isFloat({ min: 0 })
], listItems);


// Read single
router.get('/:id', [param('id').isMongoId()], getItem);


// Create
router.post('/', requireAuth, uploadImages.array('images', 5), [
body('title').isString().trim().isLength({ min: 3 }),
body('price').isFloat({ min: 0 }),
body('category').isString().trim().isLength({ min: 2 }),
body('condition').optional().isIn(['new', 'like-new', 'good', 'fair']),
body('description').optional().isString().trim(),
body('campus').optional().isString().trim()
], createItem);


// Update
router.patch('/:id', requireAuth, uploadImages.array('images', 5), [
param('id').isMongoId(),
body('title').optional().isString().trim().isLength({ min: 3 }),
body('price').optional().isFloat({ min: 0 }),
body('category').optional().isString().trim().isLength({ min: 2 }),
body('condition').optional().isIn(['new', 'like-new', 'good', 'fair']),
body('description').optional().isString().trim(),
body('campus').optional().isString().trim(),
body('replaceImages').optional().isBoolean(),
body('remove').optional().isArray()
], updateItem);


// Update status
router.patch('/:id/status', requireAuth, [
param('id').isMongoId(),
body('status').isIn(['available', 'reserved', 'sold'])
], updateStatus);


// Delete
router.delete('/:id', requireAuth, [param('id').isMongoId()], deleteItem);


export default router;