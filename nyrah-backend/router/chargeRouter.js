const express = require("express");
const router = express.Router();
const {
  createCharges,
  getCharges,
  updateCharges,
  deleteCharges,
  upsertIntlRate,
  removeIntlRate,
} = require("../controllers/chargesController");

const { isAuthenticatedUser, isAuthorizedRole } = require("../middleware/auth");

/* Public – checkout needs to read charges */
router.get("/charges", getCharges);

/* Admin‑only CRUD */
router
  .post(
    "/admin/charges",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    createCharges
  )
  .put(
    "/admin/charges",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    updateCharges
  )
  .delete(
    "/admin/charges",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    deleteCharges
  );

/* Fine‑grained endpoints for intl rates */
router
  .put(
    "/admin/charges/international",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    upsertIntlRate
  ) // body: {country,courier,charge}
  .delete(
    "/admin/charges/international/:country/:courier",
    isAuthenticatedUser,
    isAuthorizedRole("admin"),
    removeIntlRate
  )
  

module.exports = router;
