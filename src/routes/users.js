import express from 'express';
import middlewares from '../middlewares/index.js';
import userController from '../controllers/user.controller.js';

const router = express.Router();

// Admin thao tác tất cả user
router.get(
    '/', 
    middlewares.auth, 
    middlewares.role('admin'), 
    userController.getListUsers
);

router.get(
    '/:id', 
    middlewares.auth, 
    middlewares.role('admin'), 
    userController.getUserById
);

router.post(
    '/', 
    middlewares.auth, 
    middlewares.role('admin'), 
    middlewares.upload.single('avatar'), 
    userController.createUser
);

router.patch(
    '/:id', 
    middlewares.auth, 
    middlewares.role('admin'), 
    middlewares.upload.single('avatar'), 
    userController.updateUser
);

router.delete(
    '/:id', 
    middlewares.auth, 
    middlewares.role('admin'), 
    userController.deleteUser
);

export default router;