const Customization = require("../models/customizationModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncError = require("../middleware/catchAsyncErrors.js");

// ========================
// CREATE customization
// ========================
exports.createCustomization = catchAsyncError(async (req, res, next) => {
  const { productGroup, metalPurity, stoneType } = req.body;

  if (!productGroup) {
    return next(new ErrorHandler("Product Group is required", 400));
  }

  const customization = await Customization.create({
    productGroup,
    metalPurity,
    stoneType,
  });

  res.status(201).json({
    success: true,
    customization,
  });
});

// ========================
// GET all customizations
// ========================
exports.getAllCustomizations = catchAsyncError(async (req, res, next) => {
  const customizations = await Customization.find();

  res.status(200).json({
    success: true,
    count: customizations.length,
    customizations,
  });
});

// ========================
// GET customization by productGroup
// ========================
exports.getCustomizationByProductGroup = catchAsyncError(
  async (req, res, next) => {
    const { productGroup } = req.params;

    const customization = await Customization.findOne({ productGroup });

    if (!customization) {
      return next(
        new ErrorHandler(`No customization found for ${productGroup}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      customization,
    });
  }
);

// ========================
// UPDATE customization
// ========================
exports.updateCustomization = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  let customization = await Customization.findById(id);

  if (!customization) {
    return next(new ErrorHandler("Customization not found", 404));
  }

  customization = await Customization.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    customization,
  });
});

// ========================
// DELETE customization
// ========================
exports.deleteCustomization = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  const customization = await Customization.findById(id);

  if (!customization) {
    return next(new ErrorHandler("Customization not found", 404));
  }

  await customization.deleteOne();

  res.status(200).json({
    success: true,
    message: "Customization deleted successfully",
  });
});
