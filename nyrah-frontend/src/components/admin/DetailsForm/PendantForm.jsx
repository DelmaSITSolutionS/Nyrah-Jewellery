import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllOptions } from "../../../redux/apis/optionApi";
import SuggestedValuePriceFieldArray from "../SuggestedValuePriceFieldArray";
import MultiSelectDropdown from "../MultiSelectDropdown";
import isEqual from "lodash.isequal";

function PendantForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();
  const { control, register, setValue, getValues, reset, watch } = useForm({
    defaultValues: {
      chainIncluded: false,
      chainLength: [],
      metalPurity: [],
      metalTone: "",
      stoneType: [],
      stoneCarat: [],
      pendantSize: [],
      weight: "",
      customization: {
        engravingAvailable: false,
        stoneCustomizable: false,
        chainCustomizable: false,
      },
      finish: [],
      hypoallergenic: false,
      certification: {
        isCertified: false,
        certType: "",
      },
      occasion: [],
      careInstructions: "Avoid water/perfume, store in pouch, use soft cloth",
      shippingNote: "Free shipping India. Worldwide shipping available.",
      deliveryTime: "5–7 days (regular), 15–20 days (custom orders)",
      packaging: "Premium gift box",
    },
  });

  const featureSlice = useSelector((s) => s.options);
  const { list: metalPurities = [] } = featureSlice["metalPurity"] || {};
  const { list: metalTones = [] } = featureSlice["metalTone"] || {};
  const { list: chainLengths = [] } = featureSlice["chainLength"] || {};
  const { list: stoneTypes = [] } = featureSlice["stoneType"] || {};
  const { list: stoneCarats = [] } = featureSlice["stoneCarat"] || {};
  const { list: pendantSizes = [] } = featureSlice["pendantSize"] || {};
  const { list: finishTypes = [] } = featureSlice["finish"] || {};
  const { list: occasions = [] } = featureSlice["occasion"] || {};

  

  useEffect(() => {
    dispatch(getAllOptions["metalPurity"]?.());
    dispatch(getAllOptions["metalTone"]?.());
    dispatch(getAllOptions["chainLength"]?.());
    dispatch(getAllOptions["stoneType"]?.());
    dispatch(getAllOptions["stoneCarat"]?.());
    dispatch(getAllOptions["pendantSize"]?.());
    dispatch(getAllOptions["finish"]?.());
    dispatch(getAllOptions["occasion"]?.());
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
        chainLength: cleanArr(value.chainLength),
        stoneType: cleanArr(value.stoneType),
        stoneCarat: cleanArr(value.stoneCarat),
        pendantSize: cleanArr(value.pendantSize),
        finish: cleanArr(value.finish),
      };

      onChange?.(cleaned);
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="mt-6 space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Pendant Details</h3>

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="metalPurity"
        label="Metal Purity"
        optionList={metalPurities}
      />

      <div>
        <label htmlFor="metal-tone" className="label">
          Metal Tone
        </label>
        <select
          id="metal-tone"
          {...register("metalTone")}
          className="select select-bordered w-full"
        >
          {metalTones.map((t) => (
            <option key={t.name}>{t.name}</option>
          ))}
        </select>
      </div>

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="chainLength"
        label="Chain Length"
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
        name="stoneCarat"
        label="Stone Carat"
        optionList={stoneCarats}
      />

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="pendantSize"
        label="Pendant Size"
        optionList={pendantSizes}
      />

      <SuggestedValuePriceFieldArray
        control={control}
        register={register}
        name="finish"
        label="Finish"
        optionList={finishTypes}
      />

      <div>
        <label htmlFor="weight" className="label">
          Weight
        </label>
        <input
          id="weight"
          type="text"
          {...register("weight")}
          className="input input-bordered w-full"
        />
      </div>

      <label className="label">Customization</label>
      <div className="flex flex-col gap-4 flex-wrap">
        <label htmlFor="engraving" className="cursor-pointer label">
          <span className="label-text pe-2">Engraving</span>
          <input
            id="engraving"
            type="checkbox"
            {...register("customization.engravingAvailable")}
            className="checkbox checkbox-primary"
          />
        </label>
        <label htmlFor="stone-customizable" className="cursor-pointer label">
          <span className="label-text pe-2">Stone Customizable</span>
          <input
            id="stone-customizable"
            type="checkbox"
            {...register("customization.stoneCustomizable")}
            className="checkbox checkbox-primary"
          />
        </label>
        <label htmlFor="chian-customizable" className="cursor-pointer label">
          <span className="label-text pe-2">Chain Customizable</span>
          <input
            id="chian-customizable"
            type="checkbox"
            {...register("customization.chainCustomizable")}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>

      <label htmlFor="hypoallergenic" className="cursor-pointer label">
        <span className="label-text pe-2">Hypoallergenic</span>
        <input
          id="hypoallergenic"
          type="checkbox"
          {...register("hypoallergenic")}
          className="checkbox checkbox-primary"
        />
      </label>

      <label htmlFor="certified" className="cursor-pointer label">
        <span className="label-text pe-2">Certified</span>
        <input
          id="certified"
          type="checkbox"
          {...register("certification.isCertified")}
          className="checkbox checkbox-primary"
        />
      </label>

      <div>
        <label htmlFor="certification" className="label">
          Certification Type
        </label>
        <select
          id="certification"
          {...register("certification.certType")}
          className="select select-bordered w-full"
        >
          <option value="">None</option>
          <option value="IGI">IGI</option>
          <option value="GIA">GIA</option>
          <option value="Hallmarked Silver">Hallmarked Silver</option>
        </select>
      </div>

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

      <div>
        <label htmlFor="careIntructions" className="label">
          Care Instructions
        </label>
        <textarea
          id="careIntructions"
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

export default React.memo(PendantForm, (prev, next) => {
  return isEqual(prev.initial, next.initial) && prev.onChange === next.onChange;
});
