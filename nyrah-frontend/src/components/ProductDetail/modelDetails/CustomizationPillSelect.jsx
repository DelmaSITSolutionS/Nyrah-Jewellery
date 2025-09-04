import React from "react";

const CustomizationPillSelect = ({
  label,
  options = [],
  name,
  value,
  onChange,
  price = false,
  size = false,
}) => {
  if (!options.length) return null;
  
  return (
    <div>
      <label className="block font-bold tracking-wider text-[#4A4A4A] uppercase text-[.8rem] mb-2">
        {label}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((opt, i) => {
          const optValue = typeof opt === "object" ? opt.value : opt;
          const optPrice = typeof opt === "object" ? opt.price : 0;
          const isSelected = value === optValue;

          return (
            <button
              key={i}
              type="button"
              className={`border cursor-pointer  flex items-center justify-center select-none transition-all duration-400 ease-in-out
                ${size ? "w-12 h-12 rounded-full font-poppins font-[400] text-[.65rem]" : "px-3 py-2 rounded-none"}
                ${isSelected ? "border-black  bg-black text-white" : "border-gray-300  hover:border-gray-600"}
              `}
              onClick={() => {
                if (price) {
                  onChange(name, optValue, optPrice);
                } else {
                  onChange(name, optValue, 0);
                }
              }}
              title={optValue + (price && optPrice > 0 ? ` (+₹${optPrice})` : "")}
            >
              {size ? (
                <span>{optValue}</span>
              ) : (
                <>
                  {optValue}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomizationPillSelect;
