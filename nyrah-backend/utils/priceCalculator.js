const Product = require("../models/productModel");
const { Ring, Bracelet, Earring, Pendant, Necklace } =
  require("../models/detailModel");

const models = { Ring, Bracelet, Earring, Pendant, Necklace };

const calculateFinalPrice = async ({
  productId,
  detailsRef,
  detailsModel,
  customizations = {},
}) => {
  const product = await Product.findById(productId);
  const details = await models[detailsModel]?.findById(detailsRef);

  if (!product || !details) throw new Error("Invalid product or details");

  let finalPrice = product.price;
  let customizationPrice = 0;

  // const centerKeys = ["carats", "shapes", "qualities"];

  for (const key of Object.keys(customizations)) {
    const { price } = customizations[key] || {};
    if(price===undefined) continue;
    // 🔹 For RING → look into centerStoneOptions
    // if (
    //   detailsModel === "Ring" &&
    //   centerKeys.includes(key) &&
    //   details.centerStoneOptions?.[key]
    // ) {
    //   const match = details.centerStoneOptions[key].find(
    //     (opt) => opt.value === value
    //   );
    //   if (match?.price) customizationPrice += match.price;
    //   continue;
    // }

    // 🔹 For other models → flat array fields like sizeOptions, etc.
    // if (Array.isArray(details[key])) {
    //   const match = details[key].find((opt) => opt.value === value);
    //   if (match?.price) customizationPrice += match.price;
    // }


    customizationPrice += price;
  }

  return { finalPrice,customizationPrice };
};

module.exports = { calculateFinalPrice };
