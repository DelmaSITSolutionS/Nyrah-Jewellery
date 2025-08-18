const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  main: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  sub: {
    type: [String], // Array of subcategories
    default: []
  }
});

module.exports = mongoose.model("Category", CategorySchema);
