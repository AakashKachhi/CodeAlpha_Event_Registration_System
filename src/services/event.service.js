import User from "../models/user.model.js"
import Event from "../models/event.model.js"

export const createEventService = async (eventName, date, location, description, capacity, userId) => {
    const user = await User.findById(userId)

    if(!user) {
        throw new Error("Invalid User")
    }

    const newEvent = new Event({eventName, date, location, description, capacity})
    await newEvent.save()

    return newEvent
    
}

export const getEvents = async () => {
    return await Event.find()
}