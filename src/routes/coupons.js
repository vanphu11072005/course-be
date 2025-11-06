import express from 'express';
import middlewares from '../middlewares/index.js';
import couponController from '../controllers/coupon.controller.js';

const router = express.Router();

router.get('/', couponController.getAllCoupons);
router.get('/:id', couponController.getCouponById);

// Chỉ admin thao tác
router.post('/', middlewares.auth, middlewares.role('admin'), couponController.createCoupon);
router.patch('/:id', middlewares.auth, middlewares.role('admin'), couponController.updateCoupon);
router.delete('/:id', middlewares.auth, middlewares.role('admin'), couponController.deleteCoupon);

export default router;