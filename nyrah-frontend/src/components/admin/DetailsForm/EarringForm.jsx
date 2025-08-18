import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import isEqual from "lodash.isequal";
import { getAllOptions } from "../../../redux/apis/optionApi";
import SuggestedValuePriceFieldArray from "../SuggestedValuePriceFieldArray";
import MultiSelectDropdown from "../MultiSelectDropdown";

function EarringForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();

  const { control, watch, setValue, register, getValues, reset } = useForm({
    defaultValues: {
      metalPurity: [],
      metalTone: "",
      stoneType: [],
      stoneCarat: [],
      earringSize: [],
      weight: "",
      backType: [],
      customization: {
        toneCustomizable: false,
        stoneCustomizable: false,
        engravingAvailable: false,
        lengthCustomizable: false,
      },
      finish: [],
      hypoallergenic: false,
      certification: {
        isCertified: false,
        certType: "",
      },
      occasion: [],
      careInstructions:
        "Wipe with soft cloth, avoid water/perfume, store in dry pouch",
      shippingNote: "Free shipping in India. Worldwide delivery.",
      deliveryTime: "5–7 days (regular), 15–20 days (custom orders)",
      packaging: "Luxury gift box",
    },
  });

  const featureSlice = useSelector((s) => s.options);
  const { list: metalPurities = [] } = featureSlice["metalPurity"] || {};
  const { list: metalTones = [] } = featureSlice["metalTone"] || {};
  const { list: stoneTypes = [] } = featureSlice["stoneType"] || {};
  const { list: stoneCarats = [] } = featureSlice["stoneCarat"] || {};
  const { list: earringSizes = [] } = featureSlice["earringSize"] || {};
  const { list: backTypes = [] } = featureSlice["backType"] || {};
  const { list: finishTypes = [] } = featureSlice["finish"] || {};
  const { list: occasions = [] } = featureSlice["occasion"] || {};

  useEffect(() => {
    dispatch(getAllOptions["metalPurity"]());
    dispatch(getAllOptions["metalTone"]());
    dispatch(getAllOptions["stoneType"]());
    dispatch(getAllOptions["stoneCarat"]());
    dispatch(getAllOptions["earringSize"]());
    dispatch(getAllOptions["backType"]());
    dispatch(getAllOptions["finish"]());
    dispatch(getAllOptions["occasion"]());
  }, [dispatch]);

  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      const merged = {
        ...getValues(),
        ...initial,
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
      const cleanArr = (arr) =>
        Array.isArray(arr) ? arr.filter((v) => v.value?.trim()) : [];

      const cleaned = {
        ...value,
        metalPurity: cleanArr(value.metalPurity),
        stoneType: cleanArr(value.stoneType),
        stoneCarat: cleanArr(value.stoneCarat),
        earringSize: cleanArr(value.earringSize),
        backType: cleanArr(value.backType),
        finish: cleanArr(value.finish),
      };

      onChange?.(cleaned);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  const metalToneOptions = metalTones.map((p) => p.name);

  return (
    <div className="mt-6 space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Earring Details</h3>

      {/* Metal Tone */}
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

      {/* Metal Purity */}
      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="metalPurity"
        label="Metal Purity"
        optionList={metalPurities}
      />

      {/* Dynamic Fields */}
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
        name="stoneCarat"
        label="Stone Carat"
        optionList={stoneCarats}
      />
      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="earringSize"
        label="Earring Size"
        optionList={earringSizes}
      />
      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="backType"
        label="Back Type"
        optionList={backTypes}
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

      {/* Customization */}
      {[
        "toneCustomizable",
        "stoneCustomizable",
        "engravingAvailable",
        "lengthCustomizable",
      ].map((key) => (
        <label key={key} className="cursor-pointer label">
          <span className="label-text pe-2">
            {key.replace(/([A-Z])/g, " $1")}
          </span>
          <input
            type="checkbox"
            {...register(`customization.${key}`)}
            className="checkbox checkbox-primary"
          />
        </label>
      ))}

      {/* Hypoallergenic */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Hypoallergenic</span>
        <input
          type="checkbox"
          {...register("hypoallergenic")}
          className="checkbox checkbox-primary"
        />
      </label>

      {/* Certification */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Certified</span>
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

      {/* Occasion */}
      <Controller
        control={control}
        name="occasion"
        render={({ field }) => (
          <MultiSelectDropdown
            label="Occasion"
            options={occasions.map((o) => o.occasion)}
            selected={Array.isArray(field.value) ? field.value : []}
            onChange={field.onChange}
          />
        )}
      />

      {/* Other fields */}
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

      <div>
        <label htmlFor="packaging" className="label">
          Packaging
        </label>
        <input
          id="packaging"
          {...register("packaging")}
          className="input input-bordered w-full"
        />
      </div>
    </div>
  );
}

export default React.memo(EarringForm, (prev, next) => {
  return isEqual(prev.initial, next.initial) && prev.onChange === next.onChange;
});
