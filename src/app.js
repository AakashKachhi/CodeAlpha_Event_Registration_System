import express from "express"

import authRoutes from "./routes/auth.route.js"
import eventRoute from "./routes/event.route.js"
import registrationRoute  from "./routes/registration.route.js"

const app = express()

app.use(express.json())
app.use("/api/auth/", authRoutes)
app.use("/api/event/", eventRoute)
app.use("/api/register/", registrationRoute)



export default app