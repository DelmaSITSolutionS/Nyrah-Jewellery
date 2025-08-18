import { useEffect } from "react";
import CustomizationSelect from "./CustomizationSelect";
import CustomizationPillSelect from "./CustomizationPillSelect"; // new component

function RingDetail({ detailData, selectedCustomizations, onChange }) {
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
      stoneType: stoneType[0],
      finish: finish,
      carats: carats,
      shapes: shapes,
      qualities: qualities,
    }));
  }, [detailData]);

  const handleSelectChange = (key, value, price = 0) => {
    onChange((prev) => ({
      ...prev,
      [key]: { value, price },
    }));
  };

  console.log(sizeOptions)
  return (
    <div className="space-y-4">
      <div className=" space-y-6">
        {/* Metal Purity */}
           <CustomizationPillSelect
          label="Metal Purity"
          options={metalPurity.length && [metalPurity[0]]}
          name="metalPurity"
          value={selectedCustomizations?.metalPurity}
          onChange={handleSelectChange}
        />

        {/* Size Options */}
        <CustomizationPillSelect
          label="Ring Size"
          options={sizeOptions}
          name="sizeOptions"
          value={selectedCustomizations?.sizeOptions?.value}
          onChange={handleSelectChange}
          size={true}
        />

        {/* stone type  */}
        <CustomizationPillSelect
          label="Stone Type"
          options={stoneType.length&&[stoneType[0]]}
          name="stoneType"
          value={selectedCustomizations?.stoneType}
          onChange={handleSelectChange}
        />

        {/* diamond size  */}
        {/* <CustomizationPillSelect
          label="Diamond Size"
          options={diamondSize.length&&diamondSize[0]}
          name="diamondSize"
          value={selectedCustomizations?.diamondSize?.value}
          onChange={handleSelectChange}
          size={true}
        /> */}

        {/* Finish */}
        {/* <CustomizationPillSelect
          label="finish"
          options={finish.length&&[finish[0]]}
          name="finish"
          value={selectedCustomizations?.finish?.value}
          onChange={handleSelectChange}
          price={true}
        /> */}

        {/* Center Stone - Carat */}
        {/* {customization.stoneUpgradeAvailable && (
          <CustomizationPillSelect
            label="Stone Carat"
            options={carats.length&&[carats[0]]}
            name="carats"
            value={selectedCustomizations?.carats?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )} */}

        {/* Center Stone - Shape */}
        {/* {customization.stoneUpgradeAvailable && (
          <CustomizationPillSelect
            label="Stone Shape"
            options={shapes.length&&[shapes[0]]}
            name="shapes"
            value={selectedCustomizations?.shapes?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )} */}

        {/* Center Stone - Quality */}
        {/* {customization.stoneUpgradeAvailable && (
          <CustomizationPillSelect
            label="Stone Quality"
            options={qualities.length&&[qualities[0]]}
            name="qualities"
            value={selectedCustomizations?.qualities?.value}
            onChange={handleSelectChange}
            price={true}
          />
        )} */}
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

export default RingDetail;
