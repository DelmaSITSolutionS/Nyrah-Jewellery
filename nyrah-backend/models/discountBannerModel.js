const mongoose = require("mongoose");

const discountBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DiscountBanner", discountBannerSchema);
