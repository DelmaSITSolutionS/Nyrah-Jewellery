import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VscClose } from "react-icons/vsc";
import axios from "../../utils/axiosInstance";
import { CiSearch } from "react-icons/ci";

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const productSuggetions = suggestions?.filter((s) => s?.type === "product");
  const categorySuggetions = suggestions?.filter((s) => s?.type === "category");
  const tagSuggetions = suggestions?.filter((s) => s?.type === "tags");

  useEffect(() => {
    if (query.trim()) {
      const delayDebounce = setTimeout(() => {
        axios
          .get(`/suggestions?q=${query}`)
          .then((res) => setSuggestions(res.data?.suggestions))
          .catch(() => setSuggestions([]));
      }, 300);

      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Overlay darken content */}
          <div
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={onClose}
          ></div>

          {/* Search content */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="relative z-10 w-full max-h-screen   mx-auto "
            style={{ scrollbarWidth: "none" }}
          >
            {/* Search Bar */}
            <div className="relative flex items-center gap-2 px-4 py-5 bg-[#fff8f0]">
              <CiSearch size={20} />
              <input
                type="text"
                id="search"
                placeholder="Search for products, tags or categories"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1  outline-none text-sm bg-[#fff8f0]"
                style={{ paddingRight: "40px", border: "none" }}
              />
              <button className="absolute right-7" onClick={onClose}>
                <VscClose className="cursor-pointer" size={20} />
              </button>
            </div>

            {/* Suggestions */}
            {query && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-[#fff8f0] py-6"
              >
                {suggestions.length > 0 && (
                  <div className="md:flex pb-5 gap-5 font-roboto text-[#858585]">
                    {productSuggetions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0 }}
                      >
                        <li className="px-6 py-2 uppercase text-[.7rem] text-black font-[400] tracking-wide">
                          Products
                        </li>
                        <li className="px-6 pb-2">
                          <hr />
                        </li>
                        {productSuggetions?.map((sug, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-1 py-1 px-6 cursor-pointer tracking-wider transition-colors duration-300 hover:text-black"
                            onClick={() => {
                              window.location.href = `/search?q=${encodeURIComponent(
                                sug.text
                              )}`;
                              onClose();
                            }}
                          >
                            <CiSearch size={15} />
                            <span className="text-[.7rem] font-[300] capitalize">
                              {sug.text}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                    {categorySuggetions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <li className="px-6 py-2 uppercase text-[.7rem] text-black font-[400] tracking-wide">
                          Categories
                        </li>
                        <li className="px-6 pb-2">
                          <hr />
                        </li>
                        {categorySuggetions?.map((sug, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-1 py-1 px-6 cursor-pointer tracking-wider transition-colors duration-300 hover:text-black"
                            onClick={() => {
                              window.location.href = `/search?q=${encodeURIComponent(
                                sug.text
                              )}`;
                              onClose();
                            }}
                          >
                            <CiSearch size={15} />
                            <span className="text-[.7rem] font-[300] capitalize">
                              {sug.text}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                    {tagSuggetions.length > 0 && (
                      <motion.ul
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <li className="px-6 py-2 uppercase text-[.7rem] text-black font-[400] tracking-wide">
                          tags
                        </li>
                        <li className="px-6 pb-2">
                          <hr />
                        </li>
                        {tagSuggetions?.map((sug, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-1 py-1 px-6 cursor-pointer tracking-wider transition-colors duration-300 hover:text-black"
                            onClick={() => {
                              window.location.href = `/search?q=${encodeURIComponent(
                                sug.text
                              )}`;
                              onClose();
                            }}
                          >
                            <CiSearch size={15} />
                            <span className="text-[.7rem] font-[300] capitalize">
                              {sug.text}
                            </span>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </div>
                )}
                <motion.a
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="px-4 py-2 cursor-pointer uppercase font-roboto text-sm font-light tracking-widest hover:bg-black hover:text-white duration-300 transition border mx-6"
                  href={`/search?q=${query}`}
                >
                  Search for : <strong>{query}</strong>
                </motion.a>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
