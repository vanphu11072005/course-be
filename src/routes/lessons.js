import express from 'express';
import middlewares from '../middlewares/index.js';
import lessonController from '../controllers/lesson.controller.js';

const router = express.Router({ mergeParams: true });

router.get('/', lessonController.getLessons);
router.get('/:id', lessonController.getLessonById);

router.post('/', middlewares.auth, middlewares.role('instructor'), lessonController.createLesson);
router.patch('/:id', middlewares.auth, middlewares.role('instructor'), lessonController.updateLesson);
router.delete('/:id', middlewares.auth, middlewares.role('instructor'), lessonController.deleteLesson);

export default router;
