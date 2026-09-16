import { eventRegistration } from "../services/registration.service.js"

export const registerForEvent = async (req, res) => {
  const userId = req.user.userId
  const eventId = req.params.eventId
  try {
    await eventRegistration(userId, eventId)
    res
      .status(201)
      .json({ message: "You are successfully register for the event" })
  } catch (error) {
    if (error.message === "User already registration for this event") {
      return res.status(409).json({
        message: error.message,
      })
    }
    if (error.message === "Limited Reached no more registration for the event") {
      return res.status(409).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}
