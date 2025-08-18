const Category = require("../models/categoryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const createcategory = catchAsyncErrors(async (req, res, next) => {
  const { main, sub } = req.body;

  const existing = await Category.findOne({ main });
  if (existing) {
    return next(new ErrorHandler("Main category already exists", 400));
  }

  if (sub == "") {
    const category = await Category.create({ main });
    return res
      .status(201)
      .json({ success: true, category, message: "Category created" });
  }

  const category = await Category.create({ main, sub });
  res
    .status(201)
    .json({ success: true, category, message: "Category created" });
});

const addSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { main, sub } = req.body; // sub = string (e.g. "Promise Ring")

  if (sub == "") {
    return next(new ErrorHandler("Fill subCategory Name", 400));
  }

  const category = await Category.findOneAndUpdate(
    { main },
    { $addToSet: { sub } }, // prevents duplicates
    { new: true }
  );

  if (!category) {
    return next(new ErrorHandler("Main category not found", 404));
  }

  res
    .status(200)
    .json({ success: true, category, message: "subCategory added" });
});

const removeSubcategory = catchAsyncErrors(async (req, res, next) => {
  const { main, sub } = req.body;

  const category = await Category.findOneAndUpdate(
    { main },
    { $pull: { sub: sub } },
    { new: true }
  );

  if (!category) {
    return next(new ErrorHandler("Main category not found", 404));
  }

  res
    .status(200)
    .json({ success: true, category, message: "subCategory removed" });
});

const getAllCategories = catchAsyncErrors(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ success: true, categories });
});

const deleteMainCategory = catchAsyncErrors(async (req, res, next) => {
  const { main } = req.params;
  const result = await Category.findOneAndDelete({ main });

  if (!result) {
    return next(new ErrorHandler("Main category not found", 404));
  }

  res.status(200).json({ success: true, message: "Category deleted" });
});

const updateCategory = catchAsyncErrors(async (req, res) => {
  const { id } = req.params;
  const { main, sub } = req.body; // `sub` is now expected to be an object with `old` and `new`

  const category = await Category.findById(id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  // Update main name
  if (main && main.trim() !== category.main) {
    const exists = await Category.findOne({ main: main.trim() });
    if (exists) {
      return res.status(400).json({
        message: "Another category with this name already exists",
      });
    }
    category.main = main.trim();
  }

  // Update a specific sub-category
  if (sub && sub.old && sub.new) {
    const oldTrimmed = sub.old.trim();
    const newTrimmed = sub.new.trim();

    const index = category.sub.findIndex(
      (s) => s.toLowerCase() === oldTrimmed.toLowerCase()
    );

    if (index === -1) {
      return res.status(400).json({
        message: `Subcategory '${oldTrimmed}' not found`,
      });
    }

    category.sub[index] = newTrimmed;
  }

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
});

module.exports = {
  createcategory,
  addSubcategory,
  removeSubcategory,
  getAllCategories,
  deleteMainCategory,
  updateCategory,
};
