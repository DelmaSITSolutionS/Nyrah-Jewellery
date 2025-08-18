import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import ProductSkeleton from "../ProductSkeleton";
import { TbShoppingCartOff } from "react-icons/tb";
import { motion } from "framer-motion";
import ProductCard from "../ProductCard";
import Pagination from "../Pagination";

const SearchResultsPage = () => {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || " ");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const resultsPerPage = 12;
  const totalPages = Math.ceil(totalCount / resultsPerPage);

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    axios
      .get(`/search?q=${query}&page=${currentPage}&limit=${resultsPerPage}`)
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalCount(res.data.totalCount || 0);
      })
      .finally(() => setLoading(false));
  }, [query, currentPage]);

  return (
    <div className="min-h-screen pt-[9rem] pb-7 px-[1rem] md:px-[3rem]">
      {/* search bar  */}
      <div className="mb-4">
        <input
          type="text"
          className=""
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search`}
        />
      </div>

      {/* queary and results  */}
      <div className="flex justify-between font-roboto">
        <h1 className="text-sm font-semibold uppercase tracking-wider mb-4">
          Search results for:{" "}
          <span className="text-[#000000a3] font-medium">"{query}"</span>
        </h1>
        <p className="uppercase text-sm">Results ({totalCount})</p>
      </div>

      {/* products  */}
      {products.length === 0 && !loading ? (
        <div className="h-[60vh] flex flex-col gap-3 items-center justify-center">
          <TbShoppingCartOff className="text-4xl" />
          <p
            className="uppercase font-noto-serif text-xl font-[300] tracking-wider"
            style={{ wordSpacing: ".3rem" }}
          >
            Items not found
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading
            ? Array.from({ length: resultsPerPage }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            : products?.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              // update page in your state or Redux
              setCurrentPage(page)
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
