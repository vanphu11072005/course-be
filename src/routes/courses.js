import express from 'express';
import middlewares from '../middlewares/index.js';
import courseController from '../controllers/course.controller.js';

const router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

// ===== Instructor/Admin =====
router.post('/', middlewares.auth, middlewares.role('instructor', 'admin'), middlewares.upload.single('thumbnail'), courseController.createCourse);
router.patch('/:id', middlewares.auth, middlewares.role('instructor', 'admin'), middlewares.upload.single('thumbnail'), courseController.updateCourse);
router.delete('/:id', middlewares.auth, middlewares.role('instructor', 'admin'), courseController.deleteCourse);

// ===== Instructor Dashboard =====
router.get('/instructors/me/courses', middlewares.auth, middlewares.role('instructor'), courseController.getInstructorCourses);
router.get('/instructors/me/students', middlewares.auth, middlewares.role('instructor'), courseController.getInstructorStudents);
router.get('/instructors/me/revenue', middlewares.auth, middlewares.role('instructor'), courseController.getInstructorRevenue);

export default router;
