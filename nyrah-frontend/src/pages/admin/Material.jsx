import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createNewMaterial,
  addNewSubMaterial,
  deleteMaterial,
  getAllMaterials,
  removeSubMaterial,
} from "../../redux/apis/materialApi";

import { FaCirclePlus } from "react-icons/fa6";
import { MdDelete, MdOutlineCategory } from "react-icons/md";
import { IoClose } from "react-icons/io5";

function Material() {
  const dispatch = useDispatch();
  const { materials, loading, error } = useSelector((state) => state.material);
  const [subIndex, setSubIndex] = useState(0);
  const [materialData, setMaterialData] = useState({
    tag: "",
    sub: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaterialData((prev) => ({
      ...prev,
      [name]: value?.toLowerCase(),
    }));
  };

  const addMain = (payload) => {
    dispatch(createNewMaterial(payload));
  };

  const addSub = (payload) => {
    dispatch(addNewSubMaterial(payload));
  };

  const removeSub = (tag, sub) => {
    dispatch(removeSubMaterial({ tag, sub }));
  };

  const removeMain = (tag) => {
    dispatch(deleteMaterial(tag));
  };

  useEffect(() => {
    dispatch(getAllMaterials());
  }, [dispatch]);

  return (
    <div>
      <div className="flex shadow-md p-2 justify-between items-center w-full">
        <h2 className="text-xl uppercase font-noto-serif font-[400] text-[#443627]">
          Tags
        </h2>
        <div className="drawer drawer-end w-auto">
          <input id="material-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="material-drawer"
              className="drawer-button btn bg-[#EFDCAB] capitalize font-roboto font-light tracking-wider flex items-center"
            >
              <FaCirclePlus className="text-[.8rem]" />
              <span>Add Tags</span>
            </label>
          </div>
          <div className="drawer-side z-[10]">
            <label htmlFor="material-drawer" className="drawer-overlay"></label>
            <ul className=" bg-base-200 text-base-content min-h-full w-80 p-4 pt-10">
              <label htmlFor="material-drawer" className=" btn-error absolute top-3 right-4">
                <IoClose className="text-xl cursor-pointer opacity-50" />
              </label>

              <label className="uppercase mt-5 text-ms font-roboto font-light">
                Add Material :
              </label>
              <input
                type="text"
                name="tag"
                className="input input-warning mt-4 capitalize"
                placeholder="e.g. Silver"
                value={materialData.tag}
                onChange={handleChange}
                list="materials"
              />
              <datalist id="materials">
                {materials.map((mat, i) => (
                  <option key={i} value={mat.tag}></option>
                ))}
              </datalist>
              <button className="btn btn-soft w-full my-4" onClick={() => addMain(materialData)}>
                Submit
              </button>

              <label className="uppercase my-5 text-ms font-roboto font-light">
                Add tags :
              </label>
              <input
                type="text"
                name="sub"
                className="input input-warning mt-4 capitalize"
                placeholder="e.g. Ring"
                value={materialData.sub}
                onChange={handleChange}
              />
              <button
                type="submit"
                className="btn btn-soft w-full my-4"
                onClick={() => addSub(materialData)}
              >
                Submit
              </button>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between mt-3">
        <div className={`${(loading || error) && "skeleton"} overflow-x-auto md:w-[48%] h-[100%] shadow-md`}>
          <h2 className="text-md tracking-wide p-4 uppercase font-roboto font-light">
            Materials
          </h2>
          {materials.length !== 0 ? (
            <table className={`${(error || loading) && "hidden"} table`}>
              <thead>
                <tr>
                  <th className="bg-[#443627] text-white border opacity-80">Id</th>
                  <th className="bg-[#443627] text-white border opacity-80">Name</th>
                  <th className="bg-[#443627] text-white border opacity-80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((mat, index) => (
                  <tr key={index}>
                    <th className="border border-zinc-300">{index + 1}</th>
                    <td className="border border-zinc-300 capitalize">{mat.tag}</td>
                    <td className="border border-zinc-300 text-xl flex">
                      <div className="tooltip tooltip-left" data-tip="Delete">
                        <MdDelete
                          className="me-3 cursor-pointer text-red-700"
                          onClick={() => removeMain(mat.tag)}
                        />
                      </div>
                      <div className="tooltip tooltip-left" data-tip="View SubMaterials">
                        <MdOutlineCategory
                          className="cursor-pointer"
                          onClick={() => setSubIndex(index)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4">No Materials</div>
          )}
        </div>

        <div className={`${(loading || error) && "skeleton"} overflow-x-auto md:w-[48%] h-[100%] shadow-md`}>
          <h2 className="text-md tracking-wide p-4 uppercase font-roboto font-light">
            tags
          </h2>
          {materials[subIndex]?.sub?.length !== 0 ? (
            <table className={`${(error || loading) && "hidden"} table`}>
              <thead>
                <tr>
                  <th className="bg-[#443627] text-white border opacity-80">Id</th>
                  <th className="bg-[#443627] text-white border opacity-80">Name</th>
                  <th className="bg-[#443627] text-white border opacity-80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials[subIndex]?.sub?.map((sub, index) => (
                  <tr key={index}>
                    <th className="border border-zinc-300">{index + 1}</th>
                    <td className="border border-zinc-300 capitalize">{sub}</td>
                    <td className="text-xl border border-zinc-300">
                      <div className="tooltip tooltip-left" data-tip="Delete">
                        <MdDelete
                          className="me-3 cursor-pointer text-red-700"
                          onClick={() => removeSub(materials[subIndex]?.tag, sub)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4">No SubMaterials</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Material;
