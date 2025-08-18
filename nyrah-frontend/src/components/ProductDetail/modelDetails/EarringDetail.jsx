import React, { useEffect } from "react";
import CustomizationPillSelect from "./CustomizationPillSelect"

function EarringDetail({ detailData, selectedCustomizations, onChange }) {
  const {
    metalPurity = [],
    stoneType = [],
    stoneCarat = [],
    earringSize = [],
    backType = [],
    finish = [],
    customization = {},
    occasion = [],
  } = detailData || {};

  useEffect(() => {
        onChange((prev) => ({
          ...prev,
          metalPurity: metalPurity[0],
          finish: finish[0],
          stoneType: stoneType[0],
          stoneCarat: stoneCarat[0],
          occasion: occasion[0],
          backType: backType[0]
        }));
      }, []);

  const handleSelectChange = (key, value, price = 0) => {
    onChange((prev) => ({
      ...prev,
      [key]: { value, price },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-6">
        {/* Metal Purity */}
        <CustomizationPillSelect
          label="Metal Purity"
          options={metalPurity}
          name="metalPurity"
          value={selectedCustomizations?.metalPurity?.value}
          onChange={handleSelectChange}
          price={true}
        />

        {/* Size Options */}
        <CustomizationPillSelect
          label="Earring Size"
          options={earringSize}
          name="earringSize"
          value={selectedCustomizations?.earringSize?.value}
          onChange={handleSelectChange}
          size={true}
        />

        {/* stone type  */}
        {customization.stoneCustomizable && (
          <CustomizationPillSelect
            label="Stone Type"
            options={stoneType}
            name="stoneType"
            value={selectedCustomizations?.stoneType?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )}

        {/* Center Stone - Carat */}
        {customization.stoneCustomizable && (
          <CustomizationPillSelect
            label="Stone Carat"
            options={stoneCarat}
            name="stoneCarat"
            value={selectedCustomizations?.stoneCarat?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )}

        {/* Finish */}
        <CustomizationPillSelect
          label="finish"
          options={finish}
          name="finish"
          value={selectedCustomizations?.finish?.value}
          onChange={handleSelectChange}
          price={true}
        />

        {/* BackType */}
        <CustomizationPillSelect
          label="BackType"
          options={backType}
          name="backType"
          value={selectedCustomizations?.backType?.value}
          onChange={handleSelectChange}
          price={true}
        />

        {/* Occasion */}
        <CustomizationPillSelect
          label="Occasion"
          options={occasion}
          name="occasion"
          value={selectedCustomizations?.occasion?.value}
          onChange={handleSelectChange}
        />
      </div>

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
            onChange={(e) => handleSelectChange("engraving", e.target.value, 0)}
            className=" px-2 py-2 w-full mt-2 bg-white outline-none"
            style={{ border: "none" }}
          />
        </div>
      )}
    </div>
  );
}

export default EarringDetail;
