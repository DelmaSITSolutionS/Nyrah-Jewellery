const mongoose = require("mongoose");

const instaPostSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InstaPost", instaPostSchema);
