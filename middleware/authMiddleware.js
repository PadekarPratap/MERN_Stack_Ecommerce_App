import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/errorHandler.js";
import User from "../api/model/user.js";

export const auth = async (req, res, next) => {

  const { codeShopToken } = req.cookies
  // console.log(codeShopToken)
  if(!codeShopToken){
    return next(new ErrorHandler('User not authorized. No token found', 404))
  }

  const decoded = jwt.verify(codeShopToken, process.env.JWT_SECRET)
  // console.log(decoded)
  req.user = await User.findById(decoded.id)
  next()

};


export const admin = (req, res, next) =>{

  const {  isAdmin } = req.user

  if(!isAdmin){
    return next(new ErrorHandler('Only admins are allowed to access this resource', 400))
  }

  next()
  
}
