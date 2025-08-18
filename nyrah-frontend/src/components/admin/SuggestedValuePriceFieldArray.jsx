import React from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "../Button"; // or use your preferred button

export default function SuggestedValuePriceFieldArray({
  control,
  register,
  name,
  label,
  optionList = [],
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });


  return (
    <div className="mb-4">
      <h4 className="font-medium mb-2">{label}</h4>
      {fields.map((field, index) => (
        <div key={field.id} className="flex gap-2 mb-2">
          {/* Suggested Value */}
          <div className="flex-1">
            <label htmlFor={`${name}value${index}`} className="label">
              <span className="label-text" style={{color:"black"}}>Value</span>
            </label>
            <input
              id={`${name}value${index}`}
              type="text"
              list={`${name}-suggestions`}
              {...register(`${name}.${index}.value`, { required: true })}
              className="input input-bordered w-full"
            />
            <datalist id={`${name}-suggestions`}>
              {optionList.map((opt, i) => (
                <option
                  key={i}
                  value={
                    Object.entries(opt).find(
                      ([k, v]) =>
                        typeof v === "string" && !["_id", "__v"].includes(k)
                    )?.[1] || ""
                  }
                />
              ))}
            </datalist>
          </div>

          {/* Price */}
          <div className="w-32">
            <label htmlFor={`${name}price${index}`} className="label">
              <span className="label-text" style={{color:"black"}}>Price</span>
            </label>
            <input
              id={`${name}price${index}`}
              type="number"
              step="0.01"
              {...register(`${name}.${index}.price`)}
              className="input input-bordered w-full"
            />
          </div>

          {/* Remove */}
          <div className="flex items-end pb-1">
            <Button
              type="button"
              onClick={() => remove(index)}
              variant="error"
              className="btn btn-sm btn-outline"
            >
              ✕
            </Button>
          </div>
        </div>
      ))}

      <Button
        type="button"
        onClick={() => append({ value: "", price: 0 })}
        className="btn-sm mt-1"
      >
        + Add {label}
      </Button>
    </div>
  );
}
