import express from "express";

import { createEvent, getAllEvents, getEventById } from "../controllers/event.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post("/createEvent", authMiddleware, createEvent)
router.get("/getAllEvent", getAllEvents)
router.get("/getEvent/:eventId", getEventById)

export default router