// import express from 'express';
// import middlewares from '../middlewares/index.js';
// import {
//   getUserEnrollments,
//   getCourseEnrollments,
//   getEnrollmentById,
//   createEnrollment,
//   updateEnrollment,
//   deleteEnrollment
// } from '../controllers/enrollment.controller.js';

// const router = express.Router();

// router.get('/users/:userId/enrollments', middlewares.auth, getUserEnrollments);
// router.get('/courses/:courseId/enrollments', middlewares.auth, middlewares.role('instructor','admin'), getCourseEnrollments);
// router.get('/:id', middlewares.auth, getEnrollmentById);
// router.post('/', middlewares.auth, middlewares.role('instructor','admin'), createEnrollment);
// router.patch('/:id', middlewares.auth, middlewares.role('instructor','admin'), updateEnrollment);
// router.delete('/:id', middlewares.auth, middlewares.role('admin'), deleteEnrollment);

// export default router;
