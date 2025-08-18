const express = require("express");
const router = express.Router();
const {
  createRazorpayOrder,
  verifyPayment,
} = require("../controllers/paymentController");

router.post("/payment/create-order", createRazorpayOrder);
router.post("/payment/verify", verifyPayment);

module.exports = router;