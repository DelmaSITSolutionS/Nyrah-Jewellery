import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import freeShipping from "../../assets/icons/free-delivery.png";
import giftBox from "../../assets/icons/giftbox.png";
import preferences from "../../assets/icons/preferences.png";
import easyReturn from "../../assets/icons/return.png";

import CategoryGuideModal from "../CategoryGuideModal";
import { PiHandbagLight, PiShoppingCartSimpleThin } from "react-icons/pi";
import { CiFileOn } from "react-icons/ci";

import { getAllOptions } from "../../redux/apis/optionApi";
import {
  getProductGroupVariants,
  getProductsByMain,
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
  const { groupname } = useParams();
  const dispatch = useDispatch();

  const [variants, setVariants] = useState([]);
  const [category, setCategory] = useState("ring");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [customizations, setCustomizations] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [showGuide, setShowGuide] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  const featureSlice = useSelector((s) => s.options);
  const { list: metalTones = [] } = featureSlice["metalTone"] || {};

  const { list: products } = useSelector((state) => state.product);
  const [customizationPrice, setCustomizationPrice] = useState(0);

  const basePrice = Number(selectedVariant?.price) || 0;
  const grandTotal = basePrice + customizationPrice;

  console.log(selectedVariant)



  useEffect(() => {
    const fetchVariants = async () => {
      const data = await dispatch(
        getProductGroupVariants({ groupId: groupname })
      ).unwrap();

      const firstVariant = data.variants[0];
      setVariants(data.variants);
      setSelectedVariant(firstVariant);
      setCategory(firstVariant?.category?.main);
      const initialMedia = [
        ...(data.variants[0]?.images || []),
        data.variants[0]?.video,
      ].filter(Boolean);
      setActiveMedia(initialMedia[0]); // set default media
    };

    dispatch(getAllOptions["metalTone"]?.());

    fetchVariants();
  }, [groupname]);

    useEffect(() => {
    setCustomizationPrice(calculateCustomizationPrice(customizations));
  }, [customizations]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setCartOpen(false);
      setLogin(true);
      toast.error("Please login");
      return;
    }
    const payload = {
      productId: selectedVariant._id,
      detailsRef: selectedVariant.detailsRef._id,
      detailsModel: selectedVariant.detailsModel, // e.g., "ring", "pendant"
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
    if (!isAuthenticated) {
      setCartOpen(false);
      setLogin(true);
      toast.error("Please login");
      return;
    }
    const payload = {
      productId: selectedVariant._id,
      detailsRef: selectedVariant.detailsRef._id,
      detailsModel: selectedVariant.detailsModel,
      quantity,
      customizations,
      finalPrice: selectedVariant.price, // Add price for checkout
      product: selectedVariant,
    };

    sessionStorage.setItem("buyNowItem", JSON.stringify(payload));
    window.location.href = "/checkout?buynow=true";
  };

  useEffect(() => {
    dispatch(getProductsByMain({ mainCategory: category }));
  }, [category]);

  const handleToneChange = (toneName) => {
    const matching = variants.find((v) => v.detailsRef.metalTone === toneName);
    if (matching) {
      setSelectedVariant(matching);

      const newMedia = [...(matching.images || []), matching.video].filter(
        Boolean
      );
      setActiveMedia(newMedia[0]); // update media on tone change
    }
  };

  const isVideo = (url) =>
    typeof url === "string" && (url.endsWith(".mp4") || url.includes("video"));

  if (!selectedVariant) return <Loader />;

  const mediaItems = [
    ...(selectedVariant.images || []),
    selectedVariant.video,
  ].filter(Boolean);

  return (
    <div className="pt-[6rem] lg:pt-[9rem] pb-10 px-[1rem] sm:px-[3rem] ">
      <div className="grid md:grid-cols-[55%_42%] gap-8 md:gap-[3%] mb-8 ">
        {/* LEFT SIDE: MEDIA VIEWER */}
        <div className="self-start md:sticky md:top-[6rem] lg:top-[9rem] ">
          <div className="flex flex-col-reverse lg:justify-end lg:flex-row gap-3 md:max-h-[100vh]">
            {/* Thumbnail Gallery */}
            <div className="pt-3 lg:pt-0 flex lg:flex-col gap-2 overflow-x-auto">
              {mediaItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveMedia(item)}
                  className={`cursor-pointer  aspect-square border-2 rounded-md ${
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
                      className="w-15 h-15 aspect-square object-cover rounded"
                      alt={`thumb-${idx}`}
                    />
                  )}
                </div>
              ))}
            </div>
            {/* Main Preview */}
            <div className="w-full lg:w-[90%]  rounded  overflow-hidden aspect-square ">
              {isVideo(activeMedia) ? (
                <video
                  autoPlay
                  src={activeMedia}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeMedia}
                  alt="Product preview"
                  className="w-full h-full object-cover aspect-square"
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: (to be implemented next) */}
        <div className="font-cardo space-y-4">
          <div className="p-5 border-[1px] rounded-md border-[#dddddd]">
            <h1 className="text-2xl pb-0 uppercase  font-[300] text-[black]  tracking-wide">
              {selectedVariant.name}
            </h1>

            <div className="flex justify-start pb-3">
              {[...Array(5)].map((_, i) => {
                const value = i + 1;
                return (
                  <IoIosStar
                    key={i}
                    size={14}
                    className="cursor-pointer transition-colors"
                    color={
                      value <= selectedVariant.rating ? "#facc15" : "#e5e7eb"
                    }
                  />
                );
              })}
            </div>

            <p className=" capitalize pb-3 text-sm text-[#C19A6B]">
              <span className="font-[500] font-poppins tracking-wider text-[#4A4A4A]">
                stock :{" "}
              </span>
              {quantity == 0 ? "Out of stock" : "In stock"}
            </p>

            <p className="text-xl font-poppins pb-3  font-medium flex flex-col gap-0.1">
              <span>
                &#8377; {grandTotal.toLocaleString()}
              </span>
              <span className="text-[.75rem] tracking-wider font-light text-[#8d8d8d]">
                (MRP Inclusive of all taxes)
              </span>
            </p>

            <p className="uppercase tracking-wider font-poppins text-[.9rem] mb-6 font-[400]">
              <span className="font-cardo tracking-widest font-semibold text-[#4A4A4A]">
                SKU :{" "}
              </span>
              {selectedVariant?.productGroup}
            </p>

            <div
              className={`${
                selectedVariant?.detailsRef?.metalTone === ""
                  ? "hidden"
                  : "flex"
              } flex-wrap flex-col text-[.9rem] items-start gap-2 `}
            >
              <p className="font-bold text-[#4A4A4A] uppercase tracking-wider">
                Metal Tone :
                <span className=" ms-1 font-cardo text-[.9rem] tracking-wider font-medium capitalize">
                  {selectedVariant?.detailsRef.metalTone}
                </span>
              </p>
              <div className="flex gap-2">
                {variants.map((v, idx) => (
                  <div key={idx}>
                    <button
                      onClick={() => handleToneChange(v.detailsRef.metalTone)}
                      className={`p-1 rounded-full  text-sm transition cursor-pointer ${
                        selectedVariant?.detailsRef.metalTone ===
                        v.detailsRef.metalTone
                          ? "border border-dashed border-[#443627] text-white"
                          : "bg-white text-[#443627] border-[#443627] hover:text-white"
                      }`}
                    >
                      {metalTones.map((tone) => {
                        // show this tone only if a variant exists in that tone
                        const matchingVariant =
                          v.detailsRef.metalTone === tone.name;

                        if (!matchingVariant) return null;

                        return (
                          <div
                            key={tone._id || tone.name}
                            className="w-7 h-7  rounded-full "
                            title={tone.name}
                          >
                            <img
                              src={tone.image} // the tone’s own image
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

          <div className="py-5  space-y-4 rounded-md  ]">
            <button
              onClick={() => setShowGuide(true)}
              className=" capitalize text underline underline-offset-2 cursor-pointer opacity-80 hover:opacity-100 flex items-center justify-start gap-1 font-light text-[#443627] w-full   text-[.9rem]"
            >
              <CiFileOn className="text-sm" />
              {selectedVariant?.category.main} Size Guide
            </button>

            {/* Modal */}
            {showGuide && (
              <CategoryGuideModal
                category={selectedVariant.category.main}
                onClose={() => setShowGuide(false)}
              />
            )}

            {/* Category-specific Detail Form */}
            <div className="tabs tabs-lift">
              <input
                type="radio"
                name="my_tabs_3"
                className="tab  font-poppins text-[.75rem] [--tab-border-color:#cccccc] tracking-wide"
                aria-label="Ready Available"
                defaultChecked
              />
              <div className="tab-content border-[#cccccc] bg-base-100 py-6 px-4">
                {selectedVariant.category?.main === "ring" && (
                  <RingDetail
                    detailData={selectedVariant.detailsRef}
                    selectedCustomizations={customizations}
                    onChange={setCustomizations}
                  />
                )}

                {selectedVariant.category?.main === "bracelet" && (
                  <BraceletDetail
                    detailData={selectedVariant.detailsRef}
                    selectedCustomizations={customizations}
                    onChange={setCustomizations}
                  />
                )}

                {selectedVariant.category?.main === "necklace" && (
                  <NecklaceDetail
                    detailData={selectedVariant.detailsRef}
                    selectedCustomizations={customizations}
                    onChange={setCustomizations}
                  />
                )}

                {selectedVariant.category?.main === "earring" && (
                  <EarringDetail
                    detailData={selectedVariant.detailsRef}
                    selectedCustomizations={customizations}
                    onChange={setCustomizations}
                  />
                )}

                {selectedVariant.category?.main === "pendant" && (
                  <PendantDetail
                    detailData={selectedVariant.detailsRef}
                    selectedCustomizations={customizations}
                    onChange={setCustomizations}
                  />
                )}
              </div>

              <input
                type="radio"
                name="my_tabs_3"
                className="tab font-poppins text-[.75rem] [--tab-border-color:#cccccc] tracking-wide"
                aria-label="Customization"
                disabled={selectedVariant.category?.main !== "ring"}
              />
              {/* <div className="tab-content bg-base-100 border-[#cccccc] py-6 px-4">
                 {selectedVariant.category?.main === "ring" && (
                  <CustomRing
                    detailData={selectedVariant.detailsRef}
                    selectedCustomizations={customizations}
                    onChange={setCustomizations}
                  />
                )}
              </div> */}
            </div>
          </div>

          <div className=" space-y-4">
            {/* Quantity Selector */}
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
                    disabled={quantity > selectedVariant?.stock}
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
                {/* Add to Cart Button */}
                <button
                  className="relative group border overflow-hidden z-2 hover:text-white font-semibold border-[#443627] w-full tooltip tooltip-right text-[#443627] uppercase text-sm tracking-wider py-2 rounded transition justify-center flex items-center gap-2 px-2 cursor-pointer"
                  onClick={() => handleAddToCart()}
                >
                  <PiShoppingCartSimpleThin className="text-lg" />
                  Add to cart
                  <div className="group z-[-1] absolute group-hover:top-0 transition-all duration-300 top-[100%] left-0 w-full h-full bg-black"></div>
                </button>
              </div>
            </div>

            {/* Buy It Now Button */}
            <button
              className="w-full flex items-center justify-center gap-2 rounded font-poppins uppercase tracking-wider text-sm font-[400] text-[#ffffff] cursor-pointer bg-[#9b6500] hover:bg-[#000000] py-2 transition"
              onClick={() => handleBuyNow()}
            >
              <PiHandbagLight className="text-lg" />
              Buy Now
            </button>
          </div>

          <div>
            <div className="grid grid-cols-4 my-4 p-4 rounded-2xl bg-gray-100 w-full justify-between items-center">
              <div className="flex flex-col gap-1 items-center text-sm lg:text-lg  text-center">
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

            {selectedVariant?.shortDescription && (
              <div className="collapse tracking-wider collapse-plus p-0  bg-base-100 border-[#d6d6d6] border-t-1 border-b-1 rounded-none mt-3">
                <input type="checkbox" id="description" />
                <div className="px-0 collapse-title font-semibold ">
                  Description
                </div>
                <div className="px-0 collapse-content text-sm text-justify first-letter:capitalize">
                  {selectedVariant?.shortDescription}

                  {selectedVariant?.detailsRef.careInstructions && (
                    <li className="pt-3">
                      <strong>Care Intructions : </strong>
                      {selectedVariant?.detailsRef.careInstructions}
                    </li>
                  )}

                  {selectedVariant?.detailsRef.packaging && (
                    <li className="pt-3">
                      <strong>Packaging : </strong>
                      {selectedVariant?.detailsRef.packaging}
                    </li>
                  )}

                  <table className="my-5 table-md w-full">
                    <thead>
                      <tr className="border border-[#d6d6d6]">
                        <th className="uppercase text-[.8rem] font-semibold tracking-wider text-black">
                          {selectedVariant?.category?.main} Details
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
                          {variants.map((v, index) => v?.detailsRef.metalTone)}
                        </td>
                      </tr>
                      {selectedVariant?.detailsRef?.metalPurity != "" && (
                        <tr>
                          <td className="border border-[#d6d6d6] py-4">
                            Metal Purity
                          </td>
                          <td className="border border-[#d6d6d6] text-start">
                            {selectedVariant?.detailsRef.metalPurity?.map(
                              (v, index) => (
                                <span key={v?._id}>{v?.value},</span>
                              )
                            )}
                          </td>
                        </tr>
                      )}
                      {selectedVariant?.detailsRef.weight && (
                        <tr>
                          <td className="border border-[#d6d6d6] py-4">
                            Weight
                          </td>
                          <td className="border border-[#d6d6d6]">
                            {selectedVariant?.detailsRef.weight}
                          </td>
                        </tr>
                      )}
                      {selectedVariant?.detailsRef.hypoallergenic && (
                        <tr>
                          <td className="border border-[#d6d6d6] py-4">
                            hypoallergenic
                          </td>
                          <td className="border border-[#d6d6d6]">
                            {selectedVariant?.detailsRef.hypoallergenic
                              ? "yes"
                              : "no"}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="border border-[#d6d6d6] py-4">
                          hallmark
                        </td>
                        <td className="border border-[#d6d6d6]">
                          {selectedVariant?.detailsRef.certification
                            .isHallmarked
                            ? "yes"
                            : "no"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-[#d6d6d6] py-4">
                          jewellery certificate
                        </td>
                        <td className="border border-[#d6d6d6]">
                          {selectedVariant?.detailsRef.certification.isCertified
                            ? selectedVariant?.detailsRef.certification.certType
                            : "no"}
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-[#d6d6d6] py-4">SKU</td>
                        <td className="border border-[#d6d6d6]">
                          {selectedVariant?.productGroup}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedVariant?.moreDetail && (
              <div className="collapse tracking-wider collapse-plus p-0  bg-base-100 border-[#d6d6d6]  border-b-1 rounded-none">
                <input type="checkbox" id="moreDetail" />
                <div className="px-0 collapse-title font-semibold ">
                  More Details
                </div>
                <div className="px-0 collapse-content text-sm text-justify first-letter:capitalize">
                  {selectedVariant?.moreDetail}
                </div>
              </div>
            )}

            {selectedVariant?.detailsRef.shippingNote && (
              <div className="collapse tracking-wider collapse-plus p-0  bg-base-100 border-[#d6d6d6]  border-b-1 rounded-none">
                <input type="checkbox" id="shippingInfo" />
                <div className="px-0 collapse-title font-semibold ">
                  Shipping Policy
                </div>
                <div className="px-0 collapse-content text-sm text-justify first-letter:capitalize">
                  {selectedVariant?.detailsRef.shippingNote}
                  {selectedVariant?.detailsRef.deliveryTime && (
                    <li className="pt-3">
                      <strong>Delivery Time : </strong>
                      {selectedVariant?.detailsRef.deliveryTime}
                    </li>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* reting and review  */}
      <div className="border py-4 border-[#dddddd]">
        <ReviewSection productId={selectedVariant?._id} />
      </div>

      {/* Similer products */}
      <div className="py-4">
        <h2 className="md:text-xl  tracking-wide font-cardo font-[500] py-3">
          Explore Similar
        </h2>
        <SwiperCard products={products} slidesPerView={4} />
      </div>
    </div>
  );
}

export default ProductDetail;
