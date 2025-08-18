import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllOptions } from "../../../redux/apis/optionApi";
import MultiSelectDropdown from "../MultiSelectDropdown";
import isEqual from "lodash.isequal";
import SuggestedValuePriceFieldArray from "../SuggestedValuePriceFieldArray";

function BraceletForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();
  // console.log(initial)
  const { control, watch, setValue, register, reset, getValues } = useForm({
    defaultValues: {
      sizeOptions: [],
      metalPurity: [],
      metalTone: "",
      gemstoneOption: [],
      finish: [],
      customization: {
        nameEngravingAvailable: false,
        sizeCustomizable: false,
        metalCustomizable: false,
        gemstoneCustomizable: false,
      },
      certification: {
        isCertified: false,
        certType: "",
      },
      weight: "",
      careInstructions: "Avoid harsh chemicals, store in dry pouch",
      shippingNote: "Free shipping in India. Worldwide delivery",
      deliveryTime: "5–7 days (regular), 15–20 days (custom orders)",
    },
  });

  const featureSlice = useSelector((s) => s.options);
  const { list: metalPurities = [] } = featureSlice["metalPurity"] || {};
  const { list: metalTones = [] } = featureSlice["metalTone"] || {};
  const { list: braceletSizes = [] } = featureSlice["braceletSize"] || {};
  const { list: gemstoneOptions = [] } = featureSlice["stoneShape"] || {};
  const { list: finishOptions = [] } = featureSlice["finish"] || {};

  
  const braceletSizeOptions = braceletSizes.map((s) => s.braceletSize);

  useEffect(() => {
    dispatch(getAllOptions["braceletSize"]?.());
    dispatch(getAllOptions["metalPurity"]?.());
    dispatch(getAllOptions["metalTone"]?.());
    dispatch(getAllOptions["stoneShape"]?.());
    dispatch(getAllOptions["finish"]?.());
  }, [dispatch]);

  console.log(initial)

  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      const merged = {
        ...getValues(),
        ...initial,
        gemstoneOption: initial.gemstoneOption || [],
        finish: initial.finish || [],
        customization: {
          ...getValues().customization,
          ...initial.customization,
        },
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
      const cleanStones = (arr) =>
        Array.isArray(arr) ? arr.filter((v) => v.value?.trim()) : [];

      const cleaned = {
        ...value,
        metalPurity: cleanStones(value.metalPurity),
        gemstoneOption: cleanStones(value.gemstoneOption),
        finish: cleanStones(value.finish),
      };

      onChange?.(cleaned);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="mt-6 space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Bracelet Details</h3>

      <Controller
        control={control}
        name="sizeOptions"
        render={({ field }) => (
          <MultiSelectDropdown
            label="Size Options"
            options={braceletSizeOptions}
            selected={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div>
        <label htmlFor="metalTone" className="label pb-3">
          Metal Tone :
        </label>
        <select
          id="metalTone"
          {...register("metalTone")}
          className="input input-bordered w-full select"
        >
          {metalTones.map((t, i) => (
            <option className="capitalize" key={i} value={t.name}>
              {t.name}
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

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="gemstoneOption"
        label="Gemstone Options"
        optionList={gemstoneOptions}
      />

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="finish"
        label="Finish Options"
        optionList={finishOptions}
      />

      {/* Customization Checkboxes */}
      {[
        "nameEngravingAvailable",
        "sizeCustomizable",
        "metalCustomizable",
        "gemstoneCustomizable",
      ].map((key) => (
        <label key={key} className="cursor-pointer label">
          <p className="label-text inline pe-2">
            {key.replace(/([A-Z])/g, " $1")}:
          </p>
          <input
            type="checkbox"
            {...register(`customization.${key}`)}
            className="checkbox checkbox-primary"
          />
        </label>
      ))}

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

      <div>
        <label htmlFor="weight" className="label">
          Weight
        </label>
        <input
          id="weight"
          {...register("weight")}
          className="input input-bordered w-full"
          placeholder="e.g. 12.5g approx."
        />
      </div>

      <div>
        <label htmlFor="careInstructions" className="label">
          Care Instructions
        </label>
        <textarea
          id="careInstructions"
          {...register("careInstructions")}
          className="textarea textarea-bordered w-full"
        />
      </div>

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

export default React.memo(
  BraceletForm,
  (prev, next) =>
    isEqual(prev.initial, next.initial) && prev.onChange === next.onChange
);
