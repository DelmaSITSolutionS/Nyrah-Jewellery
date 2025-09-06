import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomizationsByGroup } from "../../../redux/apis/customizationApi";
import CustomizationPillSelect from "./CustomizationPillSelect";
import { getAllOptions } from "../../../redux/apis/optionApi";
import CustomLoader from "./CustomLoader"; // Assuming you have a loader

function CustomBracelet({
  productGroup,
  selectedCustomizations,
  onChange,
}) {
  const dispatch = useDispatch();

  const { customizationByProductGroup } = useSelector(
    (state) => state.customization
  );
  const featureSlice = useSelector((s) => s.options);
  const { list: braceletSizes = [] } = featureSlice["braceletSize"] || {};

  const { metalPurity = [], stoneType = [] } = customizationByProductGroup || {};
  
  // Ensure sizeOptions has the consistent { value, price } structure
  const sizeOptions = braceletSizes.map((s) => ({
    value: s.braceletSize,
    price: s.price || 0,
  }));

  // Effect 1: FETCH data when the component mounts or productGroup changes
  useEffect(() => {
    if (productGroup) {
      dispatch(getCustomizationsByGroup(productGroup));
      dispatch(getAllOptions["braceletSize"]());
    }
  }, [dispatch, productGroup]);

  // Effect 2: REACT to the data when it arrives to set the default state
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
  }, [metalPurity, stoneType, sizeOptions, selectedCustomizations, onChange]);

  const handleSelectChange = (key, value, price = 0) => {
    onChange({ [key]: { value, price } });
  };

  // DERIVE the loading state from the data itself
  const isLoading = metalPurity.length === 0 || stoneType.length === 0 || braceletSizes.length === 0;

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
          label="Bracelet Size"
          options={sizeOptions}
          name="sizeOptions"
          value={selectedCustomizations?.sizeOptions?.value}
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

export default CustomBracelet;