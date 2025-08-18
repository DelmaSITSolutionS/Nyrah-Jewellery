import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCirclePlus } from "react-icons/fa6";
import { AiOutlinePlus } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  createOption,
  deleteOption,
  getAllOptions,
} from "../../redux/apis/optionApi";
import { MdDelete } from "react-icons/md";

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
  const [input, setInput] = useState("".toLocaleLowerCase());
  const [file, setFile] = useState(null);

  /* grab slice */
  const slice = useSelector((s) => s.options);
  const { list, loading, error } = slice[selectedKey] || {};

  /* find field for current key */
  const { field, label, isImage } =
    optionKeys.find((o) => o.key === selectedKey) || {};

  /* ── fetch on key change ─────────────────────────── */
  useEffect(() => {
    dispatch(getAllOptions[selectedKey]()); // e.g. getAllOptions.ringSize()
  }, [dispatch, selectedKey]);

  /* ── add new value ──────────────────────────────── */
  const handleAdd = () => {
    if (!input.trim()) return toast.error("Value required");

    let value;

    if (isImage) {
      if (!file) return toast.error("Select image");
      const formData = new FormData();
      formData.append("name", input.toLowerCase()); // name is expected for metalTone
      formData.append("image", file);
      value = formData;
    } else {
      value = input.toLowerCase();
    }

    dispatch(createOption[selectedKey](value)) // e.g. createOption.ringSize("7")
      .unwrap()
      .then(() => {
        toast.success(`${label} added`);
        setInput("");
        setFile();
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

  // handle image change
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile); // ✅ store actual File object
    } else {
      setFile(null);
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

        <div className="flex gap-3 items-center">
          {selectedKey === "metalTone" &&<label htmlFor="image">
            {file ? (
              <div className="avatar flex justify-center">
                <div className=" ring-offset-base-100 w-8 h-8 rounded-full ring-1 ring-zinc-400 ring-offset-2 ">
                  <img src={URL.createObjectURL(file)} />
                </div>
              </div>
            ) : (
              <div className="border rounded-full p-2 border-zinc-400 text-zinc-400">
                <AiOutlinePlus />
              </div>
            )}
          </label>}

          {selectedKey === "metalTone" &&<input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-input file-input-bordered file-input-sm w-full max-w-xs h-10"
          />}

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
                  <td className="border border-zinc-300 capitalize">
                    {item["image"] && (
                      <div className="avatar me-3">
                        <div className=" ring-offset-base-100 w-6 h-6 rounded-full ring-1 ring-zinc-400 ring-offset-2 ">
                          <img src={item["image"]} />
                        </div>
                      </div>
                    )}
                    {item[field]}
                  </td>
                  <td className="border border-zinc-300">
                    <div
                      className="tooltip tooltip-left text-xl"
                      data-tip="Delete"
                    >
                      <MdDelete
                        className="me-3 cursor-pointer text-red-700"
                        onClick={() => handleDelete(item._id)}
                      />
                    </div>
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
