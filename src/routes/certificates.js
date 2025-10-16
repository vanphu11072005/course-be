// import express from 'express';
// import middlewares from '../middlewares/index.js';
// import {
//   getUserCertificates,
//   getCertificateById,
//   createCertificate,
//   updateCertificate,
//   deleteCertificate
// } from '../controllers/certificate.controller.js';

// const router = express.Router();

// router.get('/users/:userId/certificates', middlewares.auth, getUserCertificates);
// router.get('/users/:userId/certificates/:id', middlewares.auth, getCertificateById);

// // Phát hành certificate (system/admin)
// router.post('/users/:userId/certificates', middlewares.auth, middlewares.role('admin'), createCertificate);
// router.patch('/:id', middlewares.auth, middlewares.role('admin'), updateCertificate);
// router.delete('/:id', middlewares.auth, middlewares.role('admin'), deleteCertificate);

// export default router;
