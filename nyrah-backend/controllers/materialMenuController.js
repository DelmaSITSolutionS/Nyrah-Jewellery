const MaterialMenu = require("../models/materialMenuModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create a new material menu
const createMaterialMenu = catchAsyncErrors(async (req, res, next) => {
  const { tag, sub } = req.body;

  const existing = await MaterialMenu.findOne({ tag });
  if (existing) {
    return next(new ErrorHandler("Material already exists", 400));
  }

  if (sub == "") {
    const material = await MaterialMenu.create({ tag });
    return res.status(201).json({ success: true, material, message: "Material created" });
  }

  const material = await MaterialMenu.create({ tag, sub });
  res.status(201).json({ success: true, material, message: "Material created" });
});

// Add subcategory to a material menu
const addSubToMaterial = catchAsyncErrors(async (req, res, next) => {
  const { tag, sub } = req.body;

  if (sub == "") {
    return next(new ErrorHandler("Fill subcategory name", 400));
  }

  const material = await MaterialMenu.findOneAndUpdate(
    { tag },
    { $addToSet: { sub } }, // prevents duplicates
    { new: true }
  );

  if (!material) {
    return next(new ErrorHandler("Material not found", 404));
  }

  res.status(200).json({ success: true, material, message: "Subcategory added" });
});

// Remove subcategory from a material menu
const removeSubFromMaterial = catchAsyncErrors(async (req, res, next) => {
  const { tag, sub } = req.body;

  const material = await MaterialMenu.findOneAndUpdate(
    { tag },
    { $pull: { sub } },
    { new: true }
  );

  if (!material) {
    return next(new ErrorHandler("Material not found", 404));
  }

  res.status(200).json({ success: true, material, message: "Subcategory removed" });
});

// Get all material menus
const getAllMaterials = catchAsyncErrors(async (req, res) => {
  const materials = await MaterialMenu.find();
  res.status(200).json({ success: true, materials });
});

// Delete a material menu
const deleteMaterial = catchAsyncErrors(async (req, res, next) => {
  const { tag } = req.params;
  const result = await MaterialMenu.findOneAndDelete({ tag });

  if (!result) {
    return next(new ErrorHandler("Material not found", 404));
  }

  res.status(200).json({ success: true, message: "Material deleted" });
});

module.exports = {
  createMaterialMenu,
  addSubToMaterial,
  removeSubFromMaterial,
  getAllMaterials,
  deleteMaterial,
};
