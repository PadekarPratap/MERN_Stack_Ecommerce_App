import express from 'express'
import productRouter from './api/routes/product.js'
import userRouter from './api/routes/user.js'
import orderRouter from './api/routes/order.js'
import paymentRouter from './api/routes/payment.js'
import { errorMiddleWare } from './middleware/errorMiddleware.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cors({origin: ['https://codeshoppro.netlify.app'], credentials: true}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.get('/api/config/key', (req,res) => res.send(process.env.RAZORPAY_API_KEY))


// product routes
app.use('/api/products', productRouter)
// user routes
app.use('/api/users', userRouter)
// order routes
app.use('/api/orders', orderRouter)
// payment routes
app.use('/api', paymentRouter)


// error handling
app.use(errorMiddleWare)


export default app