import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCustomizationsByGroup } from "../../../redux/apis/customizationApi";
import { getAllOptions } from "../../../redux/apis/optionApi";
import CustomizationPillSelect from "./CustomizationPillSelect";
import CustomLoader from "./CustomLoader";

function CustomNecklace({ productGroup, selectedCustomizations, onChange }) {
  const dispatch = useDispatch();

  const { customizationByProductGroup } = useSelector(
    (state) => state.customization
  );
  const featureSlice = useSelector((s) => s.options);

  // Fetching options for both necklace size and chain length
  const { list: necklaceSizes = [] } = featureSlice["necklaceSize"] || {};
  const { list: chainLengths = [] } = featureSlice["chainLength"] || {};

  const { metalPurity = [], stoneType = [] } = customizationByProductGroup || {};

  // Map options to the consistent { value, price } structure
  const sizeOptions = necklaceSizes.map((s) => ({
    value: s.necklaceSize,
    price: s.price || 0,
  }));
  const lengthOptions = chainLengths.map((l) => ({
    value: l.length,
    price: l.price || 0,
  }));

  console.log(necklaceSizes)

  // Effect 1: FETCH all necessary data
  useEffect(() => {
    if (productGroup) {
      dispatch(getCustomizationsByGroup(productGroup));
      dispatch(getAllOptions["necklaceSize"]());
      dispatch(getAllOptions["chainLength"]());
    }
  }, [dispatch, productGroup]);

  // Effect 2: REACT to data to set defaults (but not for size or length)
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

  // DERIVE the loading state from the data
  const isLoading = !customizationByProductGroup || necklaceSizes.length === 0 || chainLengths.length === 0;

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
          label="Necklace Size"
          options={sizeOptions}
          name="sizes" // Matches the name in NecklaceDetail
          value={selectedCustomizations?.sizes?.value}
          onChange={handleSelectChange}
          size={true}
          price={true}
        />

        {/* Chain Length Options */}
        <CustomizationPillSelect
          label="Chain length"
          options={lengthOptions}
          name="chainLengths" // Matches the name in NecklaceDetail
          value={selectedCustomizations?.chainLengths?.value}
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

export default CustomNecklace;

