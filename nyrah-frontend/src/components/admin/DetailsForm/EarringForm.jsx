import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import isEqual from "lodash.isequal";
import { getAllOptions } from "../../../redux/apis/optionApi";
import MultiSelectDropdown from "../MultiSelectDropdown";

function EarringForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();

  const { control, watch, setValue, register, reset } = useForm({
    defaultValues: useMemo(
      () => ({
        metalPurity: [],
        metalTone: [],
        stoneType: [],
        stoneCarat: "",
        earringSize: [],
        weight: "",
        backType: "",
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
        careInstructions:
          "Wipe with soft cloth, avoid water/perfume, store in dry pouch",
        shippingNote: "Free shipping in India. Worldwide delivery.",
        deliveryTime: "5–7 days (regular), 15–20 days (custom orders)",
        packaging: "Luxury gift box",
      }),
      []
    ),
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

  const metalPurityOptions = metalPurities.map((p) => p.name);
  const metalToneOptions = metalTones.map((t) => t.name);
  const stoneTypeOptions = stoneTypes.map((st) => st.type);
  const stoneCaratOptions = stoneCarats.map((sc) => sc.carat);
  const earringSizeOptions = earringSizes.map((es) => es.earringsize);
  const backTypeOptions = backTypes.map((bt) => bt.backType);
  const finishOptions = finishTypes.map((f) => f.finish);
  const occasionOptions = occasions.map((o) => o.occasion);

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
    if (backTypes.length > 0 && initial?.backType) {
      setValue("backType", initial.backType);
    }
  }, [backTypes, initial, setValue]);

  useEffect(() => {
    if (finishTypes.length > 0 && initial?.finish) {
      setValue("finish", initial.finish);
    }
  }, [finishTypes, initial, setValue]);

  useEffect(() => {
    if (stoneCarats.length > 0 && initial?.stoneCarat) {
      setValue("stoneCarat", initial.stoneCarat);
    }
  }, [stoneCarats, initial, setValue]);

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
      <h3 className="text-lg font-semibold">Earring Details</h3>

      {/* Single-select dropdowns */}
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

      {/* Multi-select dropdowns */}
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

      <Controller
        control={control}
        name="earringSize"
        render={({ field }) =>
          earringSizeOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Earring Size"
              options={earringSizeOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      {backTypeOptions.length > 0 ? (
        <div>
          <label htmlFor="backType" className="label pb-3">
            Back Type :
          </label>
          <select
            id="backType"
            {...register("backType")}
            className="input input-bordered w-full select"
          >
            <option value="">Select a back type</option>
            {backTypeOptions.map((bt, i) => (
              <option key={i} value={bt}>
                {bt}
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
          className="input input-bordered w-full"
          {...register("weight")}
        />
      </div>

      {/* Checkboxes */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Engraving Available:</span>
        <input
          type="checkbox"
          {...register("customization.engravingAvailable")}
          className="checkbox checkbox-primary"
        />
      </label>

      <label className="cursor-pointer label">
        <span className="label-text pe-2">Hypoallergenic:</span>
        <input
          type="checkbox"
          {...register("hypoallergenic")}
          className="checkbox checkbox-primary"
        />
      </label>

      <label className="cursor-pointer label">
        <span className="label-text pe-2">Certified:</span>
        <input
          type="checkbox"
          {...register("certification.isCertified")}
          className="checkbox checkbox-primary"
        />
      </label>

      <label className="cursor-pointer label">
        <span className="label-text pe-2">Hallmarked:</span>
        <input
          type="checkbox"
          {...register("certification.isHallmarked")}
          className="checkbox checkbox-primary"
        />
      </label>

      {/* Certification Type Dropdown */}
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

      {/* Input fields */}
      <div>
        <label htmlFor="deliveryTime" className="label">
          Delivery Time
        </label>
        <textarea
          id="deliveryTime"
          {...register("deliveryTime")}
          className="textarea textarea-bordered w-full"
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
