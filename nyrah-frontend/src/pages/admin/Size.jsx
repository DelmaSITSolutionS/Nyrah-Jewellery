import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCirclePlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  createOption,
  deleteOption,
  getAllOptions,
  updateOption,   // ✅ import update
} from "../../redux/apis/optionApi";
import { MdDelete, MdEdit, MdCheck } from "react-icons/md";

const optionKeys = [
  { label: "Ring Size", key: "ringSize", field: "size" },
  { label: "Necklace Size", key: "necklaceSize", field: "necklaceSize" },
  { label: "Pendant Size", key: "pendantSize", field: "pendantsize" },
  { label: "Earring Size", key: "earringSize", field: "earringsize" },
  { label: "Chain Length", key: "chainLength", field: "length" },
  { label: "Bracelet Size", key: "braceletSize", field: "braceletSize" },
  { label: "Diamond Size", key: "diamondSize", field: "diamondSize" },
];

function Size() {
  const dispatch = useDispatch();
  const [selectedKey, setSelectedKey] = useState("ringSize");
  const [input, setInput] = useState("");

  // update state
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");

  /* grab slice */
  const slice = useSelector((s) => s.options);
  const { list, loading, error } = slice[selectedKey] || {};

  /* find field for current key */
  const { field, label } = optionKeys.find((o) => o.key === selectedKey) || {};

  /* ── fetch on key change ─────────────────────────── */
  useEffect(() => {
    dispatch(getAllOptions[selectedKey]());
  }, [dispatch, selectedKey]);

  /* ── add new value ──────────────────────────────── */
  const handleAdd = () => {
    if (!input.trim()) return toast.error("Value required");

    dispatch(createOption[selectedKey](input))
      .unwrap()
      .then(() => {
        toast.success(`${label} added`);
        setInput("");
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

  /* ── start editing ──────────────────────────────── */
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditValue(item[field]);
  };

  /* ── save update ───────────────────────────────── */
  const handleUpdate = (id) => {
    if (!editValue.trim()) return toast.error("Value required");

    dispatch(updateOption[selectedKey]({ id, value: { [field]: editValue } }))
      .unwrap()
      .then(() => {
        toast.success(`${label} updated`);
        setEditId(null);
        setEditValue("");
      })
      .catch((err) => toast.error(err));
  };

  return (
    <div className=" space-y-4 ">
      {/* header */}
      <div className="flex flex-col gap-5 md:gap-0 md:flex-row md:justify-between md:items-center shadow-md p-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl uppercase font-noto-serif font-[400] text-nowrap text-[#443627]">
            Size & Length :
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

        <div className="flex gap-2">
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

                  {/* editable cell */}
                  <td className="border border-zinc-300 py-0">
                    {editId === item._id ? (
                      <input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="input w-full"
                      />
                    ) : (
                      item[field]
                    )}
                  </td>

                  {/* actions */}
                  <td className="border border-zinc-300 flex gap-3">
                    {editId === item._id ? (
                      <MdCheck
                        className="cursor-pointer text-green-700 text-xl"
                        onClick={() => handleUpdate(item._id)}
                        title="Save"
                      />
                    ) : (
                      <MdEdit
                        className="cursor-pointer text-blue-600 text-xl"
                        onClick={() => handleEdit(item)}
                        title="Edit"
                      />
                    )}

                    <MdDelete
                      className="cursor-pointer text-red-700 text-xl"
                      onClick={() => handleDelete(item._id)}
                      title="Delete"
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

export default Size;
