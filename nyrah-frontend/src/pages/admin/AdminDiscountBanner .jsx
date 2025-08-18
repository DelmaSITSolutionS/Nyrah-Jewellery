import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createDiscountBanner,
  deleteDiscountBanner,
  getAllDiscountBanners,
  updateDiscountBanner,
} from "../../redux/apis/discountBannerApi";
import { FaCirclePlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdDelete, MdEdit } from "react-icons/md";

function AdminDiscountBanner() {
  const dispatch = useDispatch();
  const { banners: posts } = useSelector((state) => state.discountBanner);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm();

  const [preview, setPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    if (data.post?.[0]) formData.append("image", data.post[0]);
    formData.append("title", data.title);

    if (editMode && editingPostId) {
      await dispatch(updateDiscountBanner({ id: editingPostId, formData }));
    } else {
      await dispatch(createDiscountBanner(formData));
    }

    reset();
    setPreview(null);
    setEditMode(false);
    setEditingPostId(null);
    document.getElementById("my-drawer-4").checked = false;
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await dispatch(deleteDiscountBanner(id));
    setLoading(false);
  };

  const handleEdit = (post) => {
    setValue("title", post.title);
    setPreview(post.image); // ✅ changed from post.post
    setEditMode(true);
    setEditingPostId(post._id);
    document.getElementById("my-drawer-4").checked = true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrawerClose = () => {
    reset();
    setPreview(null);
    setEditMode(false);
    setEditingPostId(null);
  };

  useEffect(() => {
    dispatch(getAllDiscountBanners());
  }, [dispatch]);

  return (
    <div>
      {/* Header */}
      <div className="flex shadow-md p-2 justify-between items-center w-full">
        <h2 className="text-xl uppercase font-noto-serif font-[400] text-[#443627]">
          DISCOUNT BANNER
        </h2>

        <div className="drawer drawer-end w-auto">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn bg-[#EFDCAB] capitalize font-roboto font-light tracking-wider flex items-center"
              onClick={handleDrawerClose}
            >
              <FaCirclePlus className="text-[.8rem]" />
              <span className="ms-2">Add Banner</span>
            </label>
          </div>
          <div className="drawer-side z-[10]">
            <label
              htmlFor="my-drawer-4"
              className="drawer-overlay"
              onClick={handleDrawerClose}
            ></label>
            <ul className="bg-base-200 text-base-content min-h-full w-80 p-4 pt-10">
              <label
                htmlFor="my-drawer-4"
                className="btn btn-error absolute top-3 right-4"
                onClick={handleDrawerClose}
              >
                <IoClose className="text-xl cursor-pointer opacity-50" />
              </label>

              <form onSubmit={handleSubmit(onSubmit)}>
                {preview && (
                  <div className="mb-2 mt-6">
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-auto rounded shadow"
                    />
                  </div>
                )}

                <div className="mb-4 mt-4">
                  <label
                    htmlFor="image"
                    className="block mb-1 font-light uppercase text-sm font-roboto"
                  >
                    Image:
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    {...register("post")}
                    className="file-input file-input-bordered w-full"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block mb-1 font-light uppercase text-sm font-roboto"
                  >
                    Title:
                  </label>
                  <input
                    id="title"
                    type="text"
                    placeholder="Enter title..."
                    {...register("title", { required: true })}
                    className="input input-warning w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editMode
                    ? "Update Banner"
                    : "Create Banner"}
                </button>
              </form>
            </ul>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mt-6 shadow-md">
        <table className={`table`}>
          <thead>
            <tr>
              <th className="bg-[#443627] text-white border opacity-80">#</th>
              <th className="bg-[#443627] text-white border opacity-80">
                Image
              </th>
              <th className="bg-[#443627] text-white border opacity-80">
                Title
              </th>
              <th className="bg-[#443627] text-white border opacity-80">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td>Loading...</td>
              </tr>
            ) : !loading && posts?.length > 0 ? (
              posts.map((post, index) => (
                <tr key={post?._id}>
                  <td className="border border-zinc-300">{index + 1}</td>
                  <td className="border border-zinc-300">
                    <img
                      src={post?.image} // ✅ changed from post.post
                      alt="banner"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </td>
                  <td className="border max-w-xs truncate border-zinc-300">
                    <a
                      href={post?.title}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      {post?.title}
                    </a>
                  </td>
                  <td className="border border-zinc-300 text-xl ">
                    <button
                      className="btn btn-sm btn-outline btn-success tooltip me-3"
                      data-tip="Edit"
                      onClick={() => handleEdit(post)}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-outline btn-error tooltip"
                      data-tip="Delete"
                      onClick={() => handleDelete(post._id)}
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4" colSpan="4">
                  {loading ? "Loading..." : "No Banners Found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDiscountBanner;
