import User from "../models/user.model.js"

export const registerUser = async (req, res) => {
  const { displayName, username, email, password } = req.body

  if (!displayName || !username || !email || !password)
    return res.status(400).json({ message: "Required Field Missing" })

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    })

    if (existingUser)
      return res
        .status(400)
        .json({ message: "Username or email already exists" })

    const newUser = new User({displayName, username, email, password})
    await newUser.save()

    res
      .status(201)
      .json({
        success: true,
        message: "User Registered Successful",
        data: {
          DisplayName: newUser.displayName,
          username: newUser.username,
          email: newUser.email,
        },
      })
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error in Registering User",
        error: error.message,
      })
  }
}
