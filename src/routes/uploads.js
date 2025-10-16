import express from 'express';
import multer from 'multer';
import middlewares from '../middlewares/index.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Upload single file (field name: 'file')
router.post(
  '/',
  middlewares.auth,
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path,
      url: `/uploads/${req.file.filename}`
    });
  }
);

export default router;
