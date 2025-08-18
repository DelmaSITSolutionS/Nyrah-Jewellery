import { useEffect } from "react";
import CustomizationSelect from "./CustomizationSelect";

function CustomRing({ detailData, selectedCustomizations, onChange }) {
  const {
    sizeOptions = [],
    metalPurity = [],
    diamondSize = [],
    finish = [],
    stoneType = [],
    centerStoneOptions = {},
    customization = {},
  } = detailData || {};

  const { carats = [], shapes = [], qualities = [] } = centerStoneOptions;

  useEffect(() => {
    onChange((prev) => ({
      ...prev,
      metalPurity: metalPurity[0],
      finish: finish[0],
      stoneType: stoneType[0],
      carats: carats[0],
      shapes: shapes[0],
      qualities: qualities[0],
    }));
  }, [detailData]);

  const handleSelectChange = (key, value, price = 0) => {
    onChange((prev) => ({
      ...prev,
      [key]: { value, price },
    }));
  };

  // console.log(metalPurity)
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4 ">
        {/* Metal Purity */}
           <CustomizationSelect
          label="Metal Purity"
          options={metalPurity}
          name="metalPurity"
          value={selectedCustomizations?.metalPurity?.value}
          onChange={handleSelectChange}
          price={true}
        />

        {/* Size Options */}
        <CustomizationSelect
          label="Ring Size"
          options={sizeOptions}
          name="sizeOptions"
          value={selectedCustomizations?.sizeOptions?.value}
          onChange={handleSelectChange}
          size={true}
        />

        {/* stone type  */}
        <CustomizationSelect
          label="Stone Type"
          options={stoneType}
          name="stoneType"
          value={selectedCustomizations?.stoneType?.value}
          onChange={handleSelectChange}
          price={true}
        />

        {/* diamond size  */}
        <CustomizationSelect
          label="Diamond Size"
          options={diamondSize}
          name="diamondSize"
          value={selectedCustomizations?.diamondSize?.value}
          onChange={handleSelectChange}
          size={true}
        />

        {/* Finish */}
        <CustomizationSelect
          label="finish"
          options={finish}
          name="finish"
          value={selectedCustomizations?.finish?.value}
          onChange={handleSelectChange}
          price={true}
        />

        {/* Center Stone - Carat */}
        {customization.stoneUpgradeAvailable && (
          <CustomizationSelect
            label="Stone Carat"
            options={carats}
            name="carats"
            value={selectedCustomizations?.carats?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )}

        {/* Center Stone - Shape */}
        {customization.stoneUpgradeAvailable && (
          <CustomizationSelect
            label="Stone Shape"
            options={shapes}
            name="shapes"
            value={selectedCustomizations?.shapes?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )}

        {/* Center Stone - Quality */}
        {customization.stoneUpgradeAvailable && (
          <CustomizationSelect
            label="Stone Quality"
            options={qualities}
            name="qualities"
            value={selectedCustomizations?.qualities?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )}
      </div>

      {customization.engravingAvailable && (
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

export default CustomRing;
