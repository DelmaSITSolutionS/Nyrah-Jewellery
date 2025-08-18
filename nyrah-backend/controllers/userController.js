const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendOtpMail = require("../utils/sendOtpMail");

const sendOtp = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new ErrorHandler("Email and password required", 400));

  let user = await User.findOne({ email });
  // Login flow
  if (user) {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler("Invalid credentials", 401));
  } else {
    // Sign‑up flow
    user = await User.create({ email, password });
  }

  // Generate 6‑digit code
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otpCode = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 min
  await user.save({ validateBeforeSave: false });

  await sendOtpMail(email, otp);

  res.status(200).json({
    success: true,
    message: "OTP sent to e‑mail",
    email,
  });
});

const verifyOtp = catchAsyncErrors(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (
    !user ||
    user.otpCode !== otp ||
    user.otpExpire < Date.now()
  ) {
    return next(new ErrorHandler("Invalid or expired OTP", 400));
  }

  // OTP valid
  user.isVerified = true;
  user.otpCode = undefined;
  user.otpExpire = undefined;
  await user.save({ validateBeforeSave: false });

  // Finally issue JWT
  sendToken(user, 200, res);
});

const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({ success: true, user });
});

const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const updates = req.body;
  const userId = req.user._id;

  const updatedUser = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

const adminUpdateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  const updatedUser = await User.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });


  if (!updatedUser) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
});

const logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // recommended for production
    sameSite: "Lax", // adjust if using cross-origin frontend
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// GET  /admin/users  – list every user (admin only)
const getAllUsers = catchAsyncErrors(async (req, res) => {
  const users = await User.find().select("-password"); // hide hashed pwd
  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

module.exports = { sendOtp,verifyOtp,getUserProfile, updateProfile,adminUpdateUser, logoutUser, deleteUser, getAllUsers };
