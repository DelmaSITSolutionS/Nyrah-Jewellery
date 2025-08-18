// models/ratingModel.js
const mongoose =require("mongoose");

const ratingSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  review: {
    type: String,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

ratingSchema.index({ product: 1, user: 1 }, { unique: true }); // user can rate a product only once

module.exports = mongoose.model("Rating", ratingSchema);
