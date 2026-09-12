import jwt from "jsonwebtoken"

export const genTokens = (userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn:"1h"})

    return token
}