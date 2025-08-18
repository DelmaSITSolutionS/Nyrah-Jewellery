// components/SortDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FaSortAmountDown } from "react-icons/fa";
import { IoChevronDownSharp } from "react-icons/io5";

const options = [
  { label: "Newest", value: "created-descending" },
  { label: "Oldest", value: "created-ascending" },
  { label: "Price: Low to High", value: "price-ascending" },
  { label: "Price: High to Low", value: "price-descending" },
  { label: "Name: A to Z", value: "title-ascending" },
  { label: "Name: Z to A", value: "title-descending" },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, pointerEvents: "none" },
  visible: { opacity: 1, y: 0, pointerEvents: "auto" },
};

export default function SortDropdown({ sortBy, setSortBy }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggle = () => setOpen((prev) => !prev);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={toggle}
        className="flex cursor-pointer items-center gap-2 px-4 py-2 font-poppins tracking-wider text-[.8rem] font-[400] text-[#4A4A4A] uppercase bg-white"
      >
        <span>Sort By</span>
        <IoChevronDownSharp className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className="absolute z-50 right-0 mt-2 w-52 bg-white border border-gray-200 shadow-md overflow-hidden text-sm"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            transition={{ duration: 0.15 }}
          >
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`px-4 py-2 hover:bg-[#C19A6B] hover:text-white font-[400] tracking-wider uppercase font-cardo text-[.7rem] cursor-pointer transition-all ${
                  sortBy === opt.value ? "bg-[#C19A6B] text-white font-medium" : "text-zinc-600"
                }`}
                onClick={() => {
                  setSortBy(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
