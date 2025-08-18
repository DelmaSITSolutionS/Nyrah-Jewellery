const mongoose = require("mongoose");

// Metal Purity
const MetalPuritySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

// Metal Tone
const MetalToneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  image: {
    type: String, // URL to image (CDN, S3, or static path)
    required: false,
  },
});

// Ring Size
const RingSizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const DiamondSizeSchema = new mongoose.Schema({
  diamondSize: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const StoneTypeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    unique: true,
  },
});

// Center Stone Quality (Shape, Quality, Carat — if you make options)
const StoneShapeSchema = new mongoose.Schema({
  shape: {
    type: String,
    required: true,
    unique: true,
  },
});

const StoneQualitySchema = new mongoose.Schema({
  quality: {
    type: String,
    required: true,
    unique: true,
  },
});

const StoneCaratSchema = new mongoose.Schema({
  carat: {
    type: String,
    required: true,
    unique: true,
  },
});

const FinishOptionSchema = new mongoose.Schema({
  finish: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
});

const BraceletSizeSchema = new mongoose.Schema({
  braceletSize: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

// Necklace Size Option Schema
const NecklaceSizeSchema = new mongoose.Schema({
  necklaceSize: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

// Chain Length Option Schema
const ChainLengthSchema = new mongoose.Schema({
  length: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const EarringSizeSchema = new mongoose.Schema({
  earringsize: {
    type: String, // e.g., "8mm", "2\" drop"
    required: true,
    unique: true,
  },
});

const BackTypeSchema = new mongoose.Schema({
  backtype: {
    type: String, // e.g., "Push Back", "Screw Back"
    required: true,
    unique: true,
  },
});

const OccasionSchema = new mongoose.Schema({
  occasion: {
    type: String, // e.g., "Bridal", "Festive"
    required: true,
    unique: true,
  },
});

const PendantSizeSchema = new mongoose.Schema({
  pendantsize:{
    type: String, 
    required: true,
    unique: true,
  }
})

// Export all models
module.exports = {
  MetalPurity: mongoose.model("MetalPurity", MetalPuritySchema),
  MetalTone: mongoose.model("MetalTone", MetalToneSchema),
  RingSize: mongoose.model("RingSize", RingSizeSchema),
  StoneShape: mongoose.model("StoneShape", StoneShapeSchema),
  StoneQuality: mongoose.model("StoneQuality", StoneQualitySchema),
  StoneCarat: mongoose.model("StoneCarat", StoneCaratSchema),
  Finish: mongoose.model("Finish",FinishOptionSchema),
  NecklaceSize: mongoose.model("NecklaceSize", NecklaceSizeSchema),
  ChainLength: mongoose.model("ChainLength", ChainLengthSchema),
  EarringSize: mongoose.model("EarringSize",EarringSizeSchema),
  BackType: mongoose.model("BackType",BackTypeSchema),
  Occasion: mongoose.model("Occasion",OccasionSchema),
  Pendantsize: mongoose.model("PendantSize",PendantSizeSchema),
  BraceletSize: mongoose.model("BraceletSize",BraceletSizeSchema),
  StoneType: mongoose.model("StoneType",StoneTypeSchema),
  DiamondSize: mongoose.model("DiamondSize",DiamondSizeSchema)
};
