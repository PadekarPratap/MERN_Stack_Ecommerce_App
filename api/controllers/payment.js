import asyncHandler from "express-async-handler";
import { instance } from "../../server.js";
import crypto from 'crypto'
import Order from "../model/order.js";

function generateHmacSha256(data, key) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(data);
  return hmac.digest('hex');
}

export const checkout = asyncHandler(async (req, res, next) => {
  const { amount } = req.body;

  const options = {
    amount: Number(amount), // amount in the smallest currency unit
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  // console.log(order);
  res.status(200).json({
    success: true,
    order,
  });
});


export const paymentVerification = asyncHandler(async(req,res,next) =>{

  const { razorpay_payment_id, razorpay_order_id,razorpay_signature } = req.body

  const {orderId} = req.query

  const order = await Order.findOne({orderStatus: {orderId: razorpay_order_id}})
  console.log(order)

  const generated_signature = generateHmacSha256(razorpay_order_id + "|" + razorpay_payment_id, process.env.RAZORPAY_API_SECRET);

  if (generated_signature == razorpay_signature) {

    // save in database
    order.isPaid = true
    order.paidAt = new Date(Date.now())
    await order.save()
    //  payment is successfull
    res.redirect(`${process.env.REDIRECT_ON_PAYMENT_SUCCESS}/paymentsuccess?ref=${razorpay_payment_id}`)

  }else{
    res.status(400).json({
      success: false,
      message: "Payment failed please try again!"
    })
  }


})
