import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "manager", "user"), createUser);
router.get("/", protect, authorizeRoles("admin"), getUsers);

export default router;