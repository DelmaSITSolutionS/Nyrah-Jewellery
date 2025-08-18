import React, { useEffect } from "react";
import CustomizationSelect from "./CustomizationSelect";
import CustomizationPillSelect from "./CustomizationPillSelect"

function BraceletDetail({ detailData, selectedCustomizations, onChange }) {
  const {
    sizeOptions = [],
    metalPurity = [],
    gemstoneOption = [],
    finish = [],
    customization = {},
  } = detailData || {};

  useEffect(() => {
      onChange((prev) => ({
        ...prev,
        metalPurity: metalPurity[0],
        gemstoneOption: gemstoneOption[0],
        finish: finish[0],
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
        {customization?.sizeCustomizable&&<CustomizationPillSelect
          label="Bracelet Size"
          options={sizeOptions}
          name="sizeOptions"
          value={selectedCustomizations?.sizeOptions?.value}
          onChange={handleSelectChange}
          size={true}
        />}

        {customization?.gemstoneCustomizable&&<CustomizationPillSelect
          label="gemStone"
          options={gemstoneOption}
          name="gemstoneOption"
          value={selectedCustomizations?.gemstoneOption?.value}
          onChange={handleSelectChange}
          price={true}
        />}

        <CustomizationPillSelect
          label="finish"
          options={finish}
          name="finish"
          value={selectedCustomizations?.finish?.value}
          onChange={handleSelectChange}
          price={true}
        />

      </div>
     

       {customization.nameEngravingAvailable && (
        <div className=" p-3 bg-[#fff2f2] ">
          <label htmlFor="engraving" className="block font-semibold uppercase text-[.8rem] text-[#D98324]">
            Engraving Text
          </label>
          <input
            type="text"
            id="engraving"
            placeholder="Enter engraving (optional)"
            value={selectedCustomizations?.engraving?.value || ""}
            onChange={(e) => handleSelectChange("engraving", e.target.value, 0)}
            className=" px-2 py-2 w-full mt-2 bg-white outline-none"
            style={{border:"none"}}
          />
        </div>
      )}

     
    </div>
  );
}

export default BraceletDetail;
