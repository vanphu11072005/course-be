// import express from 'express';
// import middlewares from '../middlewares/index.js';
// import {
//   getMyProfile,
//   createMyProfile,
//   updateMyProfile,
//   deleteMyProfile,
//   getAllProfiles,
//   getProfileById,
//   updateProfileById,
//   deleteProfileById,
// } from '../controllers/profile.controller.js';

// const router = express.Router();

// // User thao tác profile của chính mình
// router.get('/me', middlewares.auth, getMyProfile);
// router.post('/me', middlewares.auth, createMyProfile);
// router.patch('/me', middlewares.auth, updateMyProfile);
// router.delete('/me', middlewares.auth, deleteMyProfile);

// // Admin thao tác tất cả profile
// router.get('/', middlewares.auth, middlewares.role('admin'), getAllProfiles);
// router.get('/:id', middlewares.auth, middlewares.role('admin'), getProfileById);
// router.patch('/:id', middlewares.auth, middlewares.role('admin'), updateProfileById);
// router.delete('/:id', middlewares.auth, middlewares.role('admin'), deleteProfileById);

// export default router;
