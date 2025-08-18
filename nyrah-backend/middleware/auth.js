const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

//  Middleware to check if user is logged in
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  
  if (!token) {
    return next(new ErrorHandler("Please login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decodedData.id); 
 

  if (!req.user) {
    return next(new ErrorHandler("User no longer exists", 401));
  }

  next();
});

//  Middleware to check if user has authorized role (e.g., admin)
exports.isAuthorizedRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) { 
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
