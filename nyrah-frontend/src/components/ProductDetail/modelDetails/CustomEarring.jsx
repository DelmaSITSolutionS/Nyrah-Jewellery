import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomizationsByGroup } from "../../../redux/apis/customizationApi";
import { getAllOptions } from "../../../redux/apis/optionApi";
import CustomizationPillSelect from "./CustomizationPillSelect";
import CustomLoader from "./CustomLoader"; // Assuming you have a loader component

function CustomEarring({ productGroup, selectedCustomizations, onChange }) {
  const dispatch = useDispatch();

  const { customizationByProductGroup } = useSelector(
    (state) => state.customization
  );
  const featureSlice = useSelector((s) => s.options);
  const { list: earringSizes = [] } = featureSlice["earringSize"] || {};

  const { metalPurity = [], stoneType = [] } = customizationByProductGroup || {};

  // Ensure sizeOptions has the consistent { value, price } structure
  const sizeOptions = earringSizes.map((s) => ({
    value: s.earringsize, // Assuming the size property is named 'earringSize'
    price: s.price || 0,
  }));
  // Effect 1: FETCH data when the component mounts or productGroup changes
  useEffect(() => {
    if (productGroup) {
      dispatch(getCustomizationsByGroup(productGroup));
      dispatch(getAllOptions["earringSize"]());
    }
  }, [dispatch, productGroup]);

  

  // Effect 2: REACT to the data to set defaults (but not for size)
  useEffect(() => {
    const updates = {};
    if (metalPurity.length > 0 && !selectedCustomizations?.metalPurity) {
      updates.metalPurity = metalPurity[0];
    }
    if (stoneType.length > 0 && !selectedCustomizations?.stoneType) {
      updates.stoneType = stoneType[0];
    }

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  }, [metalPurity, stoneType, selectedCustomizations, onChange]);

  const handleSelectChange = (key, value, price = 0) => {
    onChange({ [key]: { value, price } });
  };

  // DERIVE the loading state from the data itself
  const isLoading = !customizationByProductGroup || earringSizes.length === 0;

  if (isLoading) {
    return <CustomLoader />;
  }

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
          options={sizeOptions}
          name="earringSize"
          value={selectedCustomizations?.earringSize?.value}
          onChange={handleSelectChange}
          size={true}
          price={true}
        />

        {/* stone type */}
        <CustomizationPillSelect
          label="Stone Type"
          options={stoneType}
          name="stoneType"
          value={selectedCustomizations?.stoneType?.value}
          onChange={handleSelectChange}
          price={true}
        />
      </div>
    </div>
  );
}

export default CustomEarring;

