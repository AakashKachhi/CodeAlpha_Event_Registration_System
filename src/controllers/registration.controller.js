import { cancelUserRegistrationService, eventRegistration, getUserRegistrationsService } from "../services/registration.service.js"

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
    if (error.message === "User not found") {
      return res.status(404).json({
        message: error.message,
      })
    }
    if (error.message === "Event not found") {
      return res.status(404).json({
        message: error.message,
      })
    }

    return res.status(500).json({
      message: "Something went wrong",
    })
  }
}

export const getUserRegistrations = async (req, res) => {
  const userId = req.user.userId

  try {
    const userRegistrations = await getUserRegistrationsService(userId)
    if(userRegistrations.length === 0) return res.status(200).json({message: "NO registrations"})

    res.status(200).json({message: "Here is the Registration of User", userRegistrations: userRegistrations})
  } catch (error) {
    return res.status(500).json({message: "Something went wrong"})
  }
}

export const cancelUserRegistration = async (req, res) => {
  const userId = req.user.userId
  const eventId = req.params.eventId

  try {
    await cancelUserRegistrationService(userId, eventId)
    res.status(200).json({message: "User's Event Registration cancelled"})
  } catch (error) {
    if (error.message === "No Registration Found") {
      return res.status(404).json({
        message: error.message,
      })
    }
    return res.status(500).json({message: "Something went wrong"})
  }
}