import express from 'express';
import middlewares from '../middlewares/index.js';
import orderItemController from '../controllers/orderItem.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', orderItemController.getOrderItems);
router.get('/:id', orderItemController.getOrderItemById);
router.post('/', middlewares.auth, middlewares.role('admin'), orderItemController.createOrderItem);
router.patch('/:id', middlewares.auth, middlewares.role('admin'), orderItemController.updateOrderItem);
router.delete('/:id', middlewares.auth, middlewares.role('admin'), orderItemController.deleteOrderItem);

export default router;
