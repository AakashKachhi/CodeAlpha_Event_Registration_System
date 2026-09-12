import User from "../models/user.model.js"


import { createEventService, getEvents } from "../services/event.service.js"

export const createEvent = async (req, res) => {
  const { eventName, date, location, description, capacity } = req.body

  try {
    const userRole = await User.findById(req.user.userId)

    if (!userRole) return res.status(403).json({ message: "Invalid User Role" })

    if (userRole.role != "organizer")
      return res.status(403).json({ message: "You don't have permission" })

    const event = await createEventService(
      eventName,
      date,
      location,
      description,
      capacity,
      req.user.userId,
    )

    res
      .status(201)
      .json({
        message: "Event Created",
        data: {
          EventName: event.eventName,
          Date: event.date,
          Location: event.location,
          Description: event.description,
          Capacity: event.capacity,
        },
      })
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" })
  }
}

export const getAllEvents = async(req, res) => {
    try {
        const events = await getEvents()

        if(events.length === 0) return res.status(404).json({message: "No Event found"})

        res.status(200).json({message: "All Events", events: events})
 
    } catch (error) {
        return res.status(500).json({message: "Something went wrong"})
    }
}