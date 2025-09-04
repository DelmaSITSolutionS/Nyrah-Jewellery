import { useEffect } from "react";
import CustomizationSelect from "./CustomizationSelect";
import { useDispatch, useSelector } from "react-redux";
import { getCustomizationsByGroup } from "../../../redux/apis/customizationApi";
import CustomizationPillSelect from "./CustomizationPillSelect";
import { getAllOptions } from "../../../redux/apis/optionApi";

function CustomRing({ detailData, selectedCustomizations, onChange }) {
  // const {
  //   sizeOptions = [],
  //   metalPurity = [],
  //   stoneType = []
  // } = detailData || {};

  const dispatch = useDispatch();

  const { customizationByProductGroup } = useSelector(
    (state) => state.customization
  );
  const featureSlice = useSelector((s) => s.options);
  const { list: ringSizes = [] } = featureSlice["ringSize"] || {};

  const sizeOptions = ringSizes.map((s) => s.size);

  const { metalPurity = [], stoneType = [] } =
    customizationByProductGroup || {};

  useEffect(() => {
    dispatch(getCustomizationsByGroup(detailData));
    dispatch(getAllOptions["ringSize"]());
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

export default CustomRing;
