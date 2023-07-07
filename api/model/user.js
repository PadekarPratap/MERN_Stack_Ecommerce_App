import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is a required field"]
    },
    email:{
        type: String,
        required: [true, 'Email is a required field'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'Password is a required field'],
        select: false
    },
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    },
    userShippingAddress: {
        address:{
            type: String,
        },
        city: {
            type: String,
        },
        postalCode: {
            type: String,
        },
        country: {
            type: String,
        }
    }
}, {timestamps: true})

const User = mongoose.model('User', userSchema)

export default User

