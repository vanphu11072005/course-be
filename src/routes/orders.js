import express from 'express';
import middlewares from '../middlewares/index.js';
import orderController from '../controllers/order.controller.js';

const router = express.Router();

router.get("/", orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.patch(
    '/:id', 
    middlewares.auth,
    middlewares.role('admin'), 
    orderController.updateOrder
);

router.delete(
    '/:id', 
    middlewares.auth,
    middlewares.role('admin'), 
    orderController.deleteOrder
);

// route riêng cho user
router.get(
    '/users/:userId/orders', 
    middlewares.auth, 
    orderController.getUserOrders
);

export default router;
