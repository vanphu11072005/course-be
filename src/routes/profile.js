import express from 'express';
import middlewares from '../middlewares/index.js';
import { profileControler } from '../controllers/profile.controller.js';

const router = express.Router();

// User thao tác profile của chính mình
router.get(
    '/me', 
    middlewares.auth,
    profileControler.getProfile
);

router.patch(
    '/me', 
    middlewares.auth,
    middlewares.upload.single('avatar'),  
    profileControler.updateProfile
);

export default router;