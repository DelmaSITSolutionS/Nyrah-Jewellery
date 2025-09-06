import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { CiFilter } from "react-icons/ci";

import assetProvider from "../../utils/assetProvider";
import notAvailable from "../../assets/gif/not-available.gif";

import {
  getGroupedProducts,
  getProductsByMain,
  getProductsByMaterialSub,
  getProductsByMaterialTag,
  getProductsBySub,
} from "../../redux/apis/productApi";
import ProductCard from "../../components/ProductCard";
import FilterDrawer from "../../components/FilterDrawer";
import SortDropdown from "../../components/SortDropdown";
import ProductSkeleton from "../../components/ProductSkeleton";
import Pagination from "../../components/Pagination";

import { getAllMaterials } from "../../redux/apis/materialApi";
import { getAllCategories } from "../../redux/apis/categoryApi";

const containerVariants = {
  show: {
    transition: {
      staggerChildren: 0.2, // delay between children
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const productVariants = {
  hidden: { opacity: 0, x: -10 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { main, sub, tag } = useParams();
  const isMaterialRoute = location.pathname.startsWith("/material");
  const navigate = useNavigate();

  const { materials } = useSelector((state) => state.material);
  const [material, setMaterial] = useState(null);

  const { categories } = useSelector((state) => state.category);
  const [category, setCategory] = useState(null);

  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("created-descending");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    list: products,
    loading,
    totalCount,
  } = useSelector((state) => state.product);
  const resultsPerPage = 12;
  const totalPages = Math.ceil(totalCount / resultsPerPage);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // 1️⃣  READ all filters – including sortBy – from the URL once on load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get("page")) || 1;
    setCurrentPage(page);

    // price
    const gte = params.get("filter.price.gte");
    const lte = params.get("filter.price.lte");
    if (gte && lte) setPriceRange([+gte, +lte]);

    // stock
    const stock = params.get("availability");
    if (stock !== null) setInStockOnly(stock === "1");

    // sort
    const sortParam = params.get("sortBy");
    if (sortParam) setSortBy(sortParam);
  }, [location.search]);

  // 2️⃣  WHENEVER any filter changes, update the URL **and** refetch products
  useEffect(() => {
    const filters = {
      priceGte: priceRange[0],
      priceLte: priceRange[1],
      availability: inStockOnly ? 1 : undefined,
      sortBy,
      page: currentPage,
    };

    /* ---------- build the query string ---------- */
    const qs = new URLSearchParams();
    if (filters.priceGte !== undefined && filters.priceGte > 0)
      qs.set("filter.price.gte", filters.priceGte);
    if (filters.priceLte !== undefined && filters.priceLte < 2000000)
      qs.set("filter.price.lte", filters.priceLte);
    if (filters.availability !== undefined)
      qs.set("availability", filters.availability);
    if (filters.sortBy && filters.sortBy != "created-descending")
      qs.set("sortBy", filters.sortBy);
    if (filters.page && filters.page != 1) qs.set("page", filters.page);
    navigate({ search: qs.toString() }, { replace: true });
    /* -------------------------------------------- */

    // dispatch API call
    if (isMaterialRoute) {
      if (sub) {
        dispatch(getProductsByMaterialSub({ tag, sub, ...filters }));
      } else {
        dispatch(getProductsByMaterialTag({ tag, ...filters }));
      }
      dispatch(getAllMaterials());
      let filtered = materials.filter((m, id) => m?.tag === tag);
      setMaterial(filtered[0]);
    } else if (main && sub) {
      dispatch(
        getProductsBySub({ mainCategory: main, subCategory: sub, ...filters })
      );
      dispatch(getAllCategories());
      let filtered = categories.filter((c, id) => c?.main === main);
      setCategory(filtered[0]);
    } else if (main) {
      dispatch(getProductsByMain({ mainCategory: main, ...filters }));
      dispatch(getAllCategories());
      let filtered = categories.filter((c, id) => c?.main === main);
      setCategory(filtered[0]);
    } else {
      dispatch(getGroupedProducts(filters));
    }

    // ⬇️   ADD sortBy & onPageChange (if you paginate) to deps
  }, [dispatch, main, sub, tag, priceRange, inStockOnly, sortBy, currentPage]);

  return (
    <AnimatePresence>
      <div
        className="min-h-screen pt-[6rem] lg:pt-[9rem] pb-7  \
    px-[1rem] md:px-[3rem]"
      >
        <div
          className="relative w-full h-[250px] md:h-[350px] lg:h-[350px] bg-cover bg-center"
          style={{ backgroundImage: `url(${assetProvider.banner.shopBanner})` }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40  flex items-end justify-end p-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="text-end text-white space-y-4 max-w-lg m-6"
            >
              <motion.h2
                variants={childVariants}
                className="text-sm font-bold uppercase tracking-widest"
              >
                Adorn Your Story
              </motion.h2>
              <motion.div
                variants={childVariants}
                className="w-10 h-0.5 bg-white ms-auto"
              />
              <motion.p
                variants={childVariants}
                className=" text-lg md:text-2xl font-[400] font-poppins tracking-widest uppercase"
              >
                Explore Timeless Treasures for Every Moment
              </motion.p>
            </motion.div>
          </div>
        </div>

        <h1 className="text-center text-[#4A4A4A] uppercase text-lg sm:text-3xl pt-6 pb-3 font-cardo font-[500] tracking-widest">
          {sub ? sub : main || tag || "shop"}
        </h1>

        {/* Drawer toggle for small screens */}
        <input id="filter-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content">
          {/* Top bar */}
          <div className="flex justify-between items-center mb-1">
            <FilterDrawer
              isOpen={drawerOpen}
              onClose={() => setDrawerOpen(false)}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
            />

            <button
              className="flex items-center cursor-pointer font-poppins text-[#4A4A4A] bg-white rounded-none font-[400] uppercase text-[.8rem] border-0 shadow-none tracking-wider"
              onClick={() => setDrawerOpen(true)}
            >
              <CiFilter className="mr-1" /> Filters
            </button>

            <div className="flex gap-1.5 items-center">
              <p className="font-poppins font-[400] text-[.8rem] uppercase tracking-wider text-[#4A4A4A]">
                results <span>({totalCount})</span>
              </p>
              <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {isMaterialRoute
              ? material?.sub?.map((m, id) => (
                  <Link
                    key={`material-${id}`}
                    to={`/material/${tag}/${m}`}
                    className={`badge rounded-xs badge-md ${
                      m === sub ? "badge-neutral" : "badge-soft"
                    } capitalize`}
                  >
                    {m}
                  </Link>
                ))
              : main &&
                category?.sub?.map((c, id) => (
                  <Link
                    key={`category-${id}`}
                    to={`/product/${main}/${c}`}
                    className={`badge rounded-xs badge-md ${
                      c === sub ? "badge-neutral" : "badge-soft"
                    } capitalize`}
                  >
                    {c}
                  </Link>
                ))}
          </div>
          {/* Product Grid */}
          {loading ? (
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))}
            </div>
          ) : products.length !== 0 ? (
            <motion.div
              className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {products.map((product) => (
                <motion.div key={product._id} variants={productVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="h-[60vh] flex flex-col gap-3 items-center justify-center">
              <img className="w-16" src={notAvailable} alt="not-availbe" />
              <p
                className="uppercase font-cardo text-xl font-[300] tracking-wider"
                style={{ wordSpacing: ".3rem" }}
              >
                Items not found
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-10 flex justify-center font-cardo font font-light">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                // update page in your state or Redux
                dispatch(setCurrentPage(page));
              }}
            />
          </div>
        </div>

        {/* Drawer sidebar content */}
      </div>
    </AnimatePresence>
  );
};

export default Shop;
