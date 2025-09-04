import React, { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllOptions } from "../../../redux/apis/optionApi";
import MultiSelectDropdown from "../MultiSelectDropdown";
import isEqual from "lodash.isequal";

function RingForm({ initial = {}, onChange }) {
  const dispatch = useDispatch();
  const { control, watch, setValue, register, getValues, reset } = useForm({
    defaultValues: useMemo(() => ({
      sizeOptions: [],
      metalPurity: [],
      metalTone: "",
      diamondSize: "",
      finish: "",
      stoneType: [],
      centerStoneOptions: {
        carats: "",
        shapes: "",
        qualities: "",
      },
      customization: {
        engravingAvailable: false,
      },
      certification: {
        isCertified: false,
        certType: "",
        isHallmarked: false,
      },
      shippingNote: "Free shipping in India. Custom orders: 15–20 business days.",
    }), []),
  });

  const featureSlice = useSelector((s) => s.options);
  const { list: metalPurities = [] } = featureSlice["metalPurity"] || {};
  const { list: metalTones = [] } = featureSlice["metalTone"] || {};
  const { list: ringSizes = [] } = featureSlice["ringSize"] || {};
  const { list: diamondSizes = [] } = featureSlice["diamondSize"] || {};
  const { list: finishes = [] } = featureSlice["finish"] || {};
  const { list: stoneTypes = [] } = featureSlice["stoneType"] || {};
  const { list: stoneCarats = [] } = featureSlice["stoneCarat"] || {};
  const { list: stoneShapes = [] } = featureSlice["stoneShape"] || {};
  const { list: stoneQualities = [] } = featureSlice["stoneQuality"] || {};

  const ringSizeOptions = ringSizes.map((s) => s.size);
  const diamondSizeOptions = diamondSizes.map((d) => d.diamondSize);
  const metalPurityOptions = metalPurities.map((p) => p.name);
  const finishOptions = finishes.map((f) => f.finish);
  const stoneTypeOptions = stoneTypes.map((st) => st.type);
  const stoneCaratOptions = stoneCarats.map((sc) => sc.carat);
  const stoneShapeOptions = stoneShapes.map((ss) => ss.shape);
  const stoneQualityOptions = stoneQualities.map((sq) => sq.quality);

  useEffect(() => {
    dispatch(getAllOptions["ringSize"]());
    dispatch(getAllOptions["metalPurity"]());
    dispatch(getAllOptions["metalTone"]());
    dispatch(getAllOptions["diamondSize"]());
    dispatch(getAllOptions["finish"]());
    dispatch(getAllOptions["stoneType"]());
    dispatch(getAllOptions["stoneCarat"]());
    dispatch(getAllOptions["stoneShape"]());
    dispatch(getAllOptions["stoneQuality"]());
  }, [dispatch]);

  // Set default values for single-select fields once their data is loaded
  useEffect(() => {
    if (metalTones.length > 0) {
      // Logic for Metal Tone: default to "Silver" or initial value
      const silverTone = metalTones.find(t => t.name.toLowerCase() === "silver")?.name;
      const initialTone = initial?.metalTone;
      if (!initialTone && silverTone) {
        setValue("metalTone", silverTone);
      } else if (initialTone) {
        setValue("metalTone", initialTone);
      }
    }
  }, [metalTones, initial, setValue]);

  useEffect(() => {
    if (diamondSizes.length > 0 && initial?.diamondSize) {
      setValue("diamondSize", initial.diamondSize);
    }
  }, [diamondSizes, initial, setValue]);

  useEffect(() => {
    if (finishes.length > 0 && initial?.finish) {
      setValue("finish", initial.finish);
    }
  }, [finishes, initial, setValue]);

  useEffect(() => {
    if (stoneCarats.length > 0 && initial?.centerStoneOptions?.carats) {
      setValue("centerStoneOptions.carats", initial.centerStoneOptions.carats);
    }
  }, [stoneCarats, initial, setValue]);

  useEffect(() => {
    if (stoneShapes.length > 0 && initial?.centerStoneOptions?.shapes) {
      setValue("centerStoneOptions.shapes", initial.centerStoneOptions.shapes);
    }
  }, [stoneShapes, initial, setValue]);

  useEffect(() => {
    if (stoneQualities.length > 0 && initial?.centerStoneOptions?.qualities) {
      setValue("centerStoneOptions.qualities", initial.centerStoneOptions.qualities);
    }
  }, [stoneQualities, initial, setValue]);

  // Handle form reset with initial data
  useEffect(() => {
    if (initial && Object.keys(initial).length) {
      reset({
        ...initial,
        centerStoneOptions: {
          carats: initial.centerStoneOptions?.carats || "",
          shapes: initial.centerStoneOptions?.shapes || "",
          qualities: initial.centerStoneOptions?.qualities || "",
        },
        customization: {
          engravingAvailable: initial.customization?.engravingAvailable || false,
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
      <h3 className="text-lg font-semibold">Ring Details</h3>

      {/* Metal Tone Selector */}
      {metalTones.length > 0 ? (
        <div>
          <label htmlFor="metalTone" className="label pb-3">
            Metal Tone :
          </label>
          <select
            id="metalTone"
            {...register("metalTone")}
            className="input input-bordered w-full select"
          >
            {metalTones.map((t) => (
              <option className="capitalize" key={t._id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="skeleton h-12 w-full"></div>
      )}
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

      {/* Multi-select fields remain the same */}
      <Controller
        control={control}
        name="sizeOptions"
        render={({ field }) =>
          ringSizeOptions.length > 0 ? (
            <MultiSelectDropdown
              label="Ring Sizes"
              options={ringSizeOptions}
              selected={field.value}
              onChange={field.onChange}
            />
          ) : (
            <div className="skeleton h-24 w-full"></div>
          )
        }
      />

      {/* Diamond Size Selector */}
      {diamondSizes.length > 0 ? (
        <div>
          <label htmlFor="diamondSize" className="label pb-3">
            Diamond Size :
          </label>
          <select
            id="diamondSize"
            {...register("diamondSize")}
            className="input input-bordered w-full select"
          >
            <option value="">Select a diamond size</option>
            {diamondSizeOptions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="skeleton h-12 w-full"></div>
      )}

      {/* Finish Selector */}
      {finishes.length > 0 ? (
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

      

     

      {/* Center Stone Options (single select) */}
      {stoneCaratOptions.length > 0 ? (
        <div>
          <label htmlFor="carats" className="label pb-3">
            Center Stone Carats :
          </label>
          <select
            id="carats"
            {...register("centerStoneOptions.carats")}
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

      {stoneShapeOptions.length > 0 ? (
        <div>
          <label htmlFor="shapes" className="label pb-3">
            Center Stone Shapes :
          </label>
          <select
            id="shapes"
            {...register("centerStoneOptions.shapes")}
            className="input input-bordered w-full select"
          >
            <option value="">Select a shape</option>
            {stoneShapeOptions.map((s, i) => (
              <option key={i} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="skeleton h-12 w-full"></div>
      )}

      {stoneQualityOptions.length > 0 ? (
        <div>
          <label htmlFor="qualities" className="label pb-3">
            Center Stone Qualities :
          </label>
          <select
            id="qualities"
            {...register("centerStoneOptions.qualities")}
            className="input input-bordered w-full select"
          >
            <option value="">Select a quality</option>
            {stoneQualityOptions.map((q, i) => (
              <option key={i} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="skeleton h-12 w-full"></div>
      )}

      {/* Customization Options */}
      <label className="cursor-pointer label">
        <p className="label-text inline pe-2">Engraving Available:</p>
        <input
          type="checkbox"
          {...register("customization.engravingAvailable")}
          className="checkbox checkbox-primary"
        />
      </label>

      {/* Certification Options */}
      <label className="cursor-pointer label">
        <span className="label-text pe-2">Hallmarked :</span>
        <input
          type="checkbox"
          {...register("certification.isHallmarked")}
          className="checkbox checkbox-primary"
        />
      </label>
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
        </select>
      </div>

      {/* Shipping Note */}
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
    </div>
  );
}

const propsAreEqual = (prev, next) => {
  return isEqual(prev.initial, next.initial) && prev.onChange === next.onChange;
};

export default React.memo(RingForm, propsAreEqual);