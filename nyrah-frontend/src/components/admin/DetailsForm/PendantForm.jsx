import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllOptions } from "../../../redux/apis/optionApi";
import MultiSelectDropdown from "../MultiSelectDropdown";
import isEqual from "lodash.isequal";

function PendantForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();
  const { control, register, setValue, reset, watch } = useForm({
    defaultValues: useMemo(
      () => ({
        chainIncluded: false,
        chainLength: [],
        metalPurity: [],
        metalTone: [],
        stoneType: [],
        stoneCarat: "",
        pendantSize: [],
        weight: "",
        customization: {
          engravingAvailable: false,
        },
        finish: "",
        hypoallergenic: false,
        certification: {
          isCertified: false,
          certType: "",
          isHallmarked: false,
        },
        occasion: [],
        careInstructions: "Avoid water/perfume, store in pouch, use soft cloth",
        shippingNote: "Free shipping India. Worldwide shipping available.",
        deliveryTime: "5–7 days (regular), 15–20 days (custom orders)",
        packaging: "Premium gift box",
      }),
      []
    ),
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

  const metalToneOptions = metalTones.map((m) => m.name);
  const chainLengthOptions = chainLengths.map((c) => c.length);
  const metalPurityOptions = metalPurities.map((p) => p.name);
  const stoneTypeOptions = stoneTypes.map((st) => st.type);
  const stoneCaratOptions = stoneCarats.map((sc) => sc.carat);
  const pendantSizeOptions = pendantSizes.map((p) => p.pendantsize);
  const finishOptions = finishTypes.map((f) => f.finish);
  const occasionOptions = occasions.map((o) => o.occasion);

  useEffect(() => {
    dispatch(getAllOptions["metalPurity"]());
    dispatch(getAllOptions["metalTone"]());
    dispatch(getAllOptions["chainLength"]());
    dispatch(getAllOptions["stoneType"]());
    dispatch(getAllOptions["stoneCarat"]());
    dispatch(getAllOptions["pendantSize"]());
    dispatch(getAllOptions["finish"]());
    dispatch(getAllOptions["occasion"]());
  }, [dispatch]);

  // Set default values for single-select fields
  // useEffect(() => {
  //   if (metalTones.length > 0) {
  //     const initialTone = initial?.metalTone;
  //     if (initialTone && metalTones.some((t) => t.name === initialTone)) {
  //       setValue("metalTone", initialTone);
  //     } else if (metalTones.length > 0) {
  //       setValue("metalTone", metalTones[0].name);
  //     }
  //   }
  // }, [metalTones, initial, setValue]);

  useEffect(() => {
    if (stoneCarats.length > 0 && initial?.stoneCarat) {
      setValue("stoneCarat", initial.stoneCarat);
    }
  }, [stoneCarats, initial, setValue]);

  useEffect(() => {
    if (finishTypes.length > 0 && initial?.finish) {
      setValue("finish", initial.finish);
    }
  }, [finishTypes, initial, setValue]);

  // Handle form reset with initial data
  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      reset({
        ...initial,
        customization: {
          engravingAvailable:
            initial.customization?.engravingAvailable || false,
        },
        certification: {
          isCertified: initial.certification?.isCertified || false,
          certType: initial.certification?.certType || "",
          isHallmarked: initial.certification?.isHallmarked || false,
        },
      });
    }
  }, [initial, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      onChange?.(value);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  return (
    <div className="mt-6 space-y-4 border-t pt-6">
      <h3 className="text-lg font-semibold">Pendant Details</h3>

      {/* Single-select Dropdowns */}
      <Controller
        control={control}
        name="metalTone"
        render={({ field }) =>
          metalToneOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Metal Tone"
              options={metalToneOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      <Controller
        control={control}
        name="metalPurity"
        render={({ field }) =>
          metalPurityOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Metal Purity"
              options={metalPurityOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      <Controller
        control={control}
        name="stoneType"
        render={({ field }) =>
          stoneTypeOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Stone Type"
              options={stoneTypeOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      {/* Checkbox for Chain Included */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Chain Included:</span>
        <input
          type="checkbox"
          {...register("chainIncluded")}
          className="checkbox checkbox-primary"
        />
      </label>

      {/* Multi-select Dropdowns */}
      <Controller
        control={control}
        name="chainLength"
        render={({ field }) =>
          chainLengthOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Chain Length"
              options={chainLengthOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      <Controller
        control={control}
        name="pendantSize"
        render={({ field }) =>
          pendantSizeOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Pendant Size"
              options={pendantSizeOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      {stoneCaratOptions.length > 0 ? (
        <div>
          <label htmlFor="stoneCarat" className="label pb-3">
            Stone Carat :
          </label>
          <select
            id="stoneCarat"
            {...register("stoneCarat")}
            className="input input-bordered w-full select"
          >
            <option value="">Select a carat</option>
            {stoneCaratOptions.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="skeleton h-12 w-full"></div>
      )}

      {finishOptions.length > 0 ? (
        <div>
          <label htmlFor="finish" className="label pb-3">
            Finish :
          </label>
          <select
            id="finish"
            {...register("finish")}
            className="input input-bordered w-full select"
          >
            <option value="">Select a finish</option>
            {finishOptions.map((f, i) => (
              <option key={i} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="skeleton h-12 w-full"></div>
      )}

      <Controller
        control={control}
        name="occasion"
        render={({ field }) =>
          occasionOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Occasion"
              options={occasionOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      {/* Other Fields */}
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

      {/* Customization Checkbox */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Engraving Available:</span>
        <input
          type="checkbox"
          {...register("customization.engravingAvailable")}
          className="checkbox checkbox-primary"
        />
      </label>

      {/* Hypoallergenic Checkbox */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Hypoallergenic:</span>
        <input
          type="checkbox"
          {...register("hypoallergenic")}
          className="checkbox checkbox-primary"
        />
      </label>

      {/* Certification Checkboxes and Dropdown */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Certified :</span>
        <input
          type="checkbox"
          {...register("certification.isCertified")}
          className="checkbox checkbox-primary"
        />
      </label>
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Hallmarked :</span>
        <input
          type="checkbox"
          {...register("certification.isHallmarked")}
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

      {/* Textarea fields */}
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

      {/* Input fields */}
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
