import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineStar } from "react-icons/md";
import optimizeImage from "../utils/optimizedImage";
import currencyConverter from "../utils/currencyConverter";
import { useSelector } from "react-redux";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [cardPrice, setCardPrice] = useState(null);

  if (!product) return null;

  const { name, images = [], price, productGroup, rating } = product;

  const mainImage = optimizeImage(images[0], 400, "auto:best");
  const hoverImage = optimizeImage(images[1] || images[0], 400, "auto:best");

  const selectedCurrency = useSelector((state) => state.currency.selected);

  const symbol = selectedCurrency?.currencies
    ? selectedCurrency.currencies[Object.keys(selectedCurrency.currencies)[0]]
        .symbol
    : "₹";

  useEffect(() => {
    let isMounted = true;
    const convertPrice = async () => {
      if (!price) return;
      const converted = await currencyConverter(
        selectedCurrency,
        Number(price)
      );
      if (isMounted) setCardPrice(converted);
    };
    convertPrice();
    return () => {
      isMounted = false;
    };
  }, [selectedCurrency, price]);

  return (
    <Link
      to={`/product/group/${productGroup}`}
      className="group block border border-base-200 w-full overflow-hidden transition "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="aspect-square w-full bg-base-100 relative overflow-hidden">
        {/* Main image (below) */}
        <img
          loading="lazy"
          src={mainImage}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? "opacity-0" : "opacity-100"
          }`}
        />

        {/* Hover image (on top) */}
        <img
          loading="lazy"
          src={hoverImage}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h2
          style={{ wordSpacing: "2px" }}
          className="text-xs md:text-[1rem] uppercase font-cardo tracking-wider font-[400]   text-[#4A4A4A] text-center   line-clamp-1 my-2"
        >
          {name}
        </h2>

        <div className="flex justify-center gap-2">
          {price && (
            <div className="font-poppins font-semibold text-[.9rem] text-[#4A4A4A] mt-1  text-center">
              {cardPrice !== null ? (
                <span>
                  {symbol} {cardPrice.toLocaleString()}
                </span>
              ) : (
                <span className="skeleton text-white">Loading...</span>
              )}
            </div>
          )}{" "}
          |
          <p className="font-cardo text-[#C19A6B] font-semibold text-[.9rem] flex items-center gap-1 mt-1 px-1.5">
            <MdOutlineStar />
            <span>{rating}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
