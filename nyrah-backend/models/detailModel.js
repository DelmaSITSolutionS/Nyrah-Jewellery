const mongoose = require("mongoose");

const RingSchema = new mongoose.Schema({

 sizeOptions: {
  type: [String],
  required: true,
 },

 metalTone: {
  type: String,
  required: true,
 },

 metalPurity: { type: [String], required: true },

 diamondSize: { type: String, require: false },

 finish: { type: String, require: false },

 stoneType: { type: [String], required: true },

 centerStoneOptions: {
  carats: { type: String, require: false },
  shapes: { type: String, require: false },
  qualities: { type: String, require: false },
 },

 customization: {
  // goldToneAvailable: { type: Boolean, default: false },
  engravingAvailable: { type: Boolean, default: false },
  // stoneUpgradeAvailable: { type: Boolean, default: false },
 },

 certification: {
  isCertified: { type: Boolean, default: false },

  certType: {
   type: String,
   enum: ["IGI", "GIA", ""], // ✅ only enum kept
   default: "",
  },
  isHallmarked: { type: Boolean, default: false },
 },
 
 shippingNote: {
  type: String,
  default: "Free shipping in India. Custom orders: 15–20 business days.",
 },

});



// BraceletSchema
const BraceletSchema = new mongoose.Schema({
  sizeOptions: {
    type: [String], // e.g., ["6.0\"", "6.5\"", "Adjustable"]
    required: false, // Now optional
  },
  metalPurity: [{ type: String, required: true }],
  metalTone: {
    type: String,
    required: false, // Optional
  },

  gemstoneOption: [
    {
      value: { type: String, required: false }, // e.g., "2.5 ct"
      price: { type: Number, default: 0 }, // additional price (optional)
    },
  ],

  customization: {
    nameEngravingAvailable: { type: Boolean, default: false },
    sizeCustomizable: { type: Boolean, default: false },
    metalCustomizable: { type: Boolean, default: false },
    gemstoneCustomizable: { type: Boolean, default: false },
  },

  certification: {
    isCertified: { type: Boolean, default: false },
    certType: {
      type: String,
      enum: ["IGI", "GIA", "Hallmarked Silver", ""],
      default: "",
    },
  },

  weight: {
    type: String, // Optional, e.g., "12.5g approx."
  },

  finish: [
    {
      value: { type: String, required: false }, // e.g., "2.5 ct"
      price: { type: Number, default: 0 }, // additional price (optional)
    },
  ],

  careInstructions: {
    type: String,
    default: "Avoid harsh chemicals, store in dry pouch",
  },

  shippingNote: {
    type: String,
    default: "Free shipping in India. Worldwide delivery",
  },

  deliveryTime: {
    type: String,
    default: "5–7 days (regular), 15–20 days (custom orders)",
  },
});

//Necklace Schema
const NecklaceSchema = new mongoose.Schema({
  sizes: [
    {
      value: { type: String, required: true }, // e.g., "16\" + 2\" extender"
      price: { type: Number, default: 0 }, // additional cost if needed
    },
  ],
  chainLengths: [
    {
      value: { type: String, required: true }, // e.g., "16", "18"
      price: { type: Number, default: 0 },
    },
  ],

  metalPurity: [{ type: String, required: true }],

  metalTone: {
    type: String,
    required: false,
  },

  stoneType: [
    {
      value: { type: String, required: false }, // e.g., "VVS1 Lab-Grown"
      price: { type: Number, default: 0 }, // optional
    },
  ],

  certification: {
    isCertified: { type: Boolean, default: false },
    certType: {
      type: String,
      enum: ["IGI", "GIA", "Hallmarked Silver", ""],
      default: "",
    },
  },

  weight: {
    type: String, // e.g., "8g approx."
    required: false,
  },

  finish: [
    {
      value: { type: String, required: true }, // e.g., "Glossy"
      price: { type: Number, default: 0 },
    },
  ],

  shippingNote: {
    type: String,
    default: "Free shipping in India. International delivery available",
  },

  deliveryTime: {
    type: String,
    default: "5–7 days (regular), 15–20 days (custom orders)",
  },
});

