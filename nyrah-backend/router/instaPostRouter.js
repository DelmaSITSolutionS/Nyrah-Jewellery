// routes/instaPostRoutes.js
const express = require("express");
const router = express.Router();
const { singleImageUpload } = require("../middleware/upload");

const {
  getAllInstaPosts,
  createInstaPost,
  updateInstaPost,
  deleteInstaPost,
} = require("../controllers/instaController");

router
.get("/instapost",getAllInstaPosts)
.post("/instapost", singleImageUpload, createInstaPost)
.put("/instapost/:id", singleImageUpload, updateInstaPost)
.delete("/instapost/:id", deleteInstaPost);

module.exports = router;
