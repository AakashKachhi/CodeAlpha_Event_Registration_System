import User from "../models/user.model.js"

export const loginService = async (username, email, password) => {
  try {
    const user = await User.findOne({
      $or: [{ username }, { email }],
    })

    if (!user){
        throw new Error("Invalid Username/email or password")
    }
      

    const isMatch = await user.comparePassword(password)

    if(!isMatch) {
        throw new Error("Invalid Username/email or password")
    }

    return user

  } catch (error) {
     throw error
  }
}
