import express from "express";
import middlewares from '../middlewares/index.js';
import { getMaintenanceStatus, toggleMaintenance } from "../controllers/setting.controller.js";

const router = express.Router();

router.get("/maintenance", getMaintenanceStatus);

router.put(
    "/maintenance",
    middlewares.role("admin"),
    toggleMaintenance
);

export default router;
