// routes/index.js
import express from 'express';
import { registerFarmer, getTotalArea, downloadFarmerData } from '../controllers/farmerController.js';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json('Welcome to the Backend Server');
});

router.post('/register', registerFarmer);
router.post('/login', loginUser);
router.post('/totalarea',getTotalArea);
router.post('/download',downloadFarmerData);

export default router;
