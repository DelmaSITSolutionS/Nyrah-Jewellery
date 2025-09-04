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

const updateMaterial = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { tag, sub } = req.body; // `sub` is now expected to be an object with `old` and `new`

  const material = await MaterialMenu.findById(id);
  if (!material) {
    return res.status(404).json({ message: "MaterialMenu not found" });
  }

  // Update tag name
  if (tag && tag.trim() !== material.tag) {
    const exists = await MaterialMenu.findOne({ tag: tag.trim() });
    if (exists) {
      return res.status(400).json({
        message: "Another material with this name already exists",
      });
    }
    material.tag = tag.trim();
  }

  // Update a specific sub-material
  if (sub && sub.old && sub.new) {
    const oldTrimmed = sub.old.trim();
    const newTrimmed = sub.new.trim();

    const index = material.sub.findIndex(
      (s) => s.toLowerCase() === oldTrimmed.toLowerCase()
    );

    if (index === -1) {
      return res.status(400).json({
        message: `Subcategory '${oldTrimmed}' not found`,
      });
    }

    material.sub[index] = newTrimmed;
  }

  await material.save();

  res.status(200).json({
    success: true,
    message: "Material updated successfully",
    material,
  });
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
  updateMaterial,
  getAllMaterials,
  deleteMaterial,
};
