import asyncHandler from "express-async-handler";
import ErrorHandler from "../../utils/errorHandler.js";
import User from "../model/user.js";
import Order from "../model/order.js";
import Product from "../model/product.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const {
    orderItems,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    orderId,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return next(new ErrorHandler("No orders placed", 404));
  }

  const user = await User.findById(_id);

  // when the order is placed, the products quantity must be reduced from the stock
  // console.log(orderItems)
  orderItems.map(async (item) => {
    const productInOrderList = await Product.findById(item.product);
    if (productInOrderList) {
      await Product.findByIdAndUpdate(
        item.product,
        { $set: { countInStock: productInOrderList.countInStock - item.qty } },
        { new: true }
      );
    }
  });

  const order = await Order.create({
    orderItems,
    shippingAddress,
    shippingPrice,
    taxPrice,
    totalPrice,
    paymentMethod,
    user: user._id,
    orderStatus: {
      orderId,
    },
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

export const getOrderDetails = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).populate("user");

  if (!order) {
    return next(new ErrorHandler("No order found", 404));
  }

  res.status(200).json({
    sucess: true,
    message: "Order fetched successfully!",
    order,
  });
});

export const getUserOrders = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const orders = await Order.find({ user: _id });

  if (orders.length === 0) {
    return next(new ErrorHandler("No orders found", 404));
  }

  res.status(200).json({
    success: true,
    message: "orders fetched successfully!",
    orders,
  });
});

export const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate("user");

  res.status(200).json({
    success: true,
    message: "All orders fetched successfully!",
    orders,
  });
});


export const updateOrder = asyncHandler(async(req,res,next) =>{

  const { isDelivered, deliveredAt } = req.body 

  const { id } = req.params

  const order = await Order.findById(id)

  if(!order) return next(new ErrorHandler('No Order found', 404))

  const updatedOrder = await Order.findByIdAndUpdate(id, {$set: { isDelivered, deliveredAt }}, {new: true})

  res.status(200).json({
    success:true,
    message: "Order updated successfully!",
    order: updatedOrder
  })


})

// export const updateOrderPay = asyncHandler(async (req, res, next) => {

//     const { orderId } = req.params

//     const order = await Order.findById(orderId)

//     if(!order){
//         return next(new ErrorHandler('No order found', 404))
//     }

//     order.isPaid = true
//     order.paidAt = new Date(Date.now())
//     order.paidStatus = {...req.body}

//     const updatedOrder = await order.save()

//     res.status(204).json({
//         success: true,
//         message: "Order updated successfully",
//         order: updatedOrder
//     })

// });
