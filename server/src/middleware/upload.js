import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';


const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');


// Ensure uploads directory exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });


const storage = multer.diskStorage({
destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
filename: (_req, file, cb) => {
const ext = path.extname(file.originalname).toLowerCase();
const name = crypto.randomBytes(8).toString('hex');
cb(null, `${Date.now()}_${name}${ext}`);
}
});


function fileFilter (_req, file, cb) {
const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
if (!ok) return cb(new Error('Only JPG, PNG, WEBP images are allowed'));
cb(null, true);
}


export const uploadImages = multer({
storage,
fileFilter,
limits: { fileSize: 5 * 1024 * 1024, files: 5 } // 5MB x up to 5 images
});