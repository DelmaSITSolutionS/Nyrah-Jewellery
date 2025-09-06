// CustomizationPillSelect.jsx

import React from "react";

const CustomizationPillSelect = ({
  label,
  options = [],
  name,
  value, // This `value` prop is now correctly reading e.g., `selectedCustomizations.metalPurity.value`
  onChange,
  price = false,
  size = false,
}) => {
  if (!options || !options.length) return null;

  return (
    <div>
      <label className="block font-bold tracking-wider text-[#4A4A4A] uppercase text-[.8rem] mb-2">
        {label}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => {
          // This logic now handles both simple strings and objects consistently
          const optValue = typeof opt === "object" && opt !== null ? opt.value : opt;
          const optPrice = typeof opt === "object" && opt !== null ? opt.price : 0;
          
          // *** THE KEY FIX ***
          // The `value` prop from the parent is just the string/number value, so this comparison now works correctly.
          const isSelected = value === optValue;

          return (
            <button
              key={i}
              type="button"
              className={`border cursor-pointer flex items-center justify-center select-none transition-all duration-400 ease-in-out
                ${size ? "w-12 h-12 rounded-full font-poppins font-[400] text-[.65rem]" : "px-3 py-2 rounded-none"}
                ${isSelected ? "border-black bg-black text-white" : "border-gray-300 hover:border-gray-600"}
              `}
              onClick={() => {
                // The onChange call remains the same, as it was already correct
                onChange(name, optValue, optPrice);
              }}
              title={optValue + (price && optPrice > 0 ? ` (+₹${optPrice})` : "")}
            >
              {size ? <span>{optValue}</span> : <>{optValue}</>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizationPillSelect;