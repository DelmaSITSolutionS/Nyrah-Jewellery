import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllOptions } from "../../../redux/apis/optionApi";
import MultiSelectDropdown from "../MultiSelectDropdown";
import isEqual from "lodash.isequal";

function NecklaceForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();
  const { control, watch, setValue, register, reset } = useForm({
    defaultValues: useMemo(
      () => ({
        sizes: [],
        chainLengths: [],
        metalPurity: [],
        metalTone: [],
        stoneType: [],
        certification: {
          isCertified: false,
          certType: "",
          isHallmarked: false,
        },
        weight: "",
        finish: "",
        shippingNote:
          "Free shipping in India. International delivery available",
        deliveryTime: "5–7 days (regular), 15–20 days (custom orders)",
      }),
      []
    ),
  });

  const featureSlice = useSelector((s) => s.options);
  const { list: metalPurities = [] } = featureSlice["metalPurity"] || {};
  const { list: metalTones = [] } = featureSlice["metalTone"] || {};
  const { list: necklaceSizes = [] } = featureSlice["necklaceSize"] || {};
  const { list: chainLengths = [] } = featureSlice["chainLength"] || {};
  const { list: stoneTypes = [] } = featureSlice["stoneType"] || {};
  const { list: finishTypes = [] } = featureSlice["finish"] || {};

  const metalToneOptions = metalTones.map((m) => m.name);
  const necklaceSizeOptions = necklaceSizes.map((s) => s.necklaceSize);
  const chainLengthOptions = chainLengths.map((c) => c.length);
  const metalPurityOptions = metalPurities.map((p) => p.name);
  const stoneTypeOptions = stoneTypes.map((st) => st.type);
  const finishOptions = finishTypes.map((f) => f.finish);

  useEffect(() => {
    dispatch(getAllOptions["metalPurity"]());
    dispatch(getAllOptions["metalTone"]());
    dispatch(getAllOptions["necklaceSize"]());
    dispatch(getAllOptions["chainLength"]());
    dispatch(getAllOptions["stoneType"]());
    dispatch(getAllOptions["finish"]());
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
    if (finishTypes.length > 0 && initial?.finish) {
      setValue("finish", initial.finish);
    }
  }, [finishTypes, initial, setValue]);

  // Handle form reset with initial data
  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      reset({
        ...initial,
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
      <h3 className="text-lg font-semibold">Necklace Details</h3>

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

      {/* Multi-select Dropdowns */}
      <Controller
        control={control}
        name="sizes"
        render={({ field }) =>
          necklaceSizeOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Necklace Sizes"
              options={necklaceSizeOptions}
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
        name="chainLengths"
        render={({ field }) =>
          chainLengthOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Chain Lengths"
              options={chainLengthOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      {finishTypes.length > 0 ? (
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

      {/* Certification Checkboxes */}
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
        <textarea
          id="deliveryTime"
          {...register("deliveryTime")}
          className="textarea textarea-bordered w-full"
        />
      </div>
    </div>
  );
}

export default React.memo(NecklaceForm, (prev, next) => {
  return isEqual(prev.initial, next.initial) && prev.onChange === next.onChange;
});
