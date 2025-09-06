import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VscClose } from "react-icons/vsc";
import PriceRangeSlider from "./PriceRangeSlider";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function FilterDrawer({
  /** parent‑state */
  isOpen,
  onClose,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
}) {
  /* disable body scroll while drawer open */
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const { categories } = useSelector((state) => state.category);
  const { materials } = useSelector((state) => state.material);

  /* framer‑motion variants */
  const backdrop = {
    hidden: { opacity: 0 },
    show: { opacity: 0.4, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  const panel = {
    hidden: { x: "-100%" },
    show: { x: 0, transition: { type: "tween", duration: 0.3 } },
    exit: { x: "-100%", transition: { type: "tween", duration: 0.25 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            key="filter-backdrop"
            className="fixed inset-0 bg-black z-[1001]"
            variants={backdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
          />

          {/* sliding panel */}
          <motion.div
            key="filter-panel"
            className="fixed  top-0 left-0 w-full  max-w-[300px] h-screen bg-base-100 z-[1002] shadow-lg flex flex-col"
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* Header */}
            <div className="px-3.5 py-4 flex justify-between items-center border-b border-base-300">
              <h3 className="text-lg font-[500] tracking-wider uppercase font-cardo text-[1rem]">
                Filters
              </h3>
              <button onClick={onClose}>
                <VscClose className="text-2xl cursor-pointer text-[#4f4f4f]" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-grow scrollbar-thin overflow-y-auto  px-3.5 min-h-0">
              {/* price range */}
              <div className="collapse collapse-arrow bg-base-100 border-base-300 w-full border">
                <input type="checkbox" defaultChecked />
                <div className="collapse-title pt-5 uppercase font-poppins font-[400] text-[#4A4A4A] text-[.85rem] tracking-widest">
                  Price
                </div>
                <div className="collapse-content py-0 text-sm">
                  <PriceRangeSlider
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                  />
                </div>
              </div>

              {/* availability */}
              <details className="collapse collapse-arrow bg-base-100 border-base-300 w-full border">
                <summary className="collapse-title pt-5 uppercase font-poppins font-[400] text-[#4A4A4A] text-[.85rem] tracking-widest">
                  availability
                </summary>
                <div className="collapse-content text-sm">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="toggle toggle-sm"
                      id="stock-toggle"
                      checked={inStockOnly}
                      onChange={(e) => {
                        onClose()
                        setInStockOnly(e.target.checked);
                      }}
                    />
                    <label
                      htmlFor="stock-toggle"
                      className="cursor-pointer uppercase text-zinc-500 font-poppins tracking-widest text-[.75rem]"
                    >
                      Show&nbsp;in‑stock&nbsp;only
                    </label>
                  </div>
                </div>
              </details>

              {/* categories */}
              {categories.map((category, i) => (
                <details
                  key={i}
                  className="collapse collapse-arrow bg-base-100 border-base-300 w-full border"
                >
                  <summary className="collapse-title pt-5 uppercase font-poppins font-[400] text-[#4A4A4A] text-[.85rem] tracking-widest">
                    <Link onClick={onClose} to={`/product/${category?.main}`}>
                      {category?.main}
                    </Link>
                  </summary>
                  <div className="collapse-content text-sm">
                    <ul>
                      {category?.sub.map((s, j) => (
                        <li key={j} className="py-2">
                          <Link
                            onClick={onClose}
                            className="capitalize tracking-widest font-poppins font-[300] text-[.75rem]"
                            to={`/product/${category.main}/${s}`}
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}

              {/* materials */}
              {materials.map((category, i) => (
                <details
                  key={i}
                  className="collapse collapse-arrow bg-base-100 border-base-300 w-full border"
                >
                  <summary className="collapse-title pt-5 uppercase font-poppins font-[400] text-[#4A4A4A] text-[.85rem] tracking-widest">
                    <Link onClick={onClose} to={`/material/${category?.tag}`}>
                      {category?.tag}
                    </Link>
                  </summary>
                  <div className="collapse-content text-sm">
                    <ul>
                      {category?.sub.map((s, j) => (
                        <li key={j} className="py-2">
                          <Link
                            onClick={onClose}
                            className="capitalize tracking-widest font-poppins font-[300] text-[.75rem]"
                            to={`/material/${category.tag}/${s}`}
                          >
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </div>

            {/* Footer – Clear All */}
            <div className="px-3.5 py-4 border-t border-base-300">
              <button
                className="btn btn-sm btn-neutral btn-outline w-full rounded-none"
                onClick={() => {
                  setPriceRange([0, 2000000]);
                  setInStockOnly(false);
                }}
              >
                Clear&nbsp;All
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
