import express from "express";
import {
  createTask,
  updateTaskStatus,
  assignTask,
  getTasks,
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.patch("/:id/status", protect, updateTaskStatus);
router.patch("/:id/assign", protect, assignTask);
router.get("/", protect, getTasks);

export default router;