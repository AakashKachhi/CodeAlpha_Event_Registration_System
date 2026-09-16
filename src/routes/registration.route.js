import express from "express"

import { registerForEvent } from "../controllers/registration.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/registerForEvent/:eventId", authMiddleware, registerForEvent)

export default router