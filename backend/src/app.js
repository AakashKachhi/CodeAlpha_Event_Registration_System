import express from "express"

import authRoutes from "./routes/auth.route.js"
import eventRoute from "./routes/event.route.js"
import registrationRoute  from "./routes/registration.route.js"

const app = express()

// Allow the Vite development server (or a separately deployed frontend) to
// call this API. The Vite proxy also works without this, but these headers are
// needed whenever the apps are served from different origins.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL || "http://localhost:5173")
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")

  if (req.method === "OPTIONS") return res.sendStatus(204)
  next()
})

app.use(express.json())
app.use("/api/auth/", authRoutes)
app.use("/api/event/", eventRoute)
app.use("/api/register/", registrationRoute)



export default app
