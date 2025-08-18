const express = require("express");
const router = express.Router();
const {
  createMetalPurity,
  getAllMetalPurities,
  deleteMetalPurity,

  createMetalTone,
  getAllMetalTones,
  deleteMetalTone,

  createRingSize,
  getAllRingSizes,
  deleteRingSize,

  createStoneShape,
  getAllStoneShapes,
  deleteStoneShape,

  createStoneCarat,
  getAllStoneCarats,
  deleteStoneCarat,

  createStoneQuality,
  getAllStoneQualities,
  deleteStoneQuality,

  createFinish,
  getAllFinishes,
  deleteFinish,

  createNecklaceSize,
  getAllNecklaceSizes,
  deleteNecklaceSize,

  createChainLength,
  getAllChainLength,
  deleteChainLength,

  createEarringSize,
  getAllEarringSizes,
  deleteEarringSize,

  createBackType,
  getAllBackTypes,
  deleteBackType,
  
  createOccasion,
  getAllOccasions,
  deleteOccasion,
  
  createPendantSize,
  getAllPendantSizes,
  deletePendantSize,
  
  createBraceletSize,
  getAllBraceletSizes,
  deleteBraceletSize,

  createStoneType,
  getAllStoneTypes,
  deleteStoneType,

  createDiamondSize,
  getAllDiamondSizes,
  deleteDiamondsize
} = require("../controllers/optionsController");
const { singleImageUpload } = require("../middleware/upload");

router
  .post("/admin/metal-purity", createMetalPurity)
  .get("/metal-purities", getAllMetalPurities)
  .delete("/admin/metal-purity/:id", deleteMetalPurity);

router
  .post("/admin/metal-tone",singleImageUpload, createMetalTone)
  .get("/metal-tones", getAllMetalTones)
  .delete("/admin/metal-tone/:id", deleteMetalTone);

router
  .post("/admin/ring-size", createRingSize)
  .get("/ring-sizes", getAllRingSizes)
  .delete("/admin/ring-size/:id", deleteRingSize);

router
  .post("/admin/stone-shape", createStoneShape)
  .get("/stone-shapes", getAllStoneShapes)
  .delete("/admin/stone-shape/:id", deleteStoneShape);

router
  .post("/admin/stone-carat", createStoneCarat)
  .get("/stone-carats", getAllStoneCarats)
  .delete("/admin/stone-carat/:id", deleteStoneCarat);

router
  .post("/admin/stone-quality", createStoneQuality)
  .get("/stone-qualities", getAllStoneQualities)
  .delete("/admin/stone-quality/:id", deleteStoneQuality);

router
  .post("/admin/finish", createFinish)
  .get("/finishes", getAllFinishes)
  .delete("/admin/finish/:id", deleteFinish);

router
  .post("/admin/necklace-size", createNecklaceSize)
  .get("/necklace-sizes", getAllNecklaceSizes)
  .delete("/admin/necklace-size/:id", deleteNecklaceSize);

router
  .post("/admin/chain-length", createChainLength)
  .get("/chain-lengths", getAllChainLength)
  .delete("/admin/chain-length/:id", deleteChainLength);

router
  .post("/admin/earring-size", createEarringSize)
  .get("/earring-sizes", getAllEarringSizes)
  .delete("/admin/earring-size/:id", deleteEarringSize);

router
  .post("/admin/backtype", createBackType)
  .get("/backtypes", getAllBackTypes)
  .delete("/admin/backtype/:id", deleteBackType);

router
  .post("/admin/occasion", createOccasion)
  .get("/occasions", getAllOccasions)
  .delete("/admin/occasion/:id", deleteOccasion);

router
  .post("/admin/pendant-size", createPendantSize)
  .get("/pendant-sizes", getAllPendantSizes)
  .delete("/admin/pendant-size/:id", deletePendantSize);

router
  .post("/admin/bracelet-size", createBraceletSize)
  .get("/bracelet-sizes", getAllBraceletSizes)
  .delete("/admin/bracelet-size/:id", deleteBraceletSize);

router
  .post("/admin/stonetype", createStoneType)
  .get("/stonetypes", getAllStoneTypes)
  .delete("/admin/stonetype/:id", deleteStoneType);

router
  .post("/admin/diamond-size", createDiamondSize)
  .get("/diamond-sizes", getAllDiamondSizes)
  .delete("/admin/diamond-size/:id", deleteDiamondsize);

module.exports = router;
