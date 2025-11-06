import express from 'express';
import middlewares from '../middlewares/index.js';
import roleController from '../controllers/role.controller.js';

const router = express.Router();

// Public hoặc admin mới thao tác roles
router.get(
    '/', 
    middlewares.auth,
    middlewares.role('admin'),  
    roleController.getAllRoles
);

router.post(
    '/', 
    middlewares.auth,
    middlewares.role('admin'),  
    roleController.createRole
);

router.get(
    '/:id',
    middlewares.auth,
    middlewares.role('admin'),  
    roleController.getRoleById
);

router.patch(
    '/:id', 
    middlewares.auth,
    middlewares.role('admin'),  
    roleController.updateRole
);

router.delete(
    '/:id', 
    middlewares.auth,
    middlewares.role('admin'),  
    roleController.deleteRole
);

export default router;