import React from "react";

const CustomizationSelect = ({
  label,
  options = [],
  name,
  value,
  onChange,
  size = false,
  price = false,
}) => {
  if (!options.length) return null;

  return (
    <div>
      <label
        htmlFor={name}
        className="block font-bold tracking-wider text-[#4A4A4A] uppercase text-[.8rem]"
      >
        {label}
      </label>

      <div className="relative w-full mt-2">
        <select
          id={name}
          value={value || ""}
          onChange={(e) => {
            const selectedValue = e.target.value;

            let priceValue = 0;
            let finalValue = selectedValue;

            if (price) {
              const found = options.find((opt) =>
                typeof opt === "object" ? opt.value === selectedValue : opt === selectedValue
              );
              priceValue = found?.price || 0;
              finalValue = found?.value || selectedValue;
            }

            onChange(name, finalValue, priceValue);
          }}
          className="appearance-none border   border-[#a2a2a2] px-2 py-3 w-full text-[.9rem] capitalize tracking-wider pr-10"
        >
          {size && <option disabled value="">Select {label}</option>}

          {options.map((opt) => {
            const optValue = typeof opt === "object" ? opt.value : opt;
            const optPrice = typeof opt === "object" ? opt.price : 0;
            return (
              <option key={optValue} className="font-semibold" value={optValue}>
                {optValue} {optPrice > 0 ? `(+₹${optPrice})` : ""}
              </option>
            );
          })}
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.516 7.548L10 12.032l4.484-4.484L16 8.548l-6 6-6-6z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomizationSelect;
