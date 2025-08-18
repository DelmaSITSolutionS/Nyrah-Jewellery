// routes/discountBannerRoutes.js
const express = require("express");
const router = express.Router();
const { singleImageUpload } = require("../middleware/upload");

const {
  getAllDiscountBanners,
  createDiscountBanner,
  updateDiscountBanner,
  deleteDiscountBanner,
} = require("../controllers/discountBannerController");

router
  .get("/discountbanner", getAllDiscountBanners)
  .post("/discountbanner", singleImageUpload, createDiscountBanner)
  .put("/discountbanner/:id", singleImageUpload, updateDiscountBanner)
  .delete("/discountbanner/:id", deleteDiscountBanner);

module.exports = router;
