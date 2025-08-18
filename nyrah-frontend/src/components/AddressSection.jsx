import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getUserProfile, updateUserProfile } from "../redux/apis/userApi";

export default function AddressSection() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [isEditing, setIsEditing] = useState(false);

  if (!user) return null;

  const hasAddress = user.address && Object.keys(user.address).length > 0;

  const onSubmit = async (data) => {
    const address = {
      name: data.name,
      phone: data.phone,
      street: data.street,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
    };

    dispatch(updateUserProfile({ address }));
    dispatch(getUserProfile())
    setIsEditing(false);
  };

  const handleEditClick = () => {
    if (hasAddress) {
      reset(user.address); // optional: preload current address
    }
    setIsEditing(true);
  };

  return (
    <div className="p-4 bg-base-100 font-poppins capitalize tracking-wide  rounded border border-[#dddddd] ">
      <h2 className="text-xl font-cardo  mb-4 font-[300]">Shipping Address</h2>

      {!hasAddress || isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2  gap-4"
        >
          {/* Full Name */}
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              autoComplete="true"
              placeholder="Full Name"
              className="input input-bordered w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <input
              autoComplete="true"
              {...register("phone", { required: "Phone is required" })}
              placeholder="Phone"
              className="input input-bordered w-full"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Street */}
          <div className="col-span-full">
            <input
              {...register("street", {
                required: "Street address is required",
              })}
              placeholder="Street Address"
              className="input input-bordered w-full"
            />
            {errors.street && (
              <p className="text-red-500 text-sm mt-1">
                {errors.street.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <input
              {...register("city", { required: "City is required" })}
              placeholder="City"
              className="input input-bordered w-full"
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          {/* State */}
          <div>
            <input
              {...register("state", { required: "State is required" })}
              placeholder="State"
              className="input input-bordered w-full"
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <input
              {...register("pincode", { required: "Pincode is required" })}
              placeholder="Pincode"
              className="input input-bordered w-full"
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pincode.message}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <input
              autoComplete="false"
              {...register("country", { required: "Country is required" })}
              placeholder="Country"
              className="input input-bordered w-full"
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">
                {errors.country.message}
              </p>
            )}
          </div>

          {/* Submit / Cancel */}
          <div className="col-span-full flex gap-2 mt-2">
            <button
              type="submit"
              className="btn bg-[#9b6500] hover:bg-[#000000] font-poppins text-white rounded-none flex-1 font-[300]"
            >
              Save Address
            </button>
            {hasAddress && (
              <button
                type="button"
                className="btn btn-outline btn-neutral font-[300] rounded-none"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <>
          <div className="text-sm text-gray-700 space-y-1">
            <p>
              <strong>Name:</strong> {user.address.name}
            </p>
            <p>
              <strong>Phone:</strong> {user.address.phone}
            </p>
            <p>
              <strong>Street:</strong> {user.address.street}
            </p>
            <p>
              <strong>City:</strong> {user.address.city}
            </p>
            <p>
              <strong>Pin:</strong> {user.address.pincode}
            </p>
            <p>
              <strong>State:</strong> {user.address.state}
            </p>
            <p>
              <strong>Country:</strong> {user.address.country}
            </p>
          </div>

          <button
            className="btn btn-outline btn-neutral rounded-none uppercase font-[300] btn-sm mt-3"
            onClick={handleEditClick}
          >
            Change Address
          </button>
        </>
      )}
    </div>
  );
}
