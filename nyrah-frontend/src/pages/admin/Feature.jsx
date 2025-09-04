import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCirclePlus } from "react-icons/fa6";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  createOption,
  deleteOption,
  getAllOptions,
  updateOption,
} from "../../redux/apis/optionApi";
import { MdCheck, MdDelete, MdEdit } from "react-icons/md";

const optionKeys = [
  { label: "Metal Tone", key: "metalTone", field: "name", isImage: true },
  { label: "Metal Purity", key: "metalPurity", field: "name" },
  { label: "Stone Type", key: "stoneType", field: "type" },
  { label: "Stone Carat", key: "stoneCarat", field: "carat" },
  { label: "Stone Quality", key: "stoneQuality", field: "quality" },
  { label: "Stone Shape", key: "stoneShape", field: "shape" },
  { label: "Finish", key: "finish", field: "finish" },
  { label: "Occasion", key: "occasion", field: "occasion" },
  { label: "Back Type", key: "backType", field: "backtype" },
];

function Feature() {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState("metalTone");
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);

  // For inline update
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [editFile, setEditFile] = useState(null);

  /* grab slice */
  const slice = useSelector((s) => s.options);
  const { list, loading, error } = slice[selectedKey] || {};

  /* find field for current key */
  const { field, label, isImage } =
    optionKeys.find((o) => o.key === selectedKey) || {};

  /* ── fetch on key change ─────────────────────────── */
  useEffect(() => {
    dispatch(getAllOptions[selectedKey]());
  }, [dispatch, selectedKey]);

  /* ── add new value ──────────────────────────────── */
  const handleAdd = () => {
    if (!input.trim()) return toast.error("Value required");

    let value;

    if (isImage) {
      if (!file) return toast.error("Select image");
      const formData = new FormData();
      formData.append("name", input.toLowerCase());
      formData.append("image", file);
      value = formData;
    } else {
      value = input.toLowerCase();
    }

    dispatch(createOption[selectedKey](value))
      .unwrap()
      .then(() => {
        toast.success(`${label} added`);
        setInput("");
        setFile(null);
      })
      .catch((err) => toast.error(err));
  };

  /* ── delete value ───────────────────────────────── */
  const handleDelete = (id) => {
    dispatch(deleteOption[selectedKey](id))
      .unwrap()
      .then(() => toast.success("Deleted"))
      .catch((err) => toast.error(err));
  };

  /* ── update value ───────────────────────────────── */
  const handleUpdate = (item) => {
    if (isImage) {
      const formData = new FormData();
      formData.append("name", editValue || item[field]);
      if (editFile) formData.append("image", editFile); // only update if new file chosen
      dispatch(updateOption[selectedKey]({ id: item._id, value: formData }))
        .unwrap()
        .then(() => {
          toast.success("Updated");
          setEditId(null);
          setEditValue("");
          setEditFile(null);
        })
        .catch((err) => toast.error(err));
    } else {
      dispatch(
        updateOption[selectedKey]({
          id: item._id,
          value: { [field]: editValue || item[field] },
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Updated");
          setEditId(null);
          setEditValue("");
        })
        .catch((err) => toast.error(err));
    }
  };

  // handle image change
  const handleImageChange = (e, forEdit = false) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      forEdit ? setEditFile(selectedFile) : setFile(selectedFile);
    } else {
      toast.error("Invalid image");
    }
  };

  return (
    <div className=" space-y-4 ">
      {/* header */}
      <div className="flex flex-col gap-5 md:gap-0 md:flex-row md:justify-between md:items-center shadow-md p-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl uppercase font-noto-serif font-[400] text-nowrap text-[#443627]">
            Feature :
          </h2>
          <select
            id="options"
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value)}
            className="select select-bordered uppercase font-roboto font-light"
          >
            {optionKeys.map(({ key, label }) => (
              <option className="p-3 bg-white " key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Add new */}
        <div className="flex gap-3 items-center">
          {selectedKey === "metalTone" && (
            <label htmlFor="image">
              {file ? (
                <div className="avatar flex justify-center">
                  <div className="w-8 h-8 rounded-full ring-1 ring-zinc-400 ring-offset-2 ">
                    <img src={URL.createObjectURL(file)} alt="preview" />
                  </div>
                </div>
              ) : (
                <div className="border rounded-full p-2 border-zinc-400 text-zinc-400">
                  <AiOutlinePlus />
                </div>
              )}
            </label>
          )}

          {selectedKey === "metalTone" && (
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e)}
              className="hidden"
            />
          )}

          <input
            value={input}
            name="value"
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Add ${label}`}
            className="input input-bordered"
          />
          <button
            onClick={handleAdd}
            className="btn border-[#443627] text-[#443627] hover:bg-[#443627] hover:text-white"
          >
            <FaCirclePlus />
          </button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto shadow-md">
        {loading ? (
          <p className="p-4">Loading…</p>
        ) : list?.length ? (
          <table className="table w-full">
            <thead>
              <tr>
                <th className="bg-[#443627] text-white border opacity-80">
                  No
                </th>
                <th className="bg-[#443627] text-white border opacity-80">
                  {label}
                </th>
                <th className="bg-[#443627] text-white border opacity-80">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr key={item._id}>
                  <td className="border border-zinc-300">{idx + 1}</td>
                  <td className="border border-zinc-300 capitalize py-0">
                    {editId === item._id ? (
                      <div className="flex items-center gap-2">
                        {isImage && (
                          <>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageChange(e, true)}
                            />
                            <div className="avatar">
                              <div className="w-6 h-6 rounded-full ring-1 ring-zinc-400 ring-offset-2 ">
                                <img
                                  src={
                                    editFile
                                      ? URL.createObjectURL(editFile)
                                      : item.image
                                  }
                                  alt="preview"
                                />
                              </div>
                            </div>
                          </>
                        )}
                        <input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder={item[field]}
                          className="input input-bordered input-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {item.image && (
                          <div className="avatar">
                            <div className="w-6 h-6 rounded-full ring-1 ring-zinc-400 ring-offset-2 ">
                              <img src={item.image} alt="tone" />
                            </div>
                          </div>
                        )}
                        {item[field]}
                      </div>
                    )}
                  </td>
                  <td className="border border-zinc-300 flex gap-2 items-center">
                    {editId === item._id ? (
                      <MdCheck
                        className="cursor-pointer text-green-600 text-xl"
                        onClick={() => handleUpdate(item)}
                      />
                    ) : (
                      <MdEdit
                        className="cursor-pointer text-blue-600 text-xl"
                        onClick={() => {
                          setEditId(item._id);
                          setEditValue(item[field]);
                        }}
                      />
                    )}
                    <MdDelete
                      className="cursor-pointer text-red-700 text-xl"
                      onClick={() => handleDelete(item._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 uppercase">No {label} yet.</p>
        )}
      </div>
    </div>
  );
}

export default Feature;
