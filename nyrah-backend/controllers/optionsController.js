const {
  MetalPurity,
  MetalTone,
  RingSize,
  StoneCarat,
  StoneShape,
  StoneQuality,
  Finish,
  NecklaceSize,
  ChainLength,
  EarringSize,
  BackType,
  Occasion,
  Pendantsize,
  BraceletSize,
  StoneType,
  DiamondSize
} = require("../models/optionsModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const { uploadSingleImageToCloudinary } = require("../utils/uploadImages");

// Reusable create
const createOption = (Model, field) =>
  catchAsyncErrors(async (req, res, next) => {
    const { [field]: value } = req.body;
    

    const exists = await Model.findOne({ [field]: value });
    if (exists) {
      return next(new ErrorHandler(`${field} already exists`, 400));
    }

    const option = await Model.create({ [field]: value });

    res.status(201).json({
      success: true,
      data: option,
    });
  });

// Reusable get all
const getAllOptions = (Model) =>
  catchAsyncErrors(async (req, res) => {
    const data = await Model.find();
    res.status(200).json({ success: true, data });
  });

// Reusable delete
const deleteOption = (Model) =>
  catchAsyncErrors(async (req, res, next) => {
    const item = await Model.findById(req.params.id);
    if (!item) {
      return next(new ErrorHandler("Item not found", 404));
    }
    await item.deleteOne();
    res.status(200).json({ success: true, message: "Deleted successfully" });
  });

// metal tone
const createMetalTone = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  
  if (!name || !req.file) return next(new ErrorHandler("Name and image required", 400));

  const existing = await MetalTone.findOne({ name });
  if (existing) return next(new ErrorHandler("Metal tone already exists", 400));

  const imageUrl = await uploadSingleImageToCloudinary(req.file,"metal-Tone");

  const tone = await MetalTone.create({ name, image: imageUrl.url });

  res.status(201).json({
    success: true,
    message: "Metal tone created successfully",
    data: tone,
  });
});

const updateMetalTone = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;

  const tone = await MetalTone.findById(id);
  if (!tone) {
    return next(new ErrorHandler("Metal tone not found", 404));
  }

  // ✅ check for duplicate name if updating
  if (name && (await MetalTone.findOne({ name, _id: { $ne: id } }))) {
    return next(new ErrorHandler("Metal tone already exists", 400));
  }

  // update name if provided
  if (name) tone.name = name;

  // update image if provided
  if (req.file) {
    const imageUrl = await uploadSingleImageToCloudinary(req.file, "metal-Tone");
    tone.image = imageUrl.url;
  }

  await tone.save();

  res.status(200).json({
    success: true,
    message: "Metal tone updated successfully",
    data: tone,
  });
});

// Reusable update
const updateOption = (Model, field) =>
  catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { [field]: value } = req.body;

    const item = await Model.findById(id);
    if (!item) {
      return next(new ErrorHandler("Item not found", 404));
    }

    // check duplicate if updating to an existing value
    if (value && (await Model.findOne({ [field]: value, _id: { $ne: id } }))) {
      return next(new ErrorHandler(`${field} already exists`, 400));
    }

    item[field] = value ?? item[field];
    await item.save();

    res.status(200).json({
      success: true,
      message: `${field} updated successfully`,
      data: item,
    });
  });

module.exports = {
  createMetalPurity: createOption(MetalPurity, "name"),
  getAllMetalPurities: getAllOptions(MetalPurity),
  deleteMetalPurity: deleteOption(MetalPurity),
  updateMetalPurity: updateOption(MetalPurity, "name"),

  createMetalTone,
  getAllMetalTones: getAllOptions(MetalTone),
  deleteMetalTone: deleteOption(MetalTone),
  updateMetalTone,

  createRingSize: createOption(RingSize, "size"),
  getAllRingSizes: getAllOptions(RingSize),
  deleteRingSize: deleteOption(RingSize),
  updateRingSize: updateOption(RingSize, "size"),

  createStoneShape: createOption(StoneShape, "shape"),
  getAllStoneShapes: getAllOptions(StoneShape),
  deleteStoneShape: deleteOption(StoneShape),
  updateStoneShape: updateOption(StoneShape, "shape"),

  createStoneQuality: createOption(StoneQuality, "quality"),
  getAllStoneQualities: getAllOptions(StoneQuality),
  deleteStoneQuality: deleteOption(StoneQuality),
  updateStoneQuality: updateOption(StoneQuality, "quality"),

  createStoneCarat: createOption(StoneCarat, "carat"),
  getAllStoneCarats: getAllOptions(StoneCarat),
  deleteStoneCarat: deleteOption(StoneCarat),
  updateStoneCarat: updateOption(StoneCarat, "carat"),

  createFinish: createOption(Finish, "finish"),
  getAllFinishes: getAllOptions(Finish),
  deleteFinish: deleteOption(Finish),
  updateFinish: updateOption(Finish, "finish"),

  createNecklaceSize: createOption(NecklaceSize, "necklaceSize"),
  getAllNecklaceSizes: getAllOptions(NecklaceSize),
  deleteNecklaceSize: deleteOption(NecklaceSize),
  updateNecklaceSize: updateOption(NecklaceSize, "necklaceSize"),

  createChainLength: createOption(ChainLength, "length"),
  getAllChainLength: getAllOptions(ChainLength),
  deleteChainLength: deleteOption(ChainLength),
  updateChainLength: updateOption(ChainLength, "length"),

  createEarringSize: createOption(EarringSize, "earringsize"),
  getAllEarringSizes: getAllOptions(EarringSize),
  deleteEarringSize: deleteOption(EarringSize),
  updateEarringSize: updateOption(EarringSize, "earringsize"),

  createBackType: createOption(BackType, "backtype"),
  getAllBackTypes: getAllOptions(BackType),
  deleteBackType: deleteOption(BackType),
  updateBackType: updateOption(BackType, "backtype"),

  createOccasion: createOption(Occasion, "occasion"),
  getAllOccasions: getAllOptions(Occasion),
  deleteOccasion: deleteOption(Occasion),
  updateOccasion: updateOption(Occasion, "occasion"),

  createPendantSize: createOption(Pendantsize,"pendantsize"),
  getAllPendantSizes: getAllOptions(Pendantsize),
  deletePendantSize: deleteOption(Pendantsize),
  updatePendantSize: updateOption(Pendantsize,"pendantsize"),

  createBraceletSize: createOption(BraceletSize,"braceletSize"),
  getAllBraceletSizes: getAllOptions(BraceletSize),
  deleteBraceletSize: deleteOption(BraceletSize),
  updateBraceletSize: updateOption(BraceletSize,"braceletSize"),

  createStoneType: createOption(StoneType,"type"),
  getAllStoneTypes: getAllOptions(StoneType),
  deleteStoneType: deleteOption(StoneType),
  updateStoneType: updateOption(StoneType,"type"),

  createDiamondSize: createOption(DiamondSize,"diamondSize"),
  getAllDiamondSizes: getAllOptions(DiamondSize),
  deleteDiamondsize: deleteOption(DiamondSize),
  updateDiamondSize: updateOption(DiamondSize,"diamondSize"),
};

