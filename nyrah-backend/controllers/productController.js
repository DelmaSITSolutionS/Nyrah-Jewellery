const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const {
  Ring,
  Bracelet,
  Necklace,
  Earring,
  Pendant,
} = require("../models/detailModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const AggregationFeatures = require("../utils/aggregationFeatures");
const {
  uploadMany,
  uploadSingleImageToCloudinary,
} = require("../utils/uploadImages");
const { calculateFinalPrice } = require("../utils/priceCalculator");
const Category = require("../models/categoryModel");

const models = {
  Ring,
  Bracelet,
  Necklace,
  Earring,
  Pendant,
};

const createProductByCategory = catchAsyncErrors(async (req, res, next) => {
  let mainCategory = req.body.category.main;
  const detailKey = `${mainCategory}Details`;

  const slice1 = mainCategory.slice(0, 1).toUpperCase();
  const slice2 = mainCategory.slice(1);
  mainCategory = slice1 + slice2;


  const DetailModel = models[mainCategory];
  let detailData = req.body[detailKey];

  detailData = JSON.parse(detailData);

  if (!DetailModel || !detailData) {
    return next(new ErrorHandler("Missing or invalid product details", 400));
  }

  const detailDoc = await DetailModel.create(detailData);

  // 1. Upload images
  const uploadedImages = req.files?.images
    ? await uploadMany(req.files.images, "products")
    : [];

  // 2. Upload video if present
  let videoUrl = "";
  if (req.files?.video) {
    const uploadedVideo = await uploadSingleImageToCloudinary(
      req.files.video[0],
      "product-videos"
    );
    videoUrl = uploadedVideo.url;
  }

  // 3. Create Product
  const product = await Product.create({
    ...req.body,
    images: uploadedImages.map((i) => i.url),
    video: videoUrl,
    detailsRef: detailDoc._id,
  });

  res.status(201).json({ success: true, product });
});

const getFirstProductsInGroups = catchAsyncErrors(async (req, res, next) => {
  // Step 1: Apply filter and sort using your AggregationFeatures
  const features = new AggregationFeatures([], req.query).filter();

  // ✅ Ensure we sort by createdAt before grouping
  features.forceSortBeforeGroup("createdAt", 1); // Oldest first

  // Step 2: Inject grouping stage AFTER filters and sorting
  features.pipeline.push(
    {
      $group: {
        _id: "$productGroup",
        product: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$product" },
    }
  );

  // ✅ Optional: apply user sort on grouped results
  features.sortAfterGroup();

  // Step 3: Count before pagination
  const countPipeline = [...features.pipeline, { $count: "totalCount" }];
  const countResult = await Product.aggregate(countPipeline);
  const totalCount = countResult[0]?.totalCount || 0;

  // Step 4: Apply pagination
  features.paginate(12); // Or any default limit

  // Step 5: Final aggregation
  const products = await Product.aggregate(features.build());

  const populated = await Product.populate(products, { path: "detailsRef" });

  res.status(200).json({
    success: true,
    count: populated.length,
    totalCount,
    products: populated,
  });
});

const getProductsByMainCategory = catchAsyncErrors(async (req, res, next) => {
  const mainCategory = req.params.mainCategory;
  // Start with basic match by main category
  let pipeline = [
    {
      $match: {
        "category.main": {
          $regex: new RegExp("^" + mainCategory + "$", "i"),
        },
      },
    },
  ];

  // Apply filters from query string
  const features = new AggregationFeatures(pipeline, req.query).filter();

  // ✅ Ensure we sort by createdAt before grouping
  features.forceSortBeforeGroup("createdAt", 1); // Oldest first

  // Group by productGroup to get first variant of each
  features.pipeline.push(
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$productGroup",
        product: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$product" },
    }
  );

  // ✅ Optional: apply user sort on grouped results
  features.sortAfterGroup();

  // Count matching documents BEFORE pagination
  const countPipeline = [...features.pipeline]; // deep clone of filter+sort
  countPipeline.push({ $count: "totalCount" });
  const countResult = await Product.aggregate(countPipeline);
  const totalCount = countResult[0]?.totalCount || 0;

  // Then apply pagination AFTER count
  features.paginate(12);

  // Execute aggregation
  const products = await Product.aggregate(features.pipeline);

  // Populate detail references
  const populated = await Product.populate(products, { path: "detailsRef" });

  res.status(200).json({
    success: true,
    count: populated.length,
    totalCount,
    products: populated,
  });
});

const getProductsBySubCategory = catchAsyncErrors(async (req, res, next) => {
  const { mainCategory, subCategory } = req.params;

  // Base pipeline
  let pipeline = [
    {
      $match: {
        "category.main": {
          $regex: new RegExp("^" + mainCategory + "$", "i"),
        },
        "category.sub": {
          $elemMatch: {
            $regex: new RegExp("^" + subCategory + "$", "i"),
          },
        },
      },
    },
  ];

  // Apply query-based filters
  const features = new AggregationFeatures(pipeline, req.query).filter();

  // ✅ Ensure we sort by createdAt before grouping
  features.forceSortBeforeGroup("createdAt", 1); // Oldest first

  // Add grouping and root-replacement
  features.pipeline.push(
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$productGroup",
        product: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$product" } }
  );

  // ✅ Optional: apply user sort on grouped results
  features.sortAfterGroup();

  // Count matching documents BEFORE pagination
  const countPipeline = [...features.pipeline]; // deep clone of filter+sort
  countPipeline.push({ $count: "totalCount" });
  const countResult = await Product.aggregate(countPipeline);
  const totalCount = countResult[0]?.totalCount || 0;

  // Then apply pagination AFTER count
  features.paginate(12);

  // Execute aggregation
  const products = await Product.aggregate(features.pipeline);
  const populated = await Product.populate(products, { path: "detailsRef" });

  res.status(200).json({
    success: true,
    count: populated.length,
    totalCount,
    products: populated,
  });
});

const getProductsByGroup = catchAsyncErrors(async (req, res, next) => {
  const { productGroup } = req.params;

  const products = await Product.find({ productGroup })
    .sort({ createdAt: 1 })
    .populate("detailsRef");

  if (!products || products.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No products found for this group",
    });
  }

  res.status(200).json({
    success: true,
    count: products.length,
    group: productGroup,
    variants: products,
  });
});

