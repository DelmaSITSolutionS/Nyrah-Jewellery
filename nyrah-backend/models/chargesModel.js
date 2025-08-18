const mongoose = require("mongoose");

const ChargesSchema = new mongoose.Schema(
  {
    gstRate: { type: Number, default: 0.03 }, // 3%

    domesticShipping: { type: Number, default: 0 }, // Free

    internationalShipping: [
      {
        country: { type: String, required: true },
        courier: { type: String, required: true },
        charge: { type: Number, required: true },
      },
    ],

    otherCharges: {
      engraving: { type: Number, default: 199 },
      hallmarking: { type: Number, default: 99 },
      specialRequestDefault: { type: Number, default: 499 },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Charges", ChargesSchema);
