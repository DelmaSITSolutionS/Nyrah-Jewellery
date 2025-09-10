import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import freeShipping from "../../assets/icons/free-delivery.png";
import giftBox from "../../assets/icons/giftbox.png";
import preferences from "../../assets/icons/preferences.png";
import easyReturn from "../../assets/icons/return.png";

import CategoryGuideModal from "../CategoryGuideModal";
import { PiHandbagLight, PiShoppingCartSimpleThin } from "react-icons/pi";
import { CiFileOn } from "react-icons/ci";

import { getAllOptions } from "../../redux/apis/optionApi";
import {
  getProductById,
  getProductsByMaterialTag,
} from "../../redux/apis/productApi";
import { addToCart, fetchCart } from "../../redux/apis/cartApi";

import Loader from "../Loader";
import RingDetail from "./modelDetails/RingDetail";
import PendantDetail from "./modelDetails/PendantDetail";
import BraceletDetail from "./modelDetails/BraceletDetail";
import NecklaceDetail from "./modelDetails/NecklaceDetail";
import EarringDetail from "./modelDetails/EarringDetail";

import { toast } from "react-toastify";
import ReviewSection from "../RatingAndReview/ReviewSection";
import { IoIosStar } from "react-icons/io";
import SwiperCard from "../Swiper/SwiperCard";
import CustomRing from "./modelDetails/CustomRing";
import currencyConverter from "../../utils/currencyConverter";

import visa from "../../assets/payment/visa.png";
import masterCard from "../../assets/payment/masterCard.png";
import mastero from "../../assets/payment/mastero.png";
import paypal from "../../assets/payment/paypal.png";
import { FaWhatsapp } from "react-icons/fa6";
import optimizeImage from "../../utils/optimizedImage";
import CustomBracelet from "./modelDetails/CustomBracelet";
import { clearCustomizationData } from "../../redux/slices/customizationSlice";
import CustomEarring from "./modelDetails/CustomEarring";
import CustomNecklace from "./modelDetails/CustomNecklace";
import CustomPendant from "./modelDetails/CustomPendant";

function calculateCustomizationPrice(customizations) {
  if (!customizations) return 0;
  let total = 0;
  for (const key in customizations) {
    const item = customizations[key];
    if (item && typeof item === "object" && "price" in item) {
      total += Number(item.price) || 0;
    }
  }
  return total;
}

