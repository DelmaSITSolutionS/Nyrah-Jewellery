// src/components/admin/Customization.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCustomizations,
  createCustomization,
  updateCustomization,
  deleteCustomization,
} from "../../redux/apis/customizationApi";
import {
  clearCustomizationError,
  resetCustomizationSuccess,
} from "../../redux/slices/customizationSlice";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import SuggestedValuePriceFieldArray from "../../components/admin/SuggestedValuePriceFieldArray";
import { getAllOptions } from "../../redux/apis/optionApi";

// Helpers
const toValuePriceArray = (arr) =>
  Array.isArray(arr)
    ? arr.map((x) => ({
        value: typeof x?.value === "string" ? x.value : String(x?.value ?? ""),
        price:
          typeof x?.price === "number"
            ? x.price
            : Number.isFinite(Number(x?.price))
            ? Number(x.price)
            : 0,
      }))
    : [];

export default function Customization() {
  const dispatch = useDispatch();
  const { customizations, loading, error, success } = useSelector(
    (s) => s.customization
  );

  const [editingId, setEditingId] = useState(null);

  const featureSlice = useSelector((s) => s.options);
  const { list: metalPurities = [] } = featureSlice["metalPurity"] || {};
  const { list: stoneTypes = [] } = featureSlice["stoneType"] || {};

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      productGroup: "",
      metalPurity: [],
      stoneType: [],
    },
  });

  // Fetch all on mount
  useEffect(() => {
    dispatch(getAllCustomizations());
    dispatch(getAllOptions["metalPurity"]?.());
    dispatch(getAllOptions["stoneShape"]?.());
  }, [dispatch]);

  // Toast errors/success
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCustomizationError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(resetCustomizationSuccess());
    }
  }, [success, dispatch]);

  const rows = useMemo(() => {
    return [...customizations].sort((a, b) =>
      (a.productGroup || "").localeCompare(b.productGroup || "")
    );
  }, [customizations]);

  const handleEdit = (row) => {
    setEditingId(row._id);
    reset({
      productGroup: row.productGroup || "",
      metalPurity: toValuePriceArray(row.metalPurity),
      stoneType: toValuePriceArray(row.stoneType),
    });
  };

  

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this customization?");
    if (!ok) return;
    try {
      await dispatch(deleteCustomization(id)).unwrap();
    } catch (e) {}
  };

  const handleReset = () => {
    setEditingId(null);
    reset({
      productGroup: "",
      metalPurity: [],
      stoneType: [],
    });
  };

 

  const onSubmit = async (form) => {
    const payload = {
      productGroup: String(form.productGroup || "").toLowerCase().trim(),
      metalPurity: toValuePriceArray(form.metalPurity),
      stoneType: toValuePriceArray(form.stoneType),
    };
    

    if (!payload.productGroup) {
      toast.error("Product group is required");
      return;
    }

    try {
      if (editingId) {
        await dispatch(
          updateCustomization({ id: editingId, updateData: payload })
        ).unwrap();
      } else {
        await dispatch(createCustomization(payload)).unwrap();
      }
      dispatch(getAllCustomizations());
      handleReset();
    } catch (e) {}
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT: TABLE */}
      <div className="shadow-md border rounded-lg bg-white">
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Customizations</h2>
        </div>
        <div className="p-4">
          {loading && rows.length === 0 ? (
            <div className="animate-pulse text-sm text-gray-500">
              Loading customizations…
            </div>
          ) : rows.length === 0 ? (
            <div className="text-sm text-gray-500">No customizations</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="bg-gray-800 text-white">ID</th>
                    <th className="bg-gray-800 text-white">Product Group</th>
                    <th className="bg-gray-800 text-white text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={row._id || i}>
                      <td className="align-top text-xs break-all">{row._id}</td>
                      <td className="capitalize">{row.productGroup}</td>
                      <td className="text-center space-x-2">
                        <button
                          onClick={() => handleEdit(row)}
                          className="btn btn-sm btn-outline btn-success"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(row._id)}
                          className="btn btn-sm btn-outline btn-error"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: FORM */}
      <div className="shadow-md border rounded-lg bg-white">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {editingId ? "Update Customization" : "Create Customization"}
          </h2>
          {editingId && (
            <button onClick={handleReset} className="btn btn-sm">
              New
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Product Group input (free text) */}
          <div>
            <label className="label">Product Group</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Enter product group (e.g. ring, bracelet, etc.)"
              {...register("productGroup", { required: true })}
            />
            {errors.productGroup && (
              <p className="text-xs text-red-500 mt-1">
                Product group is required
              </p>
            )}
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
            name="stoneType"
            label="Stone Type"
            optionList={stoneTypes}
          />

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="btn btn-primary w-full"
            >
              {editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-ghost"
              disabled={isSubmitting || loading}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
