const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const clientBaseUrl = process.env.FRONTEND_URI;
const sendMail = require("../utils/sendMail");
const ErrorHandler = require("../utils/errorHandler");

const generateProductCards = (items, orderId) => {
  return items
    .map(
      (it) => `
    <a href="${clientBaseUrl}/user/order/${orderId}" target="_blank" style="text-decoration: none; color: inherit;">
      <div style="display: flex; align-items: center; border: 1px solid #eee; padding: 10px; margin-bottom: 10px; border-radius: 8px;">
        <img src="${
          it.product.images?.[0] || "https://via.placeholder.com/60"
        }" alt="${
        it.product.name
      }" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 10px;" />
        <div>
          <div style="font-weight: 600;">${it.product.name}</div>
          <div>₹${it.finalPrice.toLocaleString()} × ${it.quantity}</div>
        </div>
      </div>
    </a>
  `
    )
    .join("");
};

// GET /order/new
exports.createOrderAfterPayment = catchAsyncErrors(async (req, res, next) => {
  const { cartItems, shippingInfo, paymentInfo, totalAmount, charges } =
    req.body;

  const order = await Order.create({
    user: req.user._id,
    items: cartItems,
    shippingInfo,
    charges,
    paymentInfo,
    totalAmount,
    status: "Processing",
  });

  // Email to USER
  const orderId = order._id.toString().slice(-6).toUpperCase();
  const fullOrderUrl = `${clientBaseUrl}/user/order/${order._id}`;
  const itemsHtml = generateProductCards(cartItems, order._id);

  // Email to USER
  await sendMail({
    to: req.user.email,
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <h2>Thank you for your purchase!</h2>
      <p>Your order <strong>#${orderId}</strong> has been placed successfully.</p>
      <p>Total Amount: ₹${totalAmount.toLocaleString()}</p>
      <p>We will notify you when your order is shipped.</p>
      <hr />
      <h3>Order Summary:</h3>
      ${itemsHtml}
      <p style="margin-top: 20px;">
        <a href="${fullOrderUrl}" target="_blank" style="background: #8A2BE2; color: white; padding: 10px 16px; border-radius: 5px; text-decoration: none;">View Your Order</a>
      </p>
    `,
  });

  // Email to ADMIN
  await sendMail({
    to: process.env.ADMIN_EMAIL,
    subject: `🛒 New Order Received - #${orderId}`,
    html: `
      <h2>New Order Received</h2>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Customer:</strong> ${req.user.email}</p>
      <p><strong>Total:</strong> ₹${totalAmount.toLocaleString()}</p>
      <hr />
      <h3>Items:</h3>
      ${itemsHtml}
      <p style="margin-top: 20px;">
        <a href="${fullOrderUrl}" target="_blank" style="background: #000; color: white; padding: 10px 16px; border-radius: 5px; text-decoration: none;">View Order in Admin Panel</a>
      </p>
    `,
  });

  res.status(201).json({ success: true, order });
});

exports.getUserOrders = catchAsyncErrors(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("items.product", "name images productGroup");
  res.status(200).json({ orders });
});

// GET /admin/orders
exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find()
    .populate("user", "name email") // optional
    .populate("items.product", "name images price productGroup") // only populate product
    .populate("items.detailsRef") // optional: populate user info
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  });
});

// GET /admin/order/:id
exports.getOrderDetailsByAdmin = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email") // optional
    .populate("items.product", "name images price productGroup") // only populate product
    .populate("items.detailsRef");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

//update order status
const buildItemCards = (items, orderId) =>
  items
    .map(
      (it) => `
<a href="${clientBaseUrl}/user/order/${orderId}" target="_blank" style="text-decoration:none;color:#000">
  <div style="display:flex;align-items:center;border:1px solid #eee;border-radius:8px;padding:8px;margin-bottom:8px">
    <img src="${
      it.product.images?.[0] || "https://via.placeholder.com/60"
    }" alt="${
        it.product.name
      }" style="width:60px;height:60px;object-fit:cover;border-radius:4px;margin-right:10px">
    <div>
      <div style="font-weight:600">${it.product.name}</div>
      <div>₹${it.finalPrice.toLocaleString()} × ${it.quantity}</div>
    </div>
  </div>
</a>`
    )
    .join("");

/* ── UPDATE STATUS + EMAIL ────────────────────────────────── */
exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const { id: orderId } = req.params;
  const { status, message } = req.body;

  const allowed = ["Processing", "Shipped", "Delivered", "Cancelled"];
  if (!allowed.includes(status))
    return next(new ErrorHandler("Invalid status value", 400));

  const order = await Order.findById(orderId)
    .populate("user", "email")
    .populate("items.product", "name images");
  if (!order) return next(new ErrorHandler("Order not found", 404));
  // if (order.status === "Delivered")
  //   return next(new ErrorHandler("Order is already delivered", 400));

  /* 1️⃣ update fields */
  order.status = status;
  if (message) order.statusMessage = message;
  if (status === "Shipped") order.shippedAt = new Date();
  if (status === "Delivered") order.deliveredAt = new Date();
  if (status === "Cancelled") order.cancelledAt = new Date();
  await order.save();

  /* 2️⃣ craft e‑mail */
  const orderIdShort = order._id.toString().slice(-6).toUpperCase();
  const orderUrl = `${clientBaseUrl}/user/order/${order._id}`;
  const itemCards = buildItemCards(order.items, order._id);

  let subject, intro;
  switch (status) {
    case "Shipped":
      subject = `📦 Your order #${orderIdShort} is on its way!`;
      intro = `<p>Great news! Your order has been <strong>shipped</strong>.</p>`;
      break;
    case "Delivered":
      subject = `✅ Order #${orderIdShort} delivered`;
      intro = `<p>Your order has been <strong>delivered</strong>. We hope you love it!</p>`;
      break;
    case "Cancelled":
      subject = `⚠️ Order #${orderIdShort} cancelled`;
      intro = `<p>Your order has been <strong>cancelled</strong>.</p>`;
      break;
    default:
      subject = `Update on your order #${orderIdShort}`;
      intro = `<p>Your order status is now <strong>${status}</strong>.</p>`;
  }

  await sendMail({
    to: order.user.email,
    subject,
    html: `
      ${intro}
      <hr>
      <h3>Order Summary</h3>
      ${itemCards}
      <p style="margin-top:20px">
        <a href="${orderUrl}" target="_blank" style="background:#8A2BE2;color:#fff;padding:10px 16px;border-radius:5px;text-decoration:none">
          View Order Details
        </a>
      </p>
      ${message ? `<p><em>Note from admin:</em> ${message}</p>` : ""}
    `,
  });

  /* 3️⃣ optional admin alert when cancelled */
  if (status === "Cancelled") {
    await sendMail({
      to: process.env.ADMIN_EMAIL,
      subject: `❌ Order #${orderIdShort} was cancelled`,
      html: `
        <p>Order <strong>#${orderIdShort}</strong> has been cancelled.</p>
        ${itemCards}
        <p><strong>User:</strong> ${order.user.email}</p>
      `,
    });
  }

  res.status(200).json({
    success: true,
    message: `Order marked as ${status}`,
    order,
  });
});
