// middleware/upload.js
import multer from 'multer';

const storage = multer.diskStorage({
  destination: '/tmp', // ✅ Safe for Render
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage });
