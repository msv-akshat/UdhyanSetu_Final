// routes/index.js
import express from 'express';
import multer from 'multer';
import { registerFarmer, getTotalArea, downloadFarmerData } from '../controllers/farmerController.js';
import { loginUser } from '../controllers/authController.js';
import { uploadFarmerExcel } from '../controllers/uploadController.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: '/tmp', // ✅ Safe for Render
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({storage})

router.get('/', (req, res) => {
  res.json('Welcome to the Backend Server');
});

router.post('/register', registerFarmer);
router.post('/login', loginUser);
router.post('/totalarea',getTotalArea);
router.post('/download',downloadFarmerData);
router.post('/upload-excel', upload.single('excel'), uploadFarmerExcel)

export default router;
