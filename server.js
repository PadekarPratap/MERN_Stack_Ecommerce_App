import app from "./app.js"
import {config} from 'dotenv'
import connectDB from "./config/db.js";
import colors from 'colors'
import Razorpay from "razorpay";
import cloudinary from 'cloudinary'


config({
    path: './.env'
})

connectDB()

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})


cloudinary.v2.config({
    cloud_name: process.env.CLD_CLOUD_NAME,
    api_key: process.env.CLD_API_KEY,
    api_secret: process.env.CLD_API_SECRET
})


app.listen(process.env.PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`.yellow.bold));