const updateProductVariant = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const updatedFields = { ...req.body };

  // 1. Handle new images (if provided)
  // 1. Handle new + existing images
  if (req.files?.images?.length) {
    const uploadedImages = await uploadMany(req.files.images, "products");
    const newImgs = uploadedImages.map((i) => i.url);

    // merge with existingImg sent from frontend
    updatedFields.images = [
      ...(req.body.existingImg ? JSON.parse(req.body.existingImg) : []),
      ...newImgs,
    ];
  } else if (req.body.existingImg) {
    // only keep existing images if no new uploads
    updatedFields.images = JSON.parse(req.body.existingImg);
  }

  // 2. Handle new video (if provided)
  if (req.files?.video?.length) {
    const uploadedVideo = await uploadSingleImageToCloudinary(
      req.files.video[0],
      "product-videos"
    );
    updatedFields.video = uploadedVideo.url;
  }

  // 3. Update associated detail model
  if (product.detailsRef && product.detailsModel) {
    const DetailModel = require(`../models/detailModel`)[product.detailsModel];
    const detailsKey = `${product.detailsModel.toLowerCase()}Details`;
    let parsedDetails = req.body[detailsKey];

    if (parsedDetails && DetailModel) {
      if (typeof parsedDetails === "string") {
        try {
          parsedDetails = JSON.parse(parsedDetails);
        } catch (err) {
          return next(new ErrorHandler("Invalid JSON in detail data", 400));
        }
      }

      await DetailModel.findByIdAndUpdate(product.detailsRef, parsedDetails, {
        new: true,
      });
    }
  }

  // 4. Update the product
  product = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

const deleteProductVariant = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Remove associated detailsRef (e.g., Ring model)
  if (product.detailsRef && product.detailsModel) {
    const DetailModel = require(`../models/detailModel`)[product.detailsModel];
    if (DetailModel) {
      await DetailModel.findByIdAndDelete(product.detailsRef);
    }
  }

  // Delete product itself
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product variant deleted successfully",
  });
});

const calculateFinalPriceForClient = catchAsyncErrors(async (req, res) => {
  const { productId, detailsRef, detailsModel, customizations = {} } = req.body;

  const { finalPrice, customizationPrice } = await calculateFinalPrice({
    productId,
    detailsRef,
    detailsModel,
    customizations,
  });

  res.status(200).json({ finalPrice:customizationPrice!==0 ? customizationPrice:finalPrice,customizationPrice });
});

const getSearchedProducts = catchAsyncErrors(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.json({ products: [] });
  }

  const regex = new RegExp(q, "i");

  // Start aggregation pipeline with $match stage
  const initialPipeline = [
    {
      $match: {
        $or: [
          { name: { $regex: regex } },
          { "category.main": { $regex: regex } },
          { "category.sub": { $in: [regex] } },
        ],
      },
    },
  ];

  const features = new AggregationFeatures(initialPipeline, req.query);

  // Count total matching products before pagination
  const countPipeline = [...features.build(), { $count: "totalCount" }];
  const countResult = await Product.aggregate(countPipeline);
  const totalCount = countResult[0]?.totalCount || 0;

  // Apply pagination
  features.paginate(12);

  // Run aggregation
  const products = await Product.aggregate(features.build());
  const populated = await Product.populate(products, { path: "detailsRef" });

  res.json({
    success: true,
    count: populated.length,
    totalCount,
    products: populated,
  });
});

