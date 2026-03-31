import express from "express";
import { createUser, getUsers } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createUser);
router.get("/", protect, isAdmin, getUsers);

export default router;