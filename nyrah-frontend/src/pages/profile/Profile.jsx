import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "../../redux/apis/userApi";
import { toast } from "react-toastify";
import AddressSection from "../../components/AddressSection";

function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
  });

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(formData)).unwrap();
      toast.success("Profile updated successfully");
      setEditOpen(false);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-[6rem] lg:pt-[9rem] pb-3 space-y-8 font-poppins tracking-wide">
      {/* Header */}
      <div className="text-center ">
        <h2 className="text-2xl text-[#443627] font-cardo uppercase font-[300]">Profile</h2>
        <p className="text-gray-600 mt-1 font-poppins text-sm uppercase font-[400] tracking-wide">Manage your personal info & address</p>
      </div>

      {/* User Info */}
      <div className="bg-base-200 p-6  shadow space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-cardo tracking-wide  text-[#443627] mb-1 font-light">Personal Information</h3>
            <p className="text-sm text-gray-500"><strong>Name : </strong> {user?.name}</p>
            <p className="text-sm text-gray-500"><strong>Email : </strong> {user?.email}</p>
          </div>
          <button
            className="btn btn-sm btn-outline btn-neutral rounded-none uppercase font-[300] font-roboto tracking-wide"
            onClick={() => setEditOpen(true)}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Address Section */}
     
        <AddressSection />
     

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-[#0000007a] px-[1rem] bg-opacity-40 z-40 flex justify-center items-center">
          <div className="bg-base-100 w-full max-w-md p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4 uppercase tracking-wide font-cardo">Update Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  <span className="label-text" style={{color:"black"}}>Name :</span>
                </label>
                <input
                id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input input-bordered w-full rounded-none"
                  autoComplete="true"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4 ">
                <button
                  type="button"
                  className="btn btn-sm rounded-none font-[300]"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm rounded-none bg-[#9b6500] hover:bg-[#000000] text-white border font-[300]">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