const getSearchSuggestions = catchAsyncErrors(async (req, res) => {
  const query = req.query.q?.trim();

  if (!query)
    return res.status(400).json({ success: false, message: "Query required" });

  const regex = new RegExp(query, "i"); // case-insensitive partial match

  // 1. Product name suggestions
  const products = await Product.find({ name: regex }).select("name").limit(5);

  const productSuggestions = products.map((p) => ({
    type: "product",
    text: p.name,
  }));

  // 🔍 Match Categories + Subcategories (tags)
  const allCategories = await Category.find({});
  const categorySuggestions = [];
  const tagSuggestions = [];

  allCategories.forEach((cat) => {
    if (regex.test(cat.main)) {
      categorySuggestions.push({ type: "category", text: cat.main });
    }

    cat.sub.forEach((sub) => {
      if (regex.test(sub)) {
        tagSuggestions.push({ type: "tags", text: sub });
      }
    });
  });

  return res.status(200).json({
    success: true,
    suggestions: [
      ...productSuggestions,
      ...categorySuggestions,
      ...tagSuggestions,
    ],
  });
});

const getProductsByMaterialTag = catchAsyncErrors(async (req, res, next) => {
  const tag = req.params.tag;

  // Base match: material.tag
  let pipeline = [
    {
      $match: {
        "material.tag": {
          $regex: new RegExp("^" + tag + "$", "i"),
        },
      },
    },
  ];

  // Apply filters using AggregationFeatures
  const features = new AggregationFeatures(pipeline, req.query).filter();

  // Add grouping and root-replacement
  features.pipeline.push(
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$productGroup",
        product: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$product" } }
  );

  // Optional sorting before pagination
  features.forceSortBeforeGroup("createdAt", 1);

  // Count total documents before pagination
  const countPipeline = [...features.pipeline];
  countPipeline.push({ $count: "totalCount" });
  const countResult = await Product.aggregate(countPipeline);
  const totalCount = countResult[0]?.totalCount || 0;

  // ✅ Optional: apply user sort on grouped results
  features.sortAfterGroup();

  // Apply pagination
  features.paginate(12);

  // Execute final pipeline
  const products = await Product.aggregate(features.pipeline);

  // Populate detail references
  const populated = await Product.populate(products, { path: "detailsRef" });

  res.status(200).json({
    success: true,
    count: populated.length,
    totalCount,
    products: populated,
  });
});

const getProductsByMaterialTagAndSub = catchAsyncErrors(
  async (req, res, next) => {
    const { tag, sub } = req.params;

    let pipeline = [
      {
        $match: {
          "material.tag": {
            $regex: new RegExp("^" + tag + "$", "i"),
          },
          "material.sub": {
            $regex: new RegExp("^" + sub + "$", "i"),
          },
        },
      },
    ];

    const features = new AggregationFeatures(pipeline, req.query).filter();

    // Add grouping and root-replacement
    features.pipeline.push(
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: "$productGroup",
          product: { $first: "$$ROOT" },
        },
      },
      { $replaceRoot: { newRoot: "$product" } }
    );

    features.forceSortBeforeGroup("createdAt", 1);

    const countPipeline = [...features.pipeline];
    countPipeline.push({ $count: "totalCount" });
    const countResult = await Product.aggregate(countPipeline);
    const totalCount = countResult[0]?.totalCount || 0;

    // ✅ Optional: apply user sort on grouped results
    features.sortAfterGroup();

    features.paginate(12);

    const products = await Product.aggregate(features.pipeline);
    const populated = await Product.populate(products, { path: "detailsRef" });

    res.status(200).json({
      success: true,
      count: populated.length,
      totalCount,
      products: populated,
    });
  }
);

const getTopRatedProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({ rating: { $gt: 4 } })
    .sort({ rating: -1 }) // optional
    .limit(12);

  res.status(200).json({ success: true, products });
});

const getLowStockProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({ stock: { $lt: 10 } }).limit(4);
  res.status(200).json({ success: true, products });
});

module.exports = {
  createProductByCategory,
  getFirstProductsInGroups,
  getProductsByMainCategory,
  getProductsBySubCategory,
  getProductsByGroup,
  updateProductVariant,
  deleteProductVariant,
  calculateFinalPriceForClient,
  getSearchedProducts,
  getSearchSuggestions,
  getProductsByMaterialTag,
  getProductsByMaterialTagAndSub,
  getTopRatedProducts,
  getLowStockProducts,
};
