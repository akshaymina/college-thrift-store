import { Router } from 'express';
import { body } from 'express-validator';
import { login, signup, me, logout } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', [
  body('name').isString().trim().isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isStrongPassword({ minLength: 8, minSymbols: 0 }).withMessage('Password must be 8+ chars incl. numbers & mixed case')
], signup);

router.post('/login', [
  body('email').isEmail(),
  body('password').isString().isLength({ min: 1 })
], login);

router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

export default router;
