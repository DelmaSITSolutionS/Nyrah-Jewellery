const express = require("express");
const router = express.Router();
const {
  createMaterialMenu,
  addSubToMaterial,
  removeSubFromMaterial,
  getAllMaterials,
  deleteMaterial,
} = require("../controllers/materialMenuController");
const { isAuthenticatedUser, isAuthorizedRole } = require("../middleware/auth");

// Create main material tag (e.g., "silver")
router.post("/admin/material",isAuthenticatedUser,isAuthorizedRole("admin"),createMaterialMenu);

// Add a sub-material (e.g., "ring" under "silver")
router.put("/admin/material/sub",isAuthenticatedUser,isAuthorizedRole("admin"), addSubToMaterial);

// Remove a sub-material
router.delete("/admin/material/sub",isAuthenticatedUser,isAuthorizedRole("admin"), removeSubFromMaterial);

// Get all material menus
router.get("/materials", getAllMaterials);

// Delete main material tag
router.delete("/admin/material/:tag",isAuthenticatedUser,isAuthorizedRole("admin"), deleteMaterial);

module.exports = router;
