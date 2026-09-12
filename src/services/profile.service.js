import User from "../models/user.model.js"

export const fetchProfile = async (userId) => {
    return await User.findById(userId)   
}