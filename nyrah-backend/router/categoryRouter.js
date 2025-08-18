const express = require("express");
const router = express.Router();
const {
  createcategory,
  addSubcategory,
  removeSubcategory,
  getAllCategories,
  deleteMainCategory,
  updateCategory,
} = require("../controllers/categoryController");
const {isAuthenticatedUser,isAuthorizedRole} = require("../middleware/auth")

// Create main category
router.post("/admin/category", isAuthenticatedUser, isAuthorizedRole("admin"), createcategory);

// Add a subcategory
router.put("/admin/category/sub", isAuthenticatedUser, isAuthorizedRole("admin"), addSubcategory);

// Remove a subcategory
router.delete("/admin/category/sub", isAuthenticatedUser, isAuthorizedRole("admin"), removeSubcategory);

// update category
router.patch("/admin/category/:id", isAuthenticatedUser, isAuthorizedRole("admin"), updateCategory);

// Get all categories
router.get("/categories", getAllCategories);

// Delete main category
router.delete("/admin/category/:main", isAuthenticatedUser, isAuthorizedRole("admin"), deleteMainCategory);

module.exports = router;
