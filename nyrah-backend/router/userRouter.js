const express = require("express");
const router = express.Router();
const {
  logoutUser,
  updateProfile,
  adminUpdateUser,
  deleteUser,
  getUserProfile,
  sendOtp,
  verifyOtp,
  getAllUsers,
} = require("../controllers/userController");
const { isAuthenticatedUser, isAuthorizedRole } = require("../middleware/auth");

router
  .post("/auth/send-otp", sendOtp)
  .post("/auth/verify-otp", verifyOtp)
  .get("/logout", isAuthenticatedUser, logoutUser);

router
  .get("/me", isAuthenticatedUser, getUserProfile)
  .put("/me/update", isAuthenticatedUser, updateProfile);

router
  .get(
    "/admin/users",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    getAllUsers
  )
  .put(
    "/admin/user/:id",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    adminUpdateUser
  )
  .delete(
    "/admin/user/:id",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    deleteUser
  );

module.exports = router;
