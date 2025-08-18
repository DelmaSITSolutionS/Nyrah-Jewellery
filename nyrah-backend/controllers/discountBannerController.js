const DiscountBanner = require("../models/discountBannerModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { uploadSingleImageToCloudinary } = require("../utils/uploadImages");

// Create Discount Banner
exports.createDiscountBanner = catchAsyncErrors(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  const result = await uploadSingleImageToCloudinary(req.file, "discount-banner");

  const banner = await DiscountBanner.create({
    image: result.secure_url, // Only save URL
    title: req.body.title,
  });

  res.status(201).json({
    success: true,
    message: "Discount banner created successfully",
    banner,
  });
});

// Get All Discount Banners
exports.getAllDiscountBanners = catchAsyncErrors(async (req, res) => {
  const banners = await DiscountBanner.find().sort({ createdAt: -1 }).limit(5);
  res.status(200).json({ success: true, banners });
});

// Update Discount Banner
exports.updateDiscountBanner = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const banner = await DiscountBanner.findById(id);
  if (!banner) {
    return res.status(404).json({ success: false, message: "Banner not found" });
  }

  if (req.file) {
    const result = await uploadSingleImageToCloudinary(req.file, "discount-banner");
    banner.image = result.secure_url;
  }

  if (req.body.title) {
    banner.title = req.body.title;
  }

  await banner.save();

  res.status(200).json({
    success: true,
    message: "Discount banner updated successfully",
    banner,
  });
});

// Delete Discount Banner
exports.deleteDiscountBanner = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;

  const banner = await DiscountBanner.findById(id);
  if (!banner) {
    return res.status(404).json({ success: false, message: "Banner not found" });
  }

  await banner.deleteOne();

  res.status(200).json({
    success: true,
    message: "Discount banner deleted successfully",
  });
});
