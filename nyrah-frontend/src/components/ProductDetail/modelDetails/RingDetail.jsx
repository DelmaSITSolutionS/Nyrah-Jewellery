// RingDetail.jsx

import CustomizationPillSelect from "./CustomizationPillSelect";

function RingDetail({ detailData, selectedCustomizations, onChange }) {
  const {
    sizeOptions = [],
    metalPurity = [],
    stoneType = [],
    customization = {},
  } = detailData || {};

  // REMOVED: The problematic useEffect that was setting default state.
  // The parent component (ProductDetail) now handles this.

  const handleSelectChange = (key, value, price = 0) => {
    // We now update the parent with a consistent object structure
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
          options={metalPurity.length ? [metalPurity[0]] : []} // Show only the first option for "ready"
          name="metalPurity"
          // CHANGED: Read the value from the object
          value={selectedCustomizations?.metalPurity?.value}
          onChange={handleSimpleSelectChange} // Use the simple handler (no price for this one)
        />

        {/* Size Options */}
        <CustomizationPillSelect
          label="Ring Size"
          options={sizeOptions}
          name="sizeOptions"
          value={selectedCustomizations?.sizeOptions?.value}
          onChange={handleSelectChange} // Use handler that includes price
          size={true}
          price={true} // Assuming size can have a price
        />

        {/* Stone Type */}
        <CustomizationPillSelect
          label="Stone Type"
          options={stoneType.length ? [stoneType[0]] : []}
          name="stoneType"
          value={selectedCustomizations?.stoneType?.value}
          onChange={handleSimpleSelectChange}
        />

        {/* Engraving */}
        {customization.engravingAvailable && (
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
              onChange={(e) =>
                handleSelectChange("engraving", e.target.value, 0)
              }
              className=" px-2 py-2 w-full mt-2 bg-white outline-none"
              style={{ border: "none" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RingDetail;