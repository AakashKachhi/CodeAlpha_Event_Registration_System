import Event from "../models/event.model.js"
import User from "../models/user.model.js"
import Registration from "../models/registration.model.js"

export const eventRegistration = async (userId , eventId) => {
    try {
        const event = await Event.findById(eventId)
        if(!event) throw new Error("Event not found")
        
        const user = await User.findById(userId)
        if(!user) throw new Error("User not found")

        const eventCount = await Registration.countDocuments({event: eventId})
        if(eventCount >= event.capacity) throw new Error("Limited Reached no more registration for the event")

        const existingRegistration = await Registration.findOne({
           event: eventId, user: userId
        })
        if(existingRegistration) throw new Error("User already registration for this event")

        const newRegistration = new Registration({event: eventId, user: userId})
        await newRegistration.save()

        return newRegistration
    } catch (error) {
        throw error
    }

   
}

export const getUserRegistrationsService =  async (userId) => {
    return await Registration.find({user: userId}).populate("event")
}

export const cancelUserRegistrationService = async (userId, eventId) => {
    try {
        const cancelRegistration = await Registration.findOneAndDelete({user: userId, event: eventId})
        if(cancelRegistration === null) throw new Error("No Registration Found")
        
        return cancelRegistration
    } catch (error) {
        throw error
    }
}
