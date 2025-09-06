import React from "react";
import CustomizationPillSelect from "./CustomizationPillSelect";

function NecklaceDetail({ detailData, selectedCustomizations, onChange }) {
  const {
    sizes = [],
    chainLengths = [],
    metalPurity = [],
    stoneType = [],
  } = detailData || {};

  // The problematic useEffect has been removed. The parent component handles defaults.

  const handleSelectChange = (key, value, price = 0) => {
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
          value={selectedCustomizations?.metalPurity?.value}
          onChange={handleSimpleSelectChange}
        />

        {/* Size Options */}
        <CustomizationPillSelect
          label="Necklace Size"
          options={sizes}
          name="sizes"
          value={selectedCustomizations?.sizes?.value}
          onChange={handleSelectChange}
          size={true}
          price={true}
        />

        {/* Chain Length */}
        <CustomizationPillSelect
          label="Chain length"
          options={chainLengths}
          name="chainLengths"
          value={selectedCustomizations?.chainLengths?.value}
          onChange={handleSelectChange}
          size={true}
          price={true}
        />

        {/* stone type */}
        <CustomizationPillSelect
          label="Stone Type"
          options={stoneType.length ? [stoneType[0]] : []}
          name="stoneType"
          value={selectedCustomizations?.stoneType?.value}
          onChange={handleSimpleSelectChange}
        />
      </div>
    </div>
  );
}

export default NecklaceDetail;

