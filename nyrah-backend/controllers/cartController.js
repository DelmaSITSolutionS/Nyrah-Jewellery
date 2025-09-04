const Cart = require("../models/cartModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { calculateFinalPrice } = require("../utils/priceCalculator");
const { buildCustomizationKey } = require("../utils/customizationKey");

exports.addToCart = catchAsyncErrors(async (req, res, next) => {
  const {
    productId,
    detailsRef,
    detailsModel,
    customizations = {},
    quantity = 1,
  } = req.body;

  /* build key */
  const customizationKey = buildCustomizationKey(customizations);

  /* look for existing item */
  let cartItem = await Cart.findOne({
    user: req.user._id,
    product: productId,
    detailsRef,
    customizationKey,
  });

  if (cartItem) {
    cartItem.quantity += quantity;
    await cartItem.save();
    return res.status(200).json({
      success: true,
      cartItem,
      message: "Quantity updated in cart",
    });
  }

  /* new item */
  const { finalPrice, customizationPrice } = await calculateFinalPrice({
    productId,
    detailsRef,
    detailsModel,
    customizations,
  });

  console.log(customizationPrice)

  cartItem = await Cart.create({
    user: req.user._id,
    product: productId,
    detailsRef,
    detailsModel,
    quantity,
    customizations,
    customizationKey,
    customizationPrice,
    finalPrice:customizationPrice!==0 ? customizationPrice:finalPrice,
  });

  res.status(201).json({
    success: true,
    cartItem,
    message: "Item added to cart",
  });
});

// Get all items in user's cart
exports.getUserCart = catchAsyncErrors(async (req, res, next) => {
  const cartItems = await Cart.find({ user: req.user._id })
    .populate("product")
    .populate("detailsRef");

  res.status(200).json({
    success: true,
    count: cartItems.length,
    cart: cartItems,
  });
});

// Delete item from cart
exports.removeFromCart = catchAsyncErrors(async (req, res, next) => {
  const item = await Cart.findById(req.params.id);

  if (!item || item.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Cart item not found", 404));
  }

  await item.deleteOne();

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
  });
});

exports.updateCartItemQuantity = catchAsyncErrors(async (req, res, next) => {
  const cartItem = await Cart.findById(req.params.id);

  if (!cartItem) {
    return res.status(404).json({ success: false, message: "Item not found" });
  }

  cartItem.quantity = req.body.quantity;
  await cartItem.save();

  res.status(200).json({ success: true, message: "Quantity updated" });
});

exports.clearCartController = catchAsyncErrors(async (req, res) => {
  await Cart.deleteMany({ user: req.user._id });
  res.json({ message: "Cart cleared" });
});