// earring schema
const EarringSchema = new mongoose.Schema({
  metalPurity: [{ type: String, required: true }],
  metalTone: {
    type: String,
    required: false,
  },
  stoneType: [
    {
      value: { type: String, required: false }, // e.g., "VVS1 Lab-Grown"
      price: { type: Number, default: 0 }, // optional
    },
  ],
  stoneCarat: [
    {
      value: { type: String, required: false }, // e.g., "0.4ct"
      price: { type: Number, default: 0 }, // optional
    },
  ],
  earringSize: [
    {
      value: { type: String, required: false }, // e.g., "8mm"
      price: { type: Number, default: 0 }, // optional
    },
  ],
  weight: {
    type: String, // e.g., "6g", "9g"
    required: false,
  },
  backType: [
    {
      value: { type: String, required: false }, // e.g., "Push back"
      price: { type: Number, default: 0 }, // optional
    },
  ],
  customization: {
    toneCustomizable: { type: Boolean, default: false },
    stoneCustomizable: { type: Boolean, default: false },
    engravingAvailable: { type: Boolean, default: false },
    lengthCustomizable: { type: Boolean, default: false },
  },
  finish: [
    {
      value: { type: String, required: false }, // e.g., "Glossy"
      price: { type: Number, default: 0 }, // optional
    },
  ],
  hypoallergenic: {
    type: Boolean,
    default: false,
  },
  certification: {
    isCertified: { type: Boolean, default: false },
    certType: {
      type: String,
      enum: ["IGI", "GIA", "Hallmarked Silver", ""],
      default: "",
    },
  },
  occasion: [String],
  careInstructions: {
    type: String,
    default: "Wipe with soft cloth, avoid water/perfume, store in dry pouch",
  },
  shippingNote: {
    type: String,
    default: "Free shipping in India. Worldwide delivery.",
  },
  deliveryTime: {
    type: String,
    default: "5–7 days (regular), 15–20 days (custom orders)",
  },
  packaging: {
    type: String,
    default: "Luxury gift box",
  },
});

//PendantSchema
const PendantSchema = new mongoose.Schema({
  chainIncluded: {
    type: Boolean,
    default: false,
  },

  chainLength: [
    {
      value: { type: String },
      price: { type: Number, default: 0 },
    },
  ],

  metalPurity: [{ type: String, required: true }],
  metalTone: {
    type: String,
  },

  stoneType: [
    {
      value: { type: String },
      price: { type: Number, default: 0 },
    },
  ],

  stoneCarat: [
    {
      value: { type: String },
      price: { type: Number, default: 0 },
    },
  ],

  pendantSize: [
    {
      value: { type: String },
      price: { type: Number, default: 0 },
    },
  ],

  weight: {
    type: String, // e.g., "5g", "8g"
  },

  customization: {
    engravingAvailable: { type: Boolean, default: false },
    stoneCustomizable: { type: Boolean, default: false },
    chainCustomizable: { type: Boolean, default: false },
  },

  finish: [
    {
      value: { type: String }, // e.g., "Glossy"
      price: { type: Number, default: 0 },
    },
  ],

  hypoallergenic: {
    type: Boolean,
    default: false,
  },

  certification: {
    isCertified: { type: Boolean, default: false },
    certType: {
      type: String,
      enum: ["IGI", "GIA", "Hallmarked Silver", ""],
      default: "",
    },
  },

  occasion: [String], // e.g., ["Daily Wear", "Gifting"]

  careInstructions: {
    type: String,
    default: "Avoid water/perfume, store in pouch, use soft cloth",
  },

  shippingNote: {
    type: String,
    default: "Free shipping India. Worldwide shipping available.",
  },

  deliveryTime: {
    type: String,
    default: "5–7 days (regular), 15–20 days (custom orders)",
  },

  packaging: {
    type: String,
    default: "Premium gift box",
  },
});

module.exports = {
  Ring: mongoose.model("Ring", RingSchema),
  Bracelet: mongoose.model("Bracelet", BraceletSchema),
  Necklace: mongoose.model("Necklace", NecklaceSchema),
  Earring: mongoose.model("Earring", EarringSchema),
  Pendant: mongoose.model("Pendant", PendantSchema),
};
