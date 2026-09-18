import mongoose from "mongoose";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
        trim: true
    }, 
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    role: {
        type: String,
        enum: ["user", "organizer"],
        default: "user"
    }
})


// hashing password 
userSchema.pre("save", async function() {
    if(!this.isModified("password")) return 

    this.password = await bcrypt.hash(this.password, 10)
})

// comparing password
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

export default mongoose.model("User", userSchema)