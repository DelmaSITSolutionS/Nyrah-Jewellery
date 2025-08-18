import React, { useEffect } from "react";
import CustomizationSelect from "./CustomizationSelect";
import CustomizationPillSelect from "./CustomizationPillSelect"

function NecklaceDetail({ detailData, selectedCustomizations, onChange }) {
  const {
    sizes = [],
    chainLengths = [],
    metalPurity = [],
    stoneType = [],
    finish = [],
  } = detailData || {};

  useEffect(() => {
    onChange((prev) => ({
      ...prev,
      metalPurity: metalPurity[0],
      finish: finish[0],
      stoneType: stoneType[0],
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
          label="Necklace Size"
          options={sizes}
          name="nacklaceSize"
          value={selectedCustomizations?.nacklaceSize?.value}
          onChange={handleSelectChange}
          size={true}
        />

        {/* chain length */}
        <CustomizationPillSelect
          label="Chain Length"
          options={chainLengths}
          name="chainLength"
          value={selectedCustomizations?.chainLength?.value}
          onChange={handleSelectChange}
          size={true}
        />

        {/* stone type  */}
        <CustomizationPillSelect
          label="Stone Type"
          options={stoneType}
          name="stoneType"
          value={selectedCustomizations?.stoneType?.value}
          onChange={handleSelectChange}
          price={true}
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
      </div>
    </div>
  );
}

export default NecklaceDetail;
