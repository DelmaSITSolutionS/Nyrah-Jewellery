import React, { useEffect } from "react";
import CustomizationSelect from "./CustomizationSelect";
import CustomizationPillSelect from "./CustomizationPillSelect"

function NecklaceDetail({ detailData, selectedCustomizations, onChange }) {
  const {
    sizes = [],
    chainLengths = [],
    metalPurity = [],
    stoneType = [],
  } = detailData || {};

  useEffect(() => {
    onChange((prev) => ({
      ...prev,
      metalPurity: metalPurity[0],
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
          options={[metalPurity[0]]}
          name="metalPurity"
          value={selectedCustomizations?.metalPurity}
          onChange={handleSelectChange}
        />

        {/* Size Options */}
        <CustomizationPillSelect
          label="Necklace Size"
          options={sizes}
          name="sizes"
          value={selectedCustomizations?.sizes?.value}
          onChange={handleSelectChange}
          size={true}
        />

        <CustomizationPillSelect
          label="Chain length"
          options={chainLengths}
          name="chainLengths"
          value={selectedCustomizations?.chainLengths?.value}
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
      </div>
    </div>
  );
}

export default NecklaceDetail;
