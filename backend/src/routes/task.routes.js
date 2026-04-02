import express from "express";
import {
  createTask,
  updateTaskStatus,
  assignTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "manager", "user"), createTask);
router.put("/:id", protect, authorizeRoles("admin", "manager", "user"), updateTask);
router.delete("/:id", protect, authorizeRoles("admin", "manager"), deleteTask);
router.patch("/:id/status", protect, authorizeRoles("admin", "manager", "user"), updateTaskStatus);
router.patch("/:id/assign", protect, authorizeRoles("admin", "manager"), assignTask);
router.get("/", protect, getTasks);

export default router;