function ProductDetail({ setCartOpen, setLogin }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [showGuide, setShowGuide] = useState(false);
  const [productPrice, setProductPrice] = useState(null);
  const [isCustomTab, setIsCustomTab] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  const { list: metalTones = [] } =
    useSelector((s) => s.options)["metalTone"] || {};
  const { list: products } = useSelector((state) => state.product);
  const selectedCurrency = useSelector((state) => state.currency.selected);
  

  const symbol = selectedCurrency?.currencies
    ? selectedCurrency?.currencies[Object.keys(selectedCurrency?.currencies)[0]]
        .symbol
    : "₹";

  const basePrice = Number(product?.price) || 0;
  const customizationPrice = calculateCustomizationPrice(customizations);
  const finalPrice = basePrice + customizationPrice;

  useEffect(() => {
    let isMounted = true;
    const convertPrice = async () => {
      let converted;
      if (!finalPrice) {
        setProductPrice(0);
        return;
      }
      if (isCustomTab) {
        converted = await currencyConverter(
          selectedCurrency,
          customizationPrice
        );
      } else {
        converted = await currencyConverter(selectedCurrency, finalPrice);
      }
      if (isMounted) setProductPrice(converted);
    };
    convertPrice();
    return () => {
      isMounted = false;
    };
  }, [selectedCurrency, finalPrice]);

  useEffect(() => {
    setIsCustomTab(false); // Always default back to the "Ready Available" tab.
    setCustomizations({}); // Clear any previous selections.
    setProduct(null); // Clear the old product to ensure the loader shows.
    setQuantity(1); // Reset quantity back to 1.

    // Clear the stale customization data from the Redux store
    dispatch(clearCustomizationData());

    const fetchProductAndSetDefaults = async () => {
      const result = await dispatch(getProductById({ id })).unwrap();
      if (result.product) {
        const fetchedProduct = result.product;
        setProduct(fetchedProduct);
        setActiveMedia(
          [...(fetchedProduct.images || []), fetchedProduct.video].filter(
            Boolean
          )[0]
        );

        const initialCustomizations = {
          costomization:isCustomTab?"yes":"no",
          metalTone: fetchedProduct.detailsRef?.metalTone?.[0] || null,
          metalPurity: {
            value: fetchedProduct.detailsRef?.metalPurity?.[0] || null,
            price: 0,
          },
          stoneType: {
            value: fetchedProduct.detailsRef?.stoneType?.[0] || null,
            price: 0,
          },
        };
        setCustomizations(initialCustomizations);
      }
    };

    dispatch(getAllOptions["metalTone"]?.());
    fetchProductAndSetDefaults();
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.material?.tag) {
      dispatch(getProductsByMaterialTag({ tag: product.material.tag }));
    }
  }, [product?.material?.tag, dispatch]);

  const handleAddToCart = async () => {
    // This function's internal logic remains unchanged
    if (!isAuthenticated) {
      setCartOpen(false);
      setLogin(true);
      toast.error("Please login");
      return;
    }

    if (
      !customizations.chainLength &&
      product.category.main === "pendant" &&
      product?.detailsRef?.chainLength?.length > 0
    ) {
      toast.error("Please select chain length");
      return;
    }

    if (
      !customizations.chainLengths &&
      product.category.main === "necklace" &&
      product?.detailsRef?.chainLengths?.length > 0
    ) {
      toast.error("Please select chain length");
      return;
    }

    if (
      (product?.detailsRef?.sizeOptions?.length > 0 &&
        !Object.hasOwn(customizations, "sizeOptions")) ||
      (product?.detailsRef?.sizes?.length > 0 &&
        !Object.hasOwn(customizations, "sizes")) ||
      (product?.detailsRef?.earringSize?.length > 0 &&
        !Object.hasOwn(customizations, "earringSize")) ||
      (product?.detailsRef?.pendantSize?.length > 0 &&
        !Object.hasOwn(customizations, "pendantSize"))
    ) {
      toast.error(`Please select ${product.category.main} size`);
      return;
    }

    if (product.stock === 0) {
      toast.error("Out of stock");
      return;
    }

    const payload = {
      productId: product._id,
      detailsRef: product.detailsRef._id,
      detailsModel: product.detailsModel, // e.g., "ring", "pendant"
      quantity,
      customizations,
    };

    try {
      await dispatch(addToCart(payload)).unwrap();
      toast.success("Added to cart!");
      await dispatch(fetchCart());
      setCartOpen(true); // Show cart drawer
    } catch (err) {
      console.error(err);
      toast.error("Failed to add item to cart.");
    }
  };

  const handleBuyNow = () => {
    // This function's internal logic remains unchanged
    if (!isAuthenticated) {
      setCartOpen(false);
      setLogin(true);
      toast.error("Please login");
      return;
    }

    if (
      !customizations.chainLengths &&
      product.category.main === "necklace" &&
      product?.detailsRef?.chainLengths?.length > 0
    ) {
      toast.error("Please select chain length");
      return;
    }

    if (
      (product?.detailsRef?.sizeOptions?.length > 0 &&
        !Object.hasOwn(customizations, "sizeOptions")) ||
      (product?.detailsRef?.sizes?.length > 0 &&
        !Object.hasOwn(customizations, "sizes")) ||
      (product?.detailsRef?.earringSize?.length > 0 &&
        !Object.hasOwn(customizations, "earringSize")) ||
      (product?.detailsRef?.pendantSize?.length > 0 &&
        !Object.hasOwn(customizations, "pendantSize"))
    ) {
      toast.error(`Please select ${product.category.main} size`);
      return;
    }

    if (product.stock === 0) {
      toast.error("Out of stock");
      return;
    }

    const payload = {
      productId: product._id,
      detailsRef: product.detailsRef._id,
      detailsModel: product.detailsModel,
      quantity,
      customizations,
      product: product,
    };

    sessionStorage.setItem("buyNowItem", JSON.stringify(payload));
    navigate("/checkout?buynow=true");
  };

  const handleToneChange = (toneName) => {
    setCustomizations((prev) => ({
      ...prev,
      metalTone: toneName,
    }));
  };

  const handleCustomizationChange = useCallback((updates) => {
    setCustomizations((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleTabChange = (isCustom) => {
    setIsCustomTab(isCustom);
    if (isCustom) {
      // When switching TO custom, clear the state
      setCustomizations({costomization:isCustom?"yes":"no"});
    } else {
      // When switching BACK to "Ready Available", re-apply the product's defaults
      if (product) {
        setCustomizations({
          costomization:isCustomTab?"yes":"no",
          metalTone: product.detailsRef?.metalTone?.[0] || null,
          metalPurity: {
            value: product.detailsRef?.metalPurity?.[0] || null,
            price: 0,
          },
          stoneType: {
            value: product.detailsRef?.stoneType?.[0] || null,
            price: 0,
          },
        });
      }
    }
  };

  // console.log(product)

  const isVideo = (url) =>
    typeof url === "string" && (url.endsWith(".mp4") || url.includes("video"));

  if (!product) return <Loader />;

  const mediaItems = [...(product?.images || []), product?.video].filter(
    Boolean
  );

  // console.log(customizations);

  return (
    <div className="pt-[6rem] lg:pt-[9rem] pb-10 px-[1rem] sm:px-[3rem] ">
      <div className="grid md:grid-cols-[55%_42%] gap-8 md:gap-[3%] mb-8 ">
        {/* LEFT SIDE: MEDIA VIEWER */}
        <div className="self-start md:sticky md:top-[6rem] lg:top-[9rem] ">
          <div className="flex flex-col-reverse lg:justify-end lg:flex-row gap-3 md:max-h-[100vh]">
            <div className="pt-3 lg:pt-0 flex lg:flex-col gap-2 overflow-x-auto">
              {mediaItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveMedia(item)}
                  className={`cursor-pointer aspect-square border-2 rounded-md ${
                    item === activeMedia
                      ? "border-[#443627]"
                      : "border-transparent"
                  }`}
                >
                  {isVideo(item) ? (
                    <video
                      src={item}
                      className="w-15 h-15 aspect-square object-cover rounded"
                      muted
                    />
                  ) : (
                    <img
                      src={item}
                      loading="lazy"
                      className="w-15 h-15 aspect-square object-cover rounded"
                      alt={`thumb-${idx}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="w-full lg:w-[90%] rounded overflow-hidden aspect-square ">
              {isVideo(activeMedia) ? (
                <video
                  autoPlay
                  src={activeMedia}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={optimizeImage(activeMedia, 1200, "auto:best")}
                  loading="lazy"
                  alt="Product preview"
                  className="w-full h-full object-cover aspect-square"
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: PRODUCT INFO */}
        <div className="font-cardo space-y-4">
          <div className="p-5 border-[1px] rounded-md border-[#dddddd]">
            <h1 className="text-2xl pb-0 uppercase font-[300] text-[black] tracking-wide">
              {product.name}
            </h1>
            <div className="flex justify-start pb-3">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <IoIosStar
                    key={i}
                    size={14}
                    className="cursor-pointer transition-colors"
                    color={value <= product.rating ? "#facc15" : "#e5e7eb"}
                  />
                );
              })}
            </div>
            <p className=" capitalize pb-3 text-sm text-[#C19A6B]">
              <span className="font-[500] font-poppins tracking-wider text-[#4A4A4A]">
                stock :
              </span>
              {product?.stock === 0 ? "Out of stock" : "In stock"}
            </p>
            <p className="text-xl font-poppins pb-3 font-medium flex flex-col gap-0.1">
              {productPrice !== null ? (
                <span>
                  {symbol} {productPrice.toLocaleString()}
                </span>
              ) : (
                <span className="skeleton text-white">Loading...</span>
              )}
              <span className="text-[.75rem] tracking-wider font-light text-[#8d8d8d]">
                (MRP Inclusive of all taxes)
              </span>
            </p>
            <p className="uppercase tracking-wider font-poppins text-[.9rem] mb-6 font-[400]">
              <span className="font-cardo tracking-widest font-semibold text-[#4A4A4A]">
                SKU :
              </span>
              {product?.productGroup}
            </p>
            <div
              className={`${
                product?.detailsRef?.metalTone === "" ? "hidden" : "flex"
              } flex-wrap flex-col text-[.9rem] items-start gap-2 `}
            >
              <p className="font-bold text-[#4A4A4A] uppercase tracking-wider">
                Metal Tone :
                <span className=" ms-1 font-cardo text-[.9rem] tracking-wider font-medium capitalize">
                  {customizations?.metalTone}
                </span>
              </p>
              <div className="flex gap-2">
                {product?.detailsRef?.metalTone?.map((v, idx) => (
                  <div key={idx}>
                    <button
                      onClick={() => handleToneChange(v)}
                      className={`p-1 rounded-full text-sm transition cursor-pointer ${
                        v === customizations?.metalTone
                          ? "border border-dashed border-[#443627] text-white"
                          : "bg-white text-[#443627] border-[#443627] hover:text-white"
                      }`}
                    >
                      {metalTones.map((tone) => {
                        const matchingVariant = v === tone.name;
                        if (!matchingVariant) return null;
                        return (
                          <div
                            key={tone._id || tone.name}
                            className="w-7 h-7 rounded-full "
                            title={tone.name}
                          >
                            <img
                              src={tone.image}
                              alt={tone.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                        );
                      })}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="py-5 space-y-4 rounded-md ]">
            <button
              onClick={() => setShowGuide(true)}
              className=" capitalize text underline underline-offset-2 cursor-pointer opacity-80 hover:opacity-100 flex items-center justify-start gap-1 font-light text-[#443627] w-full text-[.9rem]"
            >
              <CiFileOn className="text-sm" />
              {product?.category.main} Size Guide
            </button>
            {showGuide && (
              <CategoryGuideModal
                category={product.category.main}
                onClose={() => setShowGuide(false)}
              />
            )}
            {product && (
              <div className="tabs tabs-lift">
                <input
                  type="radio"
                  name="my_tabs_3"
                  className="tab font-poppins text-[.75rem] [--tab-border-color:#cccccc] tracking-wide"
                  aria-label="Ready Available"
                  checked={!isCustomTab}
                  onChange={() => handleTabChange(false)}
                />
                <div className="tab-content border-[#cccccc] bg-base-100 py-6 px-4">
                  {!isCustomTab && product.category?.main === "ring" && (
                    <RingDetail
                      detailData={product.detailsRef}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                  {!isCustomTab && product.category?.main === "bracelet" && (
                    <BraceletDetail
                      detailData={product.detailsRef}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                  {!isCustomTab && product.category?.main === "necklace" && (
                    <NecklaceDetail
                      detailData={product.detailsRef}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                  {!isCustomTab && product.category?.main === "earring" && (
                    <EarringDetail
                      detailData={product.detailsRef}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                  {!isCustomTab && product.category?.main === "pendant" && (
                    <PendantDetail
                      detailData={product.detailsRef}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                </div>
                <input
                  type="radio"
                  name="my_tabs_3"
                  className="tab font-poppins text-[.75rem] [--tab-border-color:#cccccc] tracking-wide"
                  aria-label="Customization"
                  checked={isCustomTab}
                  disabled={product.material?.tag !== "gold" }
                  onChange={() => handleTabChange(true)}
                />
                <div className="tab-content bg-base-100 border-[#cccccc] py-6 px-4">
                  {isCustomTab && product.category?.main === "ring" && (
                    <CustomRing
                      productGroup={product?.productGroup}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                  {isCustomTab && product.category?.main === "bracelet" && (
                    <CustomBracelet
                      productGroup={product?.productGroup}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}

                  {isCustomTab && product.category?.main === "earring" && (
                    <CustomEarring
                      productGroup={product?.productGroup}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                  {isCustomTab && product.category?.main === "necklace" && (
                    <CustomNecklace
                      productGroup={product?.productGroup}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                  {isCustomTab && product.category?.main === "pendant" && (
                    <CustomPendant
                      productGroup={product?.productGroup}
                      selectedCustomizations={customizations}
                      onChange={handleCustomizationChange}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          <div className=" space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <span className="font-bold text-sm tracking-wider uppercase ">
                Quantity:
              </span>
              <div className="flex gap-4 w-full">
                <div className="flex items-center border rounded ">
                  <button
                    className="px-3 py-1 cursor-pointer text-lg hover:bg-gray-100"
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                  >
                    −
                  </button>
                  <span className="px-4 font-poppins">{quantity}</span>
                  <button
                    className="px-3 py-1 cursor-pointer text-lg hover:bg-gray-100"
                    disabled={quantity >= product?.stock}
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="relative group border overflow-hidden z-2 hover:text-white font-semibold border-[#443627] w-full tooltip tooltip-right text-[#443627] uppercase text-sm tracking-wider py-2 rounded transition justify-center flex items-center gap-2 px-2 cursor-pointer"
                  onClick={() => handleAddToCart()}
                >
                  <PiShoppingCartSimpleThin className="text-lg" />
                  {product?.stock===0?"Out of stock":"Add to cart"}
                  <div className="group z-[-1] absolute group-hover:top-0 transition-all duration-300 top-[100%] left-0 w-full h-full bg-black"></div>
                </button>
              </div>
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 rounded font-poppins uppercase tracking-wider text-sm font-[400] text-[#ffffff] cursor-pointer bg-[#9b6500] hover:bg-[#000000] py-2 transition"
              onClick={() => handleBuyNow()}
            >
              <PiHandbagLight className="text-lg" />
              Buy Now
            </button>
            <div className="flex justify-center gap-1">
              <img src={visa} alt="visa" />
              <img src={masterCard} alt="masterCard" />
              <img src={mastero} alt="mastero" />
              <img src={paypal} alt="paypal" />
            </div>
          </div>
          <div>
            <div className="grid grid-cols-4 my-4 p-4 rounded-2xl bg-gray-100 w-full justify-between items-center">
              <div className="flex flex-col gap-1 items-center text-sm lg:text-lg text-center">
                <img className="w-8 lg:w-14" src={easyReturn} alt="" />
                <p>Easy Return</p>
              </div>
              <div className="flex flex-col gap-1 items-center text-sm lg:text-lg text-center">
                <img className="w-8 lg:w-14" src={freeShipping} alt="" />
                <p>Free Shipping</p>
              </div>
              <div className="flex flex-col gap-2.5 items-center text-sm lg:text-lg text-center">
                <img className="w-8 lg:w-12" src={giftBox} alt="" />
                <p>Gifting </p>
              </div>
              <div className="flex flex-col gap-2.5 items-center text-sm lg:text-lg text-center">
                <img className="w-8 lg:w-14" src={preferences} alt="" />
                <p>Maintenance</p>
              </div>
            </div>
            {product?.shortDescription && (
              <div className="collapse tracking-wider collapse-plus p-0 bg-base-100 border-[#d6d6d6] border-t-1 border-b-1 rounded-none mt-3">
                <input type="checkbox" id="description" />
                <div className="px-0 collapse-title font-semibold">
                  Description
                </div>
                <div className="px-0 collapse-content text-sm text-justify first-letter:capitalize">
                  <pre className="text-[.95rem] font-cardo text-wrap">
                    {product?.shortDescription}
                  </pre>
                  {product?.detailsRef?.careInstructions && (
                    <div className="py-3 ">
                      <strong className="text-[1.1rem] ">Care Instructions: </strong>
                      <pre className="text-[.95rem] mt-3 font-cardo text-wrap">{product?.detailsRef.careInstructions}</pre>
                    </div>
                  )}
                  {product?.detailsRef?.packaging && (
                    <li className="pt-3">
                      <strong>Packaging: </strong>
                      {product?.detailsRef.packaging}
                    </li>
                  )}
                  <table className="my-5 table-md w-full">
                    <thead>
                      <tr className="border border-[#d6d6d6]">
                        <th className="uppercase text-[.8rem] font-semibold tracking-wider text-black">
                          {product?.category?.main}
                          Details
                        </th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody className="text-gray-800 tracking-wider capitalize">
                      <tr>
                        <td className="border border-[#d6d6d6] py-4">
                          Metal Tone
                        </td>

                        <td className="border border-[#d6d6d6]">
                          {customizations?.metalTone}
                        </td>
                      </tr>

                      {product?.detailsRef?.stoneType != "" &&
                        product?.detailsRef?.stoneType && (
                          <tr>
                            <td className="border border-[#d6d6d6] py-4">
                              Stone Type
                            </td>

                            <td className="border border-[#d6d6d6] text-start">
                              {product?.detailsRef.stoneType}
                            </td>
                          </tr>
                        )}

                      {product?.detailsRef?.diamondSize != "" &&
                        product?.detailsRef?.diamondSize && (
                          <tr>
                            <td className="border border-[#d6d6d6] py-4">
                              Diamond Size
                            </td>

                            <td className="border border-[#d6d6d6] text-start">
                              {product?.detailsRef.diamondSize}
                            </td>
                          </tr>
                        )}

                      {product?.detailsRef?.finish != "" &&
                        product?.detailsRef?.finish && (
                          <tr>
                            <td className="border border-[#d6d6d6] py-4">
                              Finish
                            </td>

                            <td className="border border-[#d6d6d6] text-start">
                              {product?.detailsRef.finish}
                            </td>
                          </tr>
                        )}

                      {product?.detailsRef.weight &&
                        product?.detailsRef.weight != "" && (
                          <tr>
                            <td className="border border-[#d6d6d6] py-4">
                              Weight
                            </td>

                            <td className="border border-[#d6d6d6]">
                              {product?.detailsRef.weight}
                            </td>
                          </tr>
                        )}

                      {product?.detailsRef?.centerStoneOptions?.carats != "" &&
                        product?.detailsRef?.centerStoneOptions?.carats && (
                          <tr>
                            <td className="border border-[#d6d6d6] py-4">
                              Stone carat
                            </td>

                            <td className="border border-[#d6d6d6] text-start">
                              {product?.detailsRef?.centerStoneOptions?.carats}
                            </td>
                          </tr>
                        )}

                      {product?.detailsRef?.centerStoneOptions?.shapes != "" &&
                        product?.detailsRef?.centerStoneOptions?.shapes && (
                          <tr>
                            <td className="border border-[#d6d6d6] py-4">
                              Stone shape
                            </td>

                            <td className="border border-[#d6d6d6] text-start">
                              {product?.detailsRef?.centerStoneOptions?.shapes}
                            </td>
                          </tr>
                        )}

                      {product?.detailsRef?.centerStoneOptions?.qualities !=
                        "" &&
                        product?.detailsRef?.centerStoneOptions?.qualities && (
                          <tr>
                            <td className="border border-[#d6d6d6] py-4">
                              Stone quality
                            </td>

                            <td className="border border-[#d6d6d6] text-start">
                              {
                                product?.detailsRef?.centerStoneOptions
                                  ?.qualities
                              }
                            </td>
                          </tr>
                        )}

                      {product?.detailsRef.hypoallergenic && (
                        <tr>
                          <td className="border border-[#d6d6d6] py-4">
                            hypoallergenic
                          </td>

                          <td className="border border-[#d6d6d6]">
                            {product?.detailsRef.hypoallergenic ? "yes" : "no"}
                          </td>
                        </tr>
                      )}

                      <tr>
                        <td className="border border-[#d6d6d6] py-4">
                          hallmark
                        </td>

                        <td className="border border-[#d6d6d6]">
                          {product?.detailsRef.certification.isHallmarked
                            ? "yes"
                            : "no"}
                        </td>
                      </tr>

                      <tr>
                        <td className="border border-[#d6d6d6] py-4">
                          jewellery certificate
                        </td>

                        <td className="border border-[#d6d6d6]">
                          {product?.detailsRef.certification.isCertified
                            ? product?.detailsRef.certification.certType
                            : "no"}
                        </td>
                      </tr>

                      <tr>
                        <td className="border border-[#d6d6d6] py-4">SKU</td>

                        <td className="border border-[#d6d6d6]">
                          {product?.productGroup}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {product?.detailsRef.shippingNote && (
              <div className="collapse tracking-wider collapse-plus p-0  bg-base-100 border-[#d6d6d6]  border-b-1 rounded-none">
                <input type="checkbox" id="shippingInfo" />

                <div className="px-0 collapse-title font-semibold ">
                  Shipping Policy
                </div>

                <div className="px-0 collapse-content text-justify first-letter:capitalize">
                  <pre className="font-cardo text-[.95rem] text-wrap">
                    {product?.detailsRef.shippingNote}
                  </pre>

                  {product?.detailsRef.deliveryTime && (
                    <div className="pt-3">
                      <strong className="text-[1rem]">Delivery Time </strong>

                      <pre className=" mt-3 text-[.95rem] font-cardo text-wrap">{product?.detailsRef.deliveryTime}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="collapse tracking-wider collapse-plus p-0 border-y-[1px]  bg-base-100 border-[#d6d6d6]  rounded-none">
              <input type="checkbox" id="shippingInfo" />

              <div className="px-0 collapse-title font-semibold ">
                Refund & Return Policy
              </div>

              <div className="px-0 collapse-content text-justify first-letter:capitalize">
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li className="text-justify">
                    Returns are accepted within <strong>"30 days"</strong> of
                    delivery.
                  </li>
                  <li>
                    <strong>Customized orders</strong> are{" "}
                    <strong>"non-refundable"</strong>.
                  </li>
                  <li>
                    <strong>"Shipping and insurance fees"</strong> are not
                    refundable.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border py-4 border-[#dddddd]">
        <ReviewSection productId={product?._id} />
      </div>
      <div className="py-4">
        <h2 className="md:text-xl tracking-wide font-cardo font-[500] py-3">
          Explore Similar
        </h2>
        <SwiperCard products={products} slidesPerView={4} />
      </div>
    </div>
  );
}

export default ProductDetail;
