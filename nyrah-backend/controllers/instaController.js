const InstaPost = require("../models/instaModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {uploadSingleImageToCloudinary} = require("../utils/uploadImages"); // Make sure this is correct

// Create Insta Post
exports.createInstaPost = catchAsyncErrors(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  const result = await uploadSingleImageToCloudinary(req.file, "insta-post");

  const instaPost = await InstaPost.create({
    post: result.secure_url, // ✅ Only save the URL, not the whole object
    url: req.body.url,
  });

  res.status(201).json({
    success: true,
    message: "Insta post created successfully",
    instaPost,
  });
});

// Get All Insta Posts
exports.getAllInstaPosts = catchAsyncErrors(async (req, res) => {
  const posts = await InstaPost.find().sort({ createdAt: -1 }).limit(5);
  res.status(200).json({ success: true, posts });
});

// Update Insta Post
exports.updateInstaPost = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const instaPost = await InstaPost.findById(id);
  if (!instaPost) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  if (req.file) {
    instaPost.post = await uploadSingleImageToCloudinary(req.file, "insta-post");
  }

  if (req.body.url) {
    instaPost.url = req.body.url;
  }

  await instaPost.save();

  res.status(200).json({
    success: true,
    message: "Insta post updated successfully",
    instaPost,
  });
});

// Delete Insta Post
exports.deleteInstaPost = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const instaPost = await InstaPost.findById(id);
  if (!instaPost) {
    return res.status(404).json({ success: false, message: "Post not found" });
  }

  await instaPost.deleteOne();

  res.status(200).json({
    success: true,
    message: "Insta post deleted successfully",
  });
});
