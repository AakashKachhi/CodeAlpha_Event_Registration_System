import express from "express";

import { createEvent, getAllEvents } from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/createEvent", authMiddleware, createEvent)
router.get("/getAllEvent", getAllEvents)

export default router