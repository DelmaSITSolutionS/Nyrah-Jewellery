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

module.exports = {
  createMetalPurity: createOption(MetalPurity, "name"),
  getAllMetalPurities: getAllOptions(MetalPurity),
  deleteMetalPurity: deleteOption(MetalPurity),

  createMetalTone,
  getAllMetalTones: getAllOptions(MetalTone),
  deleteMetalTone: deleteOption(MetalTone),

  createRingSize: createOption(RingSize, "size"),
  getAllRingSizes: getAllOptions(RingSize),
  deleteRingSize: deleteOption(RingSize),

  createStoneShape: createOption(StoneShape, "shape"),
  getAllStoneShapes: getAllOptions(StoneShape),
  deleteStoneShape: deleteOption(StoneShape),

  createStoneQuality: createOption(StoneQuality, "quality"),
  getAllStoneQualities: getAllOptions(StoneQuality),
  deleteStoneQuality: deleteOption(StoneQuality),

  createStoneCarat: createOption(StoneCarat, "carat"),
  getAllStoneCarats: getAllOptions(StoneCarat),
  deleteStoneCarat: deleteOption(StoneCarat),

  createFinish: createOption(Finish, "finish"),
  getAllFinishes: getAllOptions(Finish),
  deleteFinish: deleteOption(Finish),

  createNecklaceSize: createOption(NecklaceSize, "necklaceSize"),
  getAllNecklaceSizes: getAllOptions(NecklaceSize),
  deleteNecklaceSize: deleteOption(NecklaceSize),

  createChainLength: createOption(ChainLength, "length"),
  getAllChainLength: getAllOptions(ChainLength),
  deleteChainLength: deleteOption(ChainLength),

  createEarringSize: createOption(EarringSize, "earringsize"),
  getAllEarringSizes: getAllOptions(EarringSize),
  deleteEarringSize: deleteOption(EarringSize),

  createBackType: createOption(BackType, "backtype"),
  getAllBackTypes: getAllOptions(BackType),
  deleteBackType: deleteOption(BackType),

  createOccasion: createOption(Occasion, "occasion"),
  getAllOccasions: getAllOptions(Occasion),
  deleteOccasion: deleteOption(Occasion),

  createPendantSize: createOption(Pendantsize,"pendantsize"),
  getAllPendantSizes: getAllOptions(Pendantsize),
  deletePendantSize: deleteOption(Pendantsize),

  createBraceletSize: createOption(BraceletSize,"braceletSize"),
  getAllBraceletSizes: getAllOptions(BraceletSize),
  deleteBraceletSize: deleteOption(BraceletSize),

  createStoneType: createOption(StoneType,"type"),
  getAllStoneTypes: getAllOptions(StoneType),
  deleteStoneType: deleteOption(StoneType),

  createDiamondSize: createOption(DiamondSize,"diamondSize"),
  getAllDiamondSizes: getAllOptions(DiamondSize),
  deleteDiamondsize: deleteOption(DiamondSize)
};
