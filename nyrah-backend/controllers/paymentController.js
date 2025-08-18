const Razorpay = require("razorpay");
const crypto = require("crypto");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});


//POST /payment/create-order
exports.createRazorpayOrder = async (req, res, next) => {
  const { amount } = req.body; // frontend sends calculated total price
  
  const options = {
    amount: Math.round(amount * 100), // in paise
    currency: "INR",
    receipt: `rcpt_${Date.now()}`,
  };

  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

// POST /payment/verify
exports.verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  res.status(200).json({ success: true, message: "Payment verified" });
};