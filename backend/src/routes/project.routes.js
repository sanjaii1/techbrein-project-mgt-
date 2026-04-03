import express from "express";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate, createProjectRules, updateProjectRules } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "manager", "user"), validate(createProjectRules), createProject);
router.get("/", protect, getProjects);
router.put("/:id", protect, authorizeRoles("admin"), validate(updateProjectRules), updateProject);
router.delete("/:id", protect, authorizeRoles("admin"), deleteProject);

export default router;