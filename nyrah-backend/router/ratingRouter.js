// routes/ratingRoutes.js
const express = require("express")
const { createOrUpdateRating, getProductRatings } = require("../controllers/ratingController.js");
const { isAuthenticatedUser } = require("../middleware/auth.js");

const router = express.Router();

router.route("/rating/:productId").post(isAuthenticatedUser, createOrUpdateRating);
router.route("/rating/:productId").get(getProductRatings);

module.exports = router;
