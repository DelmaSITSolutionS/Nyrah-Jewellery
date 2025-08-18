const mongoose = require("mongoose");

const MaterialMenuSchema = new mongoose.Schema({
  tag: { type: String, required: true, unique: true, trim: true }, // "silver"
  sub: { type: [String], default: [] }, // ["All", "Ring", "Pendant"]
});

module.exports = mongoose.model("MaterialMenu", MaterialMenuSchema);
