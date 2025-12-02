import { Router } from 'express';
import { param, body } from 'express-validator';
import { requireAuth } from '../middleware/auth.js';
import { createRequest, listMyRequests, listReceived, updateRequest } from '../controllers/requestController.js';


const router = Router();


// Create a buy request (buyer)
router.post('/items/:id/requests', requireAuth, [param('id').isMongoId()], createRequest);


// List my requests (buyer)
router.get('/requests/mine', requireAuth, listMyRequests);


// List requests received (seller)
router.get('/requests/received', requireAuth, listReceived);


// Update a request (seller-only)
router.patch('/requests/:id', requireAuth, [
param('id').isMongoId(),
body('status').isIn(['accepted', 'rejected'])
], updateRequest);


export default router;