import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, isAdmin, updateProject);
router.delete("/:id", protect, isAdmin, deleteProject);

export default router;