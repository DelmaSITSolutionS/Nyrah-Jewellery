import React from "react";
import CustomizationPillSelect from "./CustomizationPillSelect";

function BraceletDetail({ detailData, selectedCustomizations, onChange }) {
  const {
    sizeOptions = [],
    metalPurity = [],
    stoneType = [],
    customization = {},
  } = detailData || {};

  // REMOVED: The problematic useEffect that was setting default state.
  // The parent component (ProductDetail) now handles this.

  const handleSelectChange = (key, value, price = 0) => {
    // Pass a single object with the update to the parent's unified handler
    onChange({ [key]: { value, price } });
  };

  const handleSimpleSelectChange = (key, value) => {
    onChange({ [key]: { value, price: 0 } });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {/* Metal Purity */}
        <CustomizationPillSelect
          label="Metal Purity"
          options={metalPurity.length ? [metalPurity[0]] : []}
          name="metalPurity"
          // CORRECTED: Read the .value from the state object
          value={selectedCustomizations?.metalPurity?.value}
          onChange={handleSimpleSelectChange}
        />

        {/* Size Options */}
        <CustomizationPillSelect
          label="Bracelet Size"
          options={sizeOptions}
          name="sizeOptions"
          value={selectedCustomizations?.sizeOptions?.value}
          onChange={handleSelectChange}
          size={true}
          price={true} // Assuming size can have a price
        />

        {/* stone type */}
        <CustomizationPillSelect
          label="Stone Type"
          options={stoneType.length ? [stoneType[0]] : []}
          name="stoneType"
          // CORRECTED: Read the .value from the state object
          value={selectedCustomizations?.stoneType?.value}
          onChange={handleSimpleSelectChange}
        />
      </div>

      {customization.nameEngravingAvailable && (
        <div className=" p-3 bg-[#fff2f2] ">
          <label
            htmlFor="engraving"
            className="block font-semibold uppercase text-[.8rem] text-[#D98324]"
          >
            Engraving Text
          </label>
          <input
            type="text"
            id="engraving"
            placeholder="Enter engraving (optional)"
            value={selectedCustomizations?.engraving?.value || ""}
            onChange={(e) => handleSelectChange("engraving", e.target.value, 0)}
            className=" px-2 py-2 w-full mt-2 bg-white outline-none"
            style={{ border: "none" }}
          />
        </div>
      )}
    </div>
  );
}

export default BraceletDetail;