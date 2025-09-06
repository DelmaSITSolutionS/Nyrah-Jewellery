const express = require("express");
const {
  createProductByCategory,
  getFirstProductsInGroups,
  getProductsByMainCategory,
  getProductsBySubCategory,
  updateProductVariant,
  deleteProductVariant,
  calculateFinalPriceForClient,
  getSearchSuggestions,
  getSearchedProducts,
  getProductsByMaterialTagAndSub,
  getProductsByMaterialTag,
  getTopRatedProducts,
  getLowStockProducts,
  getProductById,
} = require("../controllers/productController");
const { productMediaUpload } = require("../middleware/upload");
const { isAuthenticatedUser, isAuthorizedRole } = require("../middleware/auth");

const router = express.Router();

// Public product routes
router.get("/products", getFirstProductsInGroups);
router.get("/products/:mainCategory/:subCategory", getProductsBySubCategory);
router.get("/products/:mainCategory", getProductsByMainCategory);
router.get("/product/group/:id", getProductById);
router.post("/product/calculate-price", calculateFinalPriceForClient);
router.get("/search", getSearchedProducts);
router.get("/suggestions", getSearchSuggestions);

// material based product
router.get("/material/:tag/:sub", getProductsByMaterialTagAndSub);
router.get("/material/:tag", getProductsByMaterialTag);

// extra filters 
router.get('/top-rated', getTopRatedProducts);
router.get("/low-stock", getLowStockProducts)

// Admin product routes
router.post(
  "/admin/product/new",
  isAuthenticatedUser,
  isAuthorizedRole("admin"),
  productMediaUpload,
  createProductByCategory
);

router
  .route("/admin/product/:id")
  .put(
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    productMediaUpload,
    updateProductVariant
  )
  .delete(isAuthenticatedUser, isAuthorizedRole("admin"), deleteProductVariant);

module.exports = router;
