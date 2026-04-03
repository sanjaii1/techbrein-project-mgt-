import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { validate, loginRules, registerRules } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post("/register", validate(registerRules), register);
router.post("/login", validate(loginRules), login);

export default router;
