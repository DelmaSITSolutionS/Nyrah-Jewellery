// controllers/ratingController.js
const Rating = require("../models/ratingModel.js");
const Product = require("../models/productModel.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");

const calculateAverageRating = async (productId) => {
  const ratings = await Rating.find({ product: productId });

  const total = ratings.length;
  const average = ratings.reduce((acc, item) => acc + item.rating, 0) / total;

  await Product.findByIdAndUpdate(productId, {
    rating: average || 0,
    numOfRatings: total
  });
};

exports.createOrUpdateRating = catchAsyncErrors(async (req, res) => {
  const { productId } = req.params;
  const { rating, review } = req.body;

  let existing = await Rating.findOne({ product: productId, user: req.user._id });

  if (existing) {
    existing.rating = rating;
    existing.review = review;
    await existing.save();
  } else {
    await Rating.create({
      product: productId,
      user: req.user._id,
      rating,
      review
    });
  }

   // ✅ Recalculate product average rating
  await calculateAverageRating(productId);

  res.status(200).json({ message: "Rating submitted successfully" });
});

exports.getProductRatings = catchAsyncErrors(async (req, res) => {
  const { productId } = req.params;

  const ratings = await Rating.find({ product: productId })
    .populate("user", "name avatar");

  res.status(200).json({ ratings });
});
