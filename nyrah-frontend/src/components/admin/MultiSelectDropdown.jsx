// components/MultiSelectDropdown.jsx
import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

export default function MultiSelectDropdown({
  label = "Select Items",
  options = [],
  selected = [],
  onChange,
  disabled = false,
  placeholder = "Select options...",
  name = "", // optional for forms
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const toggleOpen = () => !disabled && setOpen((prev) => !prev);

  const handleOptionClick = (value) => {
    const isSelected = selected.includes(value);
    const updated = isSelected
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(updated);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="form-control w-full relative" ref={dropdownRef}>
      {label && (
        <p className="label capitalize pb-3">
          <span className="text-black label-text" style={{ color: "#7D7D7F" }}>
            {label}
          </span>
        </p>
      )}

      <div
        tabIndex={0}
        role="button"
        className={`input input-bordered w-full min-h-[2.5rem] h-auto py-2 ps-2 pe-7 flex items-center flex-wrap gap-1 ${
          disabled ? "bg-base-200 pointer-events-none opacity-60" : ""
        }`}
        onClick={toggleOpen}
      >
        {selected?.length > 0 ? (
          selected.map((item) => (
            <span
              key={item}
              className="badge badge-md flex items-center badge-soft capitalize"
            >
              <IoClose className="cursor-pointer" onClick={() => handleOptionClick(item)} />
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
        <svg
          className="ml-auto h-5 w-5 opacity-50 absolute right-3.5 cursor-pointer"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {open && (
        <ul className="absolute mt-1 z-20 w-full bg-base-100 shadow-md border rounded max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <li className="px-4 py-2 text-gray-500 text-sm">No options</li>
          ) : (
            options.map((opt) => (
              <li
                key={opt}
                className={`px-4 py-2 cursor-pointer text-zinc-500 hover:bg-base-200 ${
                  selected.includes(opt) ? "bg-base-200 text-zinc-900 font-semibold" : ""
                }`}
                onClick={() => handleOptionClick(opt)}
              >
                {opt}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
