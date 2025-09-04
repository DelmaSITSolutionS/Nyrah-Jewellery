const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },

  shortDescription: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: [true, "Please enter product price"],
    max: [99999999, "Price cannot exceed 8 digits"],
  },

  images: {
    type: [String],
    validate: [(val) => val.length >= 2, "At least 2 images are required"],
    required: true,
  },

  video: {
    type: String,
  },

  stock: {
    type: Number,
    default: 1,
    min: [0, "Stock cannot be negative"],
  },

  category: {
    main: { type: String, required: true },
    sub: {
      type: [String],
      default: [],
    },
  },

   material: {
    tag: { type: String, required: true },
    sub: {
      type: [String],
      default: [],
    },
  },

  rating: {
    type: Number,
    default: 0,
  },

  productGroup: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },

  detailsRef: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "detailsModel",
  },

  detailsModel: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ProductSchema.index({ name: "text" });

module.exports = mongoose.model("Product", ProductSchema);
