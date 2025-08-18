import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewCategory,
  addNewSubcategory,
  deleteCategory,
  getAllCategories,
  removeSubCategory,
  updateCategory,
} from "../../redux/apis/categoryApi";

import { FaCirclePlus } from "react-icons/fa6";
import { MdCheck, MdDelete, MdEdit, MdOutlineCategory } from "react-icons/md";
import { IoClose } from "react-icons/io5";

function Category() {
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector((state) => state.category);
  const [subIndex, setSubIndex] = useState(0);
  const [categoryData, setCategoryData] = useState({
    main: "",
    sub: "",
  });
  const [editCat, setEditCat] = useState({
    id: "",
    mainIndex: null,
    subIndex: null,
    main: "",
    sub: {
      old: "",
      new: "",
    },
  });

  console.log(editCat);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value?.toLowerCase(),
    }));
  };

  const editCategory = (id, main, sub) => {
    dispatch(updateCategory({ id, main, sub }));
    setEditCat({ id: "", main: "", sub: { oldSub: "", newSub: "" } });
  };

  const addMain = (payload) => {
    dispatch(createNewCategory(payload));
  };

  const addSub = (payload) => {
    dispatch(addNewSubcategory(payload));
  };

  const removeSub = (main, sub) => {
    dispatch(removeSubCategory({ main, sub }));
  };

  const removeMain = (main) => {
    dispatch(deleteCategory(main));
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);
  return (
    <div>
      <div className="flex shadow-md p-2 justify-between items-center w-full">
        <h2 className="text-xl uppercase font-noto-serif font-[400] text-[#443627]">
          Category
        </h2>
        <div className="drawer drawer-end w-auto">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn bg-[#EFDCAB] capitalize font-roboto font-light tracking-wider flex items-center"
            >
              <FaCirclePlus className="text-[.8rem]" />
              <span>Add category</span>
            </label>
          </div>
          <div className="drawer-side z-[10]">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>

            <ul className=" bg-base-200 text-base-content min-h-full w-80 p-4 pt-10">
              <label
                htmlFor="my-drawer-4"
                className=" btn-error absolute top-3 right-4"
              >
                <IoClose className="text-xl cursor-pointer opacity-50" />
              </label>
              <label
                htmlFor="mainCategory"
                className="uppercase mt-5 text-ms font-roboto font-light"
              >
                Add Main Category :
              </label>
              <input
                id="mainCategory"
                type="text"
                name="main"
                className="input input-warning mt-4 capitalize"
                placeholder="Name"
                list="browsers"
                value={categoryData.main}
                onChange={handleChange}
              />
              <datalist id="browsers">
                {categories.map((cat, i) => (
                  <option key={i} value={cat.main}></option>
                ))}
              </datalist>
              <button
                className="btn btn-soft w-full my-4"
                onClick={() => addMain(categoryData)}
              >
                Submit
              </button>
              <label
                htmlFor="subCategory"
                className="uppercase my-5 text-ms font-roboto font-light"
              >
                Add sub Category :
              </label>
              <input
                id="subCategory"
                type="text"
                placeholder="Name"
                name="sub"
                className="input input-warning mt-4 capitalize"
                value={categoryData.sub}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="btn btn-soft w-full my-4"
                onClick={() => addSub(categoryData)}
              >
                Submit
              </button>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between mt-3">
        <div
          className={`${
            (loading || error) && "skeleton"
          } overflow-x-auto md:w-[48%] h-[100%] shadow-md`}
        >
          <h2 className="text-md tracking-wide p-4 uppercase font-roboto font-light">
            Main categories
          </h2>
          {categories.length != 0 ? (
            <table className={`${(error || loading) && "hidden"} table`}>
              {/* head */}
              <thead>
                <tr>
                  <th className="bg-[#443627] text-white border opacity-80">
                    Id
                  </th>
                  <th className="bg-[#443627] text-white border opacity-80">
                    Name
                  </th>
                  <th className="bg-[#443627] text-white border opacity-80">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={index}>
                    <th className="border border-zinc-300 ">{index + 1}</th>
                    <td className="border border-zinc-300 capitalize">
                      <input
                        type="text"
                        className="capitalize"
                        style={
                          editCat.mainIndex !== index ? { border: "none" } : {}
                        }
                        value={
                          editCat.mainIndex !== index ? cat.main : editCat.main
                        }
                        onChange={(e) =>
                          setEditCat((prev) => ({
                            ...prev,
                            main: e.target.value,
                          }))
                        }
                        disabled={editCat.mainIndex !== index}
                        id={`main-${index + 1}`}
                      />
                    </td>
                    <td className="border border-zinc-300 text-xl ">
                      <button
                        className="btn btn-sm btn-outline btn-error tooltip tooltip-left me-3"
                        data-tip="Delete"
                        onClick={() => removeMain(cat.main)}
                      >
                        <MdDelete />
                      </button>
                      <button
                        onClick={() => setSubIndex(index)}
                        className="btn btn-sm btn-outline btn-neutral tooltip me-3 tooltip-left"
                        data-tip="View SubCategory"
                      >
                        <MdOutlineCategory />
                      </button>
                      {editCat.mainIndex !== index && (
                        <button
                          title="edit"
                          className="btn btn-sm btn-outline btn-success"
                          onClick={() =>
                            setEditCat({
                              id: cat._id,
                              main: cat?.main,
                              mainIndex: index,
                              subIndex: null,
                            })
                          }
                        >
                          <MdEdit />
                        </button>
                      )}
                      {editCat.mainIndex === index && (
                        <button
                          title="ok"
                          className="btn btn-sm btn-outline btn-success"
                          onClick={() => editCategory(cat?._id, editCat.main)}
                        >
                          <MdCheck />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4">No Categories</div>
          )}
        </div>
        <div
          className={`${
            (loading || error) && "skeleton"
          } overflow-x-auto md:w-[48%] h-[100%] shadow-md`}
        >
          <h2 className="text-md tracking-wide p-4 uppercase font-roboto font-light">
            Sub categories
          </h2>
          {categories[subIndex]?.sub?.length != 0 ? (
            <table className={`${(error || loading) && "hidden"} table`}>
              {/* head */}
              <thead>
                <tr>
                  <th className="bg-[#443627] text-white border opacity-80">
                    Id
                  </th>
                  <th className="bg-[#443627] text-white border opacity-80">
                    Name
                  </th>
                  <th className="bg-[#443627] text-white border opacity-80">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories[subIndex]?.sub?.map((subCate, index) => (
                  <tr key={index}>
                    <th className="border border-zinc-300">{index + 1}</th>
                    <td className="border border-zinc-300 capitalize">
                      <input
                        type="text"
                        className="capitalize"
                        style={
                          index !== editCat.subIndex ? { border: "none" } : {}
                        }
                        value={
                          index !== editCat.subIndex ? subCate : editCat.sub.new
                        }
                        onChange={(e) =>
                          setEditCat((prev) => ({
                            ...prev,
                            sub: {
                              old: subCate,
                              new: e.target.value,
                            },
                          }))
                        }
                        disabled={index !== editCat.subIndex}
                        id={`sub-${index + 1}`}
                      />
                    </td>
                    <td className="text-xl border border-zinc-300">
                      <button
                        className="tooltip tooltip-left btn btn-sm btn-outline btn-error me-3"
                        data-tip="Delete"
                        onClick={() =>
                          removeSub(categories[subIndex]?.main, subCate)
                        }
                      >
                        <MdDelete className="cursor-pointer text-red-700" />
                      </button>
                      {index !== editCat.subIndex && (
                        <button
                          title="edit"
                          className="btn btn-sm btn-outline btn-success"
                          onClick={() =>
                            setEditCat({
                              id: categories[subIndex]?._id,
                              main: categories[subIndex]?.main,
                              subIndex: index,
                              mainIndex: null,
                              sub: { old: subCate, new: subCate },
                            })
                          }
                        >
                          <MdEdit />
                        </button>
                      )}
                      {index === editCat.subIndex && (
                        <button
                          title="ok"
                          className="btn btn-sm btn-outline btn-success"
                          onClick={() =>
                            editCategory(editCat.id, editCat.main, editCat.sub)
                          }
                        >
                          <MdCheck />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4">No SubCategories</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Category;
