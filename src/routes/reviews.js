import express from 'express';
import middlewares from '../middlewares/index.js';
import reviewController from '../controllers/review.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getReviewById);

router.patch(
  '/:id/approve',
  middlewares.auth, middlewares.role('admin'), reviewController.approveReview
);

router.post('/', middlewares.auth, middlewares.role('student'), reviewController.createReview);
router.patch('/:id', middlewares.auth, middlewares.role('student'), reviewController.updateReview);
router.delete('/:id', middlewares.auth, middlewares.role('student'), reviewController.deleteReview);

export default router;
