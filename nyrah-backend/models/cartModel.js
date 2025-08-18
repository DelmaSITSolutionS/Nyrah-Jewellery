const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    detailsRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "detailsModel"
    },
    detailsModel: {
      type: String,
      required: true,
      enum: ["Ring", "Bracelet", "Necklace", "Earring", "Pendant"],
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    customizations: {
      type: Object, // key-value pairs like { stoneType: "Pearl", finish: "Matte" }
      default: {},
    },
    customizationPrice: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      required: true,
    },
    customizationKey: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
