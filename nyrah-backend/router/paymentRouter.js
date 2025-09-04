const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
  createPaypalOrder,
  capturePaypalOrder,
} = require("../controllers/paymentController");

// Razorpay
router.post("/payment/create-order", createRazorpayOrder);
router.post("/payment/verify", verifyPayment);

// PayPal
router.post("/payment/paypal/create-order", createPaypalOrder);
router.post("/payment/paypal/capture-order", capturePaypalOrder);

module.exports = router;
