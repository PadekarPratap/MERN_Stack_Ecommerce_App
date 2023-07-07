import asyncHandler from "express-async-handler";
import Product from "../model/product.js";
import ErrorHandler from "../../utils/errorHandler.js";
import User from "../model/user.js";
import getDataUri from "../../utils/datauri.js";
import cloudinary from "cloudinary";

export const getAllProducts = asyncHandler(async (req, res, next) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

    const category = req.query.category ? { category: req.query.category } : {} // in category regex is not used because we will always get the full category name

  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  const skip = pageSize * (page - 1);

  const count = await Product.countDocuments({ ...keyword, ...category });

  const products = await Product.find({ ...keyword, ...category })
    .limit(pageSize)
    .skip(skip);

  res.status(200).json({
    success: true,
    message: "All Products fetched successfully!",
    products,
    page,
    pages: Math.ceil(count / pageSize),
  });
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return next(new ErrorHandler("No Product found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Product fetched successfully!",
    product,
  });
});

export const createProduct = asyncHandler(async (req, res, next) => {
  const { name, price, category, brand, countInStock, description } = req.body;

  const { _id } = req.user;

  const user = await User.findById(_id);

  const file = req.file;
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    folder: "CodeShopPro-Ecommerce",
  });

  const product = await Product.create({
    user: user._id,
    name,
    image: myCloud.secure_url,
    countInStock,
    description,
    price,
    category,
    brand,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("No product found", 404));

  const deletedProduct = await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    product: deletedProduct,
  });
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("No Product found", 404));

  const file = req.file;
  let myCloud;

  if (file) {
    const fileUri = getDataUri(file);
    myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "CodeShopPro-Ecommerce",
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: { ...req.body, image: myCloud?.secure_url || product.image } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully!",
    product: updatedProduct,
  });
});

export const createAReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { _id, name } = req.user;
  const { rating, comment } = req.body;

  let product = await Product.findById(id);

  if (!product) return next(new ErrorHandler("No Product found!", 404));

  const reviewExist = product.reviews.find(
    (review) => review.user_id.toString() === _id.toString()
  );

  if (reviewExist)
    return next(new ErrorHandler(`Review by ${name} already exist.`, 400));

  const review = {
    user_id: _id,
    name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);

  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.reduce((acc, review) => (acc += review.rating), 0) /
    product.reviews.length;

  await product.save();

  res.status(201).json({
    success: true,
    message: "Review created successfully!",
    product,
  });
});
