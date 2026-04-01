import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "manager", "user"), createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, authorizeRoles("admin"), updateProject);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

export default router;