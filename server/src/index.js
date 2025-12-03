import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import adminRoutes from './routes/admin.js';
import { notFound, errorHandler } from './middleware/error.js';
import path from 'path';

import itemRoutes from './routes/items.js';
import requestRoutes from './routes/request.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/items', itemRoutes);
app.use('/api', requestRoutes);

// Static files for uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    // Ensure admin user exists if env provided
    (async function ensureAdmin(){
      try{
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
        if (ADMIN_EMAIL && ADMIN_PASSWORD){
          const User = (await import('./models/User.js')).default;
          const bcrypt = (await import('bcrypt')).default;
          const existing = await User.findOne({ email: ADMIN_EMAIL });
          if (!existing){
            const passHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await User.create({ name: 'Admin', email: ADMIN_EMAIL, passHash, role: 'admin' });
            console.log('Admin user created:', ADMIN_EMAIL);
          } else {
            console.log('Admin user exists:', ADMIN_EMAIL);
          }
        }
      }catch(err){ console.error('Admin ensure error', err) }
    })();

    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect DB', err);
    process.exit(1);
  });
export default app;