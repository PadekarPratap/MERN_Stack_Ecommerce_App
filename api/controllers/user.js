import asyncHandler from "express-async-handler";
import User from "../model/user.js";
import ErrorHandler from "../../utils/errorHandler.js";
import bcrypt from "bcrypt";
import moment from "moment";
import { generateToken } from "../../utils/generateToken.js";
import Order from "../model/order.js";

export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return next(
      new ErrorHandler(
        `User with the email, ${user.email} already exist. Try logging in`,
        400
      )
    );
  }

  const encryptPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email,
    password: encryptPassword,
    isAdmin: false,
  });

  res.status(201).json({
    success: true,
    message: "user has been created successfully!",
    user,
  });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }

  const compare = await bcrypt.compare(password, user.password);

  if (!compare) {
    return next(new ErrorHandler("Invalid email and password", 404));
  }

  generateToken(res, user._id);

  res.status(200).json({
    success: true,
    message: "login successfull",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      expiresAt: moment().add(2, "days").valueOf(),
    },
  });
});

export const getProfile = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  if (!user) {
    return next(new ErrorHandler("No user found!", 404));
  }

  res.status(200).json({
    success: true,
    message: "user profile fetched successfully!",
    user,
  });
});

export const updateProfile = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const user = await User.findById(_id);

  if (!user) {
    return next(new ErrorHandler("No user found", 404));
  }

  let encryptedPassword;

  if (req.body.password) {
    const { password } = req.body;
    encryptedPassword = await bcrypt.hash(password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      $set: { ...req.body, password: encryptedPassword || user.password },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "User has been updated successfully",
    user: updatedUser,
  });
});

export const logoutUser = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  res.cookie("codeShopToken", null, {
    httpOnly: true,
    sameSite:  process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    secure: process.env.NODE_ENV !== "development",
    expires: new Date(Date.now()),
  });

  res.status(200).json({
    success: true,
    message: `Logout successfull. ${user.email} has logged out.`,
  });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: "All users fetched successfully!",
    users,
  });
});

export const getSingleUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("No user found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("No user found", 404));
  }

  const deletedUser = await User.findByIdAndDelete(id);
  const deleteAllUserOrders = await Order.deleteMany({user: deletedUser._id})

  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
    user: deletedUser,
    ordersByUser: deleteAllUserOrders
  });
});

// update user info by Admin
export const updateUserInfo = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("No user found", 404));

  const updatedUser = await User.findByIdAndUpdate(
    id,
    { $set: { ...req.body } },
    { new: true }
  );

  res.status(201).json({
    success: true,
    message: "User updated successfully!",
    updatedUser
  })

});
