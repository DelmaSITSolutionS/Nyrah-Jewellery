import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCharges,
  updateCharges,
  upsertIntlRate,
  deleteIntlRate,
  createCharges,
} from "../../redux/apis/chargesApi";
import { toast } from "react-toastify";

export default function ChargesAdmin() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((s) => s.charges);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      gstRate: 0.03,
      domesticShipping: 0,
      otherCharges: {
        engraving: 199,
        hallmarking: 99,
        specialRequestDefault: 499,
      },
    },
  });

  // Fetch charges on mount
  useEffect(() => {
    dispatch(fetchCharges());
  }, [dispatch]);

  // Reset form when data is available
  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  // Update full sheet
  const onSubmit = async (vals) => {
    try {
      await dispatch(updateCharges(vals)).unwrap();
      toast.success("Charges updated");
      dispatch(fetchCharges());
    } catch (err) {
      toast.error(err?.message || "Update failed");
    }
  };

  // Delete international shipping rate
  const removeIntl = async (r) => {
    try {
      await dispatch(deleteIntlRate({ country: r.country, courier: r.courier })).unwrap();
      toast.success("Rate removed");
      dispatch(fetchCharges());
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  // If not created yet
  if (!loading && !data) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center space-y-4">
        <h2 className="text-xl font-semibold">No Charges Found</h2>
        <p className="text-gray-600">
          Click below to create default configuration for GST, shipping, and
          extra charges.
        </p>
        <button
          className="btn btn-primary"
          onClick={async () => {
            try {
              await dispatch(
                createCharges({
                  gstRate: 0.03,
                  domesticShipping: 0,
                  otherCharges: {
                    engraving: 199,
                    hallmarking: 99,
                    specialRequestDefault: 499,
                  },
                  internationalShipping: [],
                })
              ).unwrap();
              toast.success("Charges created");
              dispatch(fetchCharges());
            } catch (err) {
              toast.error(err?.message || "Creation failed");
            }
          }}
        >
          Create Default Charges
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto font-roboto">
      <h1 className="text-2xl mb-6 uppercase font-noto-serif tracking-wide">Charges Configuration</h1>

      {/* ───── Charges Form ───── */}
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-base-100 p-6 rounded shadow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          name="gstRate"
          control={control}
          render={({ field }) => (
            <div>
              <label className="label">GST Rate (e.g. 0.03 = 3%)</label>
              <input
                {...field}
                type="number"
                step="0.001"
                className="input input-bordered w-full"
              />
            </div>
          )}
        />

        <Controller
          name="domesticShipping"
          control={control}
          render={({ field }) => (
            <div>
              <label className="label">Domestic Shipping ₹</label>
              <input
                {...field}
                type="number"
                className="input input-bordered w-full"
              />
            </div>
          )}
        />

        <Controller
          name="otherCharges.engraving"
          control={control}
          render={({ field }) => (
            <div>
              <label className="label">Engraving ₹</label>
              <input
                {...field}
                type="number"
                className="input input-bordered w-full"
              />
            </div>
          )}
        />

        <Controller
          name="otherCharges.hallmarking"
          control={control}
          render={({ field }) => (
            <div>
              <label className="label">Hallmarking ₹</label>
              <input
                {...field}
                type="number"
                className="input input-bordered w-full"
              />
            </div>
          )}
        />

        <Controller
          name="otherCharges.specialRequestDefault"
          control={control}
          render={({ field }) => (
            <div>
              <label className="label">Special Request ₹</label>
              <input
                {...field}
                type="number"
                className="input input-bordered w-full"
              />
            </div>
          )}
        />

        <div className="col-span-full flex justify-end">
          <button className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save All"}
          </button>
        </div>
      </form>

      {/* ───── International Shipping Section ───── */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-noto-serif uppercase tracking-wider">International Shipping</h2>
          <label htmlFor="intl-modal" className="btn btn-sm btn-outline">
            + Add
          </label>
        </div>

        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Country</th>
              <th>Courier</th>
              <th>Charge ₹</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(data?.internationalShipping || []).length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-gray-500">
                  No international rates added
                </td>
              </tr>
            ) : (
              data.internationalShipping.map((r, idx) => (
                <tr key={`${r.country}-${r.courier}-${idx}`}>
                  <td>{r.country}</td>
                  <td>{r.courier}</td>
                  <td>{r.charge}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => removeIntl(r)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ───── Add Intl Modal ───── */}
      <input type="checkbox" id="intl-modal" className="modal-toggle" />
      <label htmlFor="intl-modal" className="modal cursor-pointer">
        <label className="modal-box" htmlFor="">
          <h3 className="font-bold text-lg mb-4">Add / Update Rate</h3>
          <IntlForm />
        </label>
      </label>
    </div>
  );
}

/* ───── Modal Form for Intl Shipping ───── */
function IntlForm() {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { country: "", courier: "", charge: 0 },
  });

  const submit = async (vals) => {
    try {
      await dispatch(upsertIntlRate(vals)).unwrap();
      await dispatch(fetchCharges()); // re-fetch to show immediately
      toast.success("Saved");
      reset();
      document.getElementById("intl-modal").checked = false;
    } catch (err) {
      toast.error(err?.message || "Save failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-3">
      <input
        {...register("country", { required: true })}
        placeholder="Country"
        className="input input-bordered w-full"
      />
      <input
        {...register("courier", { required: true })}
        placeholder="Courier"
        className="input input-bordered w-full"
      />
      <input
        type="number"
        {...register("charge", { required: true, min: 0 })}
        placeholder="Charge ₹"
        className="input input-bordered w-full"
      />
      <button className="btn btn-primary w-full">Save</button>
    </form>
  );
}
