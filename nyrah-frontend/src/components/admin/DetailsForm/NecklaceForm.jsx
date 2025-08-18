import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllOptions } from "../../../redux/apis/optionApi";
import SuggestedValuePriceFieldArray from "../SuggestedValuePriceFieldArray";
import isEqual from "lodash.isequal";
import MultiSelectDropdown from "../MultiSelectDropdown";

function NecklaceForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();
  const { control, watch, setValue, register, getValues, reset } = useForm({
    defaultValues: {
      sizes: [],
      chainLengths: [],
      metalPurity: [],
      metalTone: "",
      stoneType: [],
      certification: {
        isCertified: false,
        certType: "",
      },
      weight: "",
      finish: [],
      shippingNote: "Free shipping in India. International delivery available",
      deliveryTime: "5–7 days (regular), 15–20 days (custom orders)",
    },
  });

  const featureSlice = useSelector((s) => s.options);
  const { list: metalPurities = [] } = featureSlice["metalPurity"] || {};
  const { list: metalTones = [] } = featureSlice["metalTone"] || {};
  const { list: necklaceSizes = [] } = featureSlice["necklaceSize"] || {};
  const { list: chainLengths = [] } = featureSlice["chainLength"] || {};
  const { list: stoneTypes = [] } = featureSlice["stoneType"] || {};
  const { list: finishTypes = [] } = featureSlice["finish"] || {};

  useEffect(() => {
    dispatch(getAllOptions["metalPurity"]());
    dispatch(getAllOptions["metalTone"]());
    dispatch(getAllOptions["necklaceSize"]?.());
    dispatch(getAllOptions["chainLength"]?.());
    dispatch(getAllOptions["stoneType"]?.());
    dispatch(getAllOptions["finish"]());
  }, [dispatch]);

  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      const merged = {
        ...getValues(),
        ...initial,
        certification: {
          ...getValues().certification,
          ...initial.certification,
        },
      };
      reset(merged);
    }
  }, [initial]);

  useEffect(() => {
    if (
      metalTones.length &&
      (!initial?.metalTone ||
        !metalTones.some((t) => t.name === initial.metalTone))
    ) {
      setValue("metalTone", metalTones[0].name);
    }
  }, [metalTones, initial]);

  useEffect(() => {
    const subscription = watch((value) => {
      const cleanArr = (arr) =>
        Array.isArray(arr) ? arr.filter((v) => v.value?.trim()) : [];

      const cleaned = {
        ...value,
        metalPurity: cleanArr(value.metalPurity),
        sizes: cleanArr(value.sizes),
        chainLengths: cleanArr(value.chainLengths),
        stoneType: cleanArr(value.stoneType),
        finish: cleanArr(value.finish),
      };

      onChange?.(cleaned);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

 
  const metalToneOptions = metalTones.map((t) => t.name);

  return (
    <div className="mt-6 space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Necklace Details</h3>

      {/* Dropdowns */}
      <div>
        <label htmlFor="metalTone" className="label">
          Metal Tone
        </label>
        <select
          id="metalTone"
          {...register("metalTone")}
          className="select select-bordered w-full"
        >
          {metalToneOptions.map((tone, i) => (
            <option className="capitalize" key={i} value={tone}>
              {tone}
            </option>
          ))}
        </select>
      </div>

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="metalPurity"
        label="Metal Purity"
        optionList={metalPurities}
      />

      {/* Suggested Field Arrays */}
      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="sizes"
        label="Necklace Sizes"
        optionList={necklaceSizes}
      />

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="chainLengths"
        label="Chain Lengths"
        optionList={chainLengths}
      />

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="stoneType"
        label="Stone Type"
        optionList={stoneTypes}
      />

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="finish"
        label="Finish"
        optionList={finishTypes}
      />

      {/* Weight */}
      <div>
        <label htmlFor="weight" className="label">
          Weight
        </label>
        <input
          id="weight"
          className="input input-bordered w-full"
          {...register("weight")}
        />
      </div>

      {/* Certification */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Certified :</span>
        <input
          type="checkbox"
          {...register("certification.isCertified")}
          className="checkbox checkbox-primary"
        />
      </label>

      <div>
        <label htmlFor="certType" className="label">
          Certification Type
        </label>
        <select
          id="certType"
          {...register("certification.certType")}
          className="select select-bordered w-full"
        >
          <option value="">None</option>
          <option value="IGI">IGI</option>
          <option value="GIA">GIA</option>
          <option value="Hallmarked Silver">Hallmarked Silver</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="shippingNote" className="label">
          Shipping Note
        </label>
        <textarea
          id="shippingNote"
          {...register("shippingNote")}
          className="textarea textarea-bordered w-full"
        />
      </div>

      <div>
        <label htmlFor="deliveryTime" className="label">
          Delivery Time
        </label>
        <input
          id="deliveryTime"
          {...register("deliveryTime")}
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
}

export default React.memo(NecklaceForm, (prev, next) => {
  return isEqual(prev.initial, next.initial) && prev.onChange === next.onChange;
});
