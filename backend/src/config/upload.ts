import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), 'uploads', 'profile-images'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${crypto.randomUUID()}${ext}`;
        cb(null, uniqueName);
    },
});

export const uploadImage = multer({
    storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIMETYPES.includes(file.mimetype)) {
            return cb(new Error('INVALID_FILE_TYPE'));
        }
        cb(null, true);
    },
});