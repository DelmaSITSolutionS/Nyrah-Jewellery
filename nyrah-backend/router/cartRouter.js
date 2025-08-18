const express = require("express");
const router = express.Router();
const {
  addToCart,
  getUserCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCartController,
} = require("../controllers/cartController");

const { isAuthenticatedUser } = require("../middleware/auth");

router
.post("/cart", isAuthenticatedUser, addToCart)
.get("/cart", isAuthenticatedUser, getUserCart)
.delete("/cart/:id", isAuthenticatedUser, removeFromCart)
.put("/cart/:id",isAuthenticatedUser, updateCartItemQuantity)
.delete("/clear", isAuthenticatedUser, clearCartController);

module.exports = router;