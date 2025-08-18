const Charges = require("../models/chargesModel");
const ErrorHandler = require("../utils/errorHandler"); // your usual helper
const catchAsync = require("../middleware/catchAsyncErrors");

/* ───────────────────────── CREATE (only if no doc exists) ───────────────────── */
exports.createCharges = catchAsync(async (req, res, next) => {
  const already = await Charges.findOne();
  if (already) return next(new ErrorHandler("Charges doc already exists", 400));

  const doc = await Charges.create(req.body);
  res.status(201).json({ success: true, data: doc });
});

/* ───────────────────────── READ (public / checkout) ─────────────────────────── */
exports.getCharges = catchAsync(async (_req, res) => {
  const doc = await Charges.findOne();
  res.status(200).json({ success: true, data: doc });
});

/* ───────────────────────── UPDATE whole sheet ──────────────────────────────── */
exports.updateCharges = catchAsync(async (req, res, next) => {
   
  const doc = await Charges.findOne();
  if (!doc) return next(new ErrorHandler("Charges config not found", 404));

  Object.assign(doc, req.body); // shallow merge is enough; validate
  await doc.save();
  res.status(200).json({ success: true, data: doc });
});

/* ───────────────────────── DELETE entire sheet (rare) ───────────────────────── */
exports.deleteCharges = catchAsync(async (_req, res, next) => {
  const doc = await Charges.findOne();
  if (!doc) return next(new ErrorHandler("Nothing to delete", 404));

  await doc.deleteOne();
  res.status(200).json({ success: true, message: "Charges removed" });
});

/* ───────────────────────── ADD / EDIT single Intl‑Shipping line ───────────────
   Handy if you want fine‑grained endpoints.
--------------------------------------------------------------------------- */
exports.upsertIntlRate = catchAsync(async (req, res, next) => {
  const { country, courier, charge } = req.body;
 
  if (!country || !courier || charge == null)
    return next(new ErrorHandler("country, courier, charge are required", 400));

  const doc = await Charges.findOne();
  if (!doc) return next(new ErrorHandler("Charges config not found", 404));

  const existing = doc.internationalShipping.find(
    (r) => r.country === country && r.courier === courier
  );
  if (existing) existing.charge = charge;
  else doc.internationalShipping.push({ country, courier, charge });

  await doc.save();
  res.status(200).json({ success: true, data: doc });
});

/* ───────────────────────── REMOVE single Intl‑Shipping line ────────────────── */
exports.removeIntlRate = catchAsync(async (req, res, next) => {
  const { country, courier } = req.params;
  const doc = await Charges.findOne();
  if (!doc) return next(new ErrorHandler("Charges config not found", 404));

  doc.internationalShipping = doc.internationalShipping.filter(
    (r) => !(r.country === country && r.courier === courier)
  );

  await doc.save();
  res.status(200).json({ success: true, data: doc });
});
