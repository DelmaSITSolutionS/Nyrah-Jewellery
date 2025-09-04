const express = require("express");
const router = express.Router();
const {
  createMetalPurity,
  getAllMetalPurities,
  deleteMetalPurity,
  updateMetalPurity,

  createMetalTone,
  getAllMetalTones,
  deleteMetalTone,
  updateMetalTone,

  createRingSize,
  getAllRingSizes,
  deleteRingSize,
  updateRingSize,

  createStoneShape,
  getAllStoneShapes,
  deleteStoneShape,
  updateStoneShape,

  createStoneCarat,
  getAllStoneCarats,
  deleteStoneCarat,
  updateStoneCarat,

  createStoneQuality,
  getAllStoneQualities,
  deleteStoneQuality,
  updateStoneQuality,

  createFinish,
  getAllFinishes,
  deleteFinish,
  updateFinish,

  createNecklaceSize,
  getAllNecklaceSizes,
  deleteNecklaceSize,
  updateNecklaceSize,

  createChainLength,
  getAllChainLength,
  deleteChainLength,
  updateChainLength,

  createEarringSize,
  getAllEarringSizes,
  deleteEarringSize,
  updateEarringSize,

  createBackType,
  getAllBackTypes,
  deleteBackType,
  updateBackType,
  
  createOccasion,
  getAllOccasions,
  deleteOccasion,
  updateOccasion,
  
  createPendantSize,
  getAllPendantSizes,
  deletePendantSize,
  updatePendantSize,
  
  createBraceletSize,
  getAllBraceletSizes,
  deleteBraceletSize,
  updateBraceletSize,

  createStoneType,
  getAllStoneTypes,
  deleteStoneType,
  updateStoneType,

  createDiamondSize,
  getAllDiamondSizes,
  deleteDiamondsize,
  updateDiamondSize
} = require("../controllers/optionsController");
const { singleImageUpload } = require("../middleware/upload");

router
  .post("/admin/metal-purity", createMetalPurity)
  .get("/metal-purities", getAllMetalPurities)
  .put("/admin/metal-purity/:id", updateMetalPurity)
  .delete("/admin/metal-purity/:id", deleteMetalPurity);

router
  .post("/admin/metal-tone", singleImageUpload, createMetalTone)
  .get("/metal-tones", getAllMetalTones)
  .put("/admin/metal-tone/:id", singleImageUpload, updateMetalTone) // ✅ supports image update too
  .delete("/admin/metal-tone/:id", deleteMetalTone);

router
  .post("/admin/ring-size", createRingSize)
  .get("/ring-sizes", getAllRingSizes)
  .put("/admin/ring-size/:id", updateRingSize)
  .delete("/admin/ring-size/:id", deleteRingSize);

router
  .post("/admin/stone-shape", createStoneShape)
  .get("/stone-shapes", getAllStoneShapes)
  .put("/admin/stone-shape/:id", updateStoneShape)
  .delete("/admin/stone-shape/:id", deleteStoneShape);

router
  .post("/admin/stone-carat", createStoneCarat)
  .get("/stone-carats", getAllStoneCarats)
  .put("/admin/stone-carat/:id", updateStoneCarat)
  .delete("/admin/stone-carat/:id", deleteStoneCarat);

router
  .post("/admin/stone-quality", createStoneQuality)
  .get("/stone-qualities", getAllStoneQualities)
  .put("/admin/stone-quality/:id", updateStoneQuality)
  .delete("/admin/stone-quality/:id", deleteStoneQuality);

router
  .post("/admin/finish", createFinish)
  .get("/finishes", getAllFinishes)
  .put("/admin/finish/:id", updateFinish)
  .delete("/admin/finish/:id", deleteFinish);

router
  .post("/admin/necklace-size", createNecklaceSize)
  .get("/necklace-sizes", getAllNecklaceSizes)
  .put("/admin/necklace-size/:id", updateNecklaceSize)
  .delete("/admin/necklace-size/:id", deleteNecklaceSize);

router
  .post("/admin/chain-length", createChainLength)
  .get("/chain-lengths", getAllChainLength)
  .put("/admin/chain-length/:id", updateChainLength)
  .delete("/admin/chain-length/:id", deleteChainLength);

router
  .post("/admin/earring-size", createEarringSize)
  .get("/earring-sizes", getAllEarringSizes)
  .put("/admin/earring-size/:id", updateEarringSize)
  .delete("/admin/earring-size/:id", deleteEarringSize);

router
  .post("/admin/backtype", createBackType)
  .get("/backtypes", getAllBackTypes)
  .put("/admin/backtype/:id", updateBackType)
  .delete("/admin/backtype/:id", deleteBackType);

router
  .post("/admin/occasion", createOccasion)
  .get("/occasions", getAllOccasions)
  .put("/admin/occasion/:id", updateOccasion)
  .delete("/admin/occasion/:id", deleteOccasion);

router
  .post("/admin/pendant-size", createPendantSize)
  .get("/pendant-sizes", getAllPendantSizes)
  .put("/admin/pendant-size/:id", updatePendantSize)
  .delete("/admin/pendant-size/:id", deletePendantSize);

router
  .post("/admin/bracelet-size", createBraceletSize)
  .get("/bracelet-sizes", getAllBraceletSizes)
  .put("/admin/bracelet-size/:id", updateBraceletSize)
  .delete("/admin/bracelet-size/:id", deleteBraceletSize);

router
  .post("/admin/stonetype", createStoneType)
  .get("/stonetypes", getAllStoneTypes)
  .put("/admin/stonetype/:id", updateStoneType)
  .delete("/admin/stonetype/:id", deleteStoneType);

router
  .post("/admin/diamond-size", createDiamondSize)
  .get("/diamond-sizes", getAllDiamondSizes)
  .put("/admin/diamond-size/:id", updateDiamondSize)
  .delete("/admin/diamond-size/:id", deleteDiamondsize);

module.exports = router;
