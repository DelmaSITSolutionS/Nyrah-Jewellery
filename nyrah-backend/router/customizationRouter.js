const express = require("express")
const {
  createCustomization,
  getAllCustomizations,
  getCustomizationByProductGroup,
  updateCustomization,
  deleteCustomization,
} = require("../controllers/customizationController.js");

const {
  isAuthenticatedUser,
  isAuthorizedRole,
} = require("../middleware/auth.js");

const router = express.Router();

// =============================
// Admin Routes (/api/v1/admin/customization/...)
// =============================
router.post(
  "/admin/customization/new",
  isAuthenticatedUser,
  isAuthorizedRole("admin"),
  createCustomization
);

router.get(
  "/admin/customization",
  isAuthenticatedUser,
  isAuthorizedRole("admin"),
  getAllCustomizations
);

router.put(
  "/admin/customization/:id",
  isAuthenticatedUser,
  isAuthorizedRole("admin"),
  updateCustomization
);

router.delete(
  "/admin/customization/:id",
  isAuthenticatedUser,
  isAuthorizedRole("admin"),
  deleteCustomization
);

// =============================
// Public Routes (/api/v1/customization/...)
// =============================
router.get("/customization/:productGroup", getCustomizationByProductGroup);

module.exports = router;
