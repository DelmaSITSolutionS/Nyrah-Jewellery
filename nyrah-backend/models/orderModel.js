const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      detailsRef: { type: mongoose.Schema.Types.ObjectId,refPath: "items.detailsModel", required: true },
      detailsModel: { type: String, required: true },
      customizations: {
        type: Object, // key-value pairs like { stoneType: "Pearl", finish: "Matte" }
        default: {},
      }, // flexible structure
      basePrice: Number,
      customizationPrice: Number,
      finalPrice: Number,
      quantity: Number,
    },
  ],

  symbol:{
    type:String,
    default:"₹"
  },
  currency:{
    type:String,
    default:"INR"
  },

  shippingInfo: {
    name: String,
    street: String,
    city: String,
    state: String, // ← add this if needed
    pincode: String,
    country: { type: String, default: "India" },
    phone: String,
  },

  charges: {
    gst: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    engraving: { type: Number, default: 0 },
    hallmarking: { type: Number, default: 0 },
    specialRequest: { type: Number, default: 0 },
  },

  paymentInfo: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    paidAt: Date,
  },

  totalAmount: Number,
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
  statusMessage: {
    type: String, // message by admin during status update
    default: "Order in Processing",
  },
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
