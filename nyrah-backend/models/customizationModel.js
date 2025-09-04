const mongoose = require("mongoose");

const customizationSchema = new mongoose.Schema(
  {
    productGroup: {
      type: String,
      required: true, // e.g., "Ring", "Pendant", "Bracelet"
      trim: true,
    },
    metalPurity: [
      {
        value: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
      },
    ],
    stoneType: [
      {
        value: { type: String, required: true },
        price: { type: Number, required: true, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customization", customizationSchema);
