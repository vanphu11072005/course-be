import express from 'express';
import middlewares from '../middlewares/index.js';
import categoryController from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin mới tạo, sửa, xóa
router.post('/', middlewares.auth, middlewares.role('admin'), categoryController.createCategory);
router.patch('/:id', middlewares.auth, middlewares.role('admin'), categoryController.updateCategory);
router.delete('/:id', middlewares.auth, middlewares.role('admin'), categoryController.deleteCategory);

export default router;
