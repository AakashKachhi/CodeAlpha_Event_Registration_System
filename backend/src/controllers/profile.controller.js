import { fetchProfile } from "../services/profile.service.js"

export const getProfile = async (req, res) => {
    try {
        const profile = await fetchProfile(req.user.userId)

        if(!profile) return res.status(404).json({message: "Profile not found"})

        res.status(200).json({
            displayName: profile.displayName,
            username: profile.username,
            email: profile.email,
            role: profile.role
        })
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}
