import express from "express"

import { registerForEvent, getUserRegistrations, cancelUserRegistration } from "../controllers/registration.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/registerForEvent/:eventId", authMiddleware, registerForEvent)
router.get("/getUserRegisterEvent", authMiddleware, getUserRegistrations)
router.delete("/cancelUserRegistration/:eventId", authMiddleware, cancelUserRegistration)

export default router