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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }

  res.status(200).json({ success: true, message: "Payment verified" });
};

// ----------------- PayPal -----------------
const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_BASE = process.env.PAYPAL_BASE; // sandbox


async function generateAccessToken() {
  const auth = Buffer.from(PAYPAL_CLIENT + ":" + PAYPAL_SECRET).toString(
    "base64"
  );
  const response = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await response.json();
  return data.access_token;
}

exports.createPaypalOrder = async (req, res) => {
  try {
    let { amount, currency = "USD" } = req.body;
    const accessToken = await generateAccessToken();

    // Ensure amount format
    const formattedAmount = Number(amount).toFixed(2);

    const orderResponse = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: formattedAmount.toString(),
            },
          },
        ],
        application_context: {
          brand_name: "Nyrah Jewellery",
          landing_page: "LOGIN", // or "BILLING"
          user_action: "PAY_NOW",
          return_url: `${process.env.FRONTEND_URI}/success`,
          cancel_url: `${process.env.FRONTEND_URI}/cancel`,
        },
      }),
    });

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error("PayPal Create Order Error:", errorText);
      return res.status(orderResponse.status).json({ error: errorText });
    }

    const order = await orderResponse.json();
    res.json(order);
  } catch (err) {
    console.error("PayPal Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.capturePaypalOrder = async (req, res) => {
  try {
    const { orderID } = req.body;
    const accessToken = await generateAccessToken();

    const captureResponse = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const capture = await captureResponse.json();
    res.json(capture);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};
