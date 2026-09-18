import express from "express";

import { loginUser, registerUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {getProfile} from "../controllers/profile.controller.js"

const router = express.Router()

router.post("/register",  registerUser)
router.post("/login",  loginUser)
router.get("/profile", authMiddleware, getProfile)

export default router