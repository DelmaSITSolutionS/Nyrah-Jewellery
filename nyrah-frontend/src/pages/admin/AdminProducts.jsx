import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupedProducts,
  deleteProduct,
  getProductGroupVariants,
  getProductsByMain,
} from "../../redux/apis/productApi";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { getAllCategories } from "../../redux/apis/categoryApi";
import ProductForm from "../../components/admin/ProductForm";
import { getAllMaterials } from "../../redux/apis/materialApi";
import Pagination from "../../components/Pagination";

const AdminProductSkeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3">
        <div className="h-4 w-10 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-10 w-10 rounded bg-gray-300" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-12 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </td>
      <td className="px-4 py-3">
        <div className="h-4 w-28 bg-gray-200 rounded" />
      </td>
    </tr>
  );
};

function AdminProducts() {
  const dispatch = useDispatch();
  const [initial, setInitial] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedGroupId, setExpandedGroupId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({
    id: null,
    groupId: null,
    isGroupHeader: false,
  });

  const {
    list: products,
    groupVariants,
    loading,
    error,
    totalCount,
  } = useSelector((state) => state.product);
  const { categories } = useSelector((state) => state.category);
  const { materials } = useSelector((state) => state.material);

  const resultsPerPage = 12;
  const totalPages = Math.ceil(totalCount / resultsPerPage);

  useEffect(() => {
    if (category === "all") {
      dispatch(getGroupedProducts({ page: currentPage }));
    } else {
      dispatch(
        getProductsByMain({ mainCategory: category, page: currentPage })
      );
    }
    dispatch(getAllCategories());
    dispatch(getAllMaterials());
  }, [dispatch, currentPage, category]);

  const handleDelete = (id, groupId = null, isGroupHeader = false) => {
    dispatch(deleteProduct(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Product deleted");

        // Close variant panel only if the deleted product is the group header
        if (id === expandedGroupId) {
          setExpandedGroupId(null);
        }

        // Re-fetch logic
        const refetchVariants = groupId
          ? dispatch(getProductGroupVariants({ groupId }))
          : Promise.resolve();

        refetchVariants.then(() => {
          if (category === "all") {
            dispatch(getGroupedProducts({ page: currentPage }));
          } else {
            dispatch(
              getProductsByMain({ mainCategory: category, page: currentPage })
            );
          }
        });
      } else {
        toast.error(res.payload);
      }

      // Reset confirmation state
      setShowConfirmModal(false);
      setDeleteTarget({ id: null, groupId: null, isGroupHeader: false });
    });
  };

  const toggleVariants = (groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null);
    } else {
      setExpandedGroupId(groupId);
      dispatch(getProductGroupVariants({ groupId }));
    }
  };

  const openDrawer = (product = null) => {
    setInitial(product);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setInitial(null);
    setIsDrawerOpen(false);
  };

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => (
      <option key={cat._id} value={cat.main}>
        {cat.main}
      </option>
    ));
  }, [categories]);

  return (
    <div className="relative">
      <div className="flex gap-2 flex-col sm:flex-row shadow-md p-2 justify-between items-center w-full">
        <h2 className="text-xl uppercase font-noto-serif font-[400] text-[#443627]">
          Products
        </h2>

        <div className="flex gap-1.5 items-center font-roboto">
          <label
            htmlFor="category"
            className="text-nowrap font-poppins uppercase text-sm font-[500]"
          >
            Sort By :
          </label>
          <select
            id="category"
            defaultValue="all"
            className="select capitalize font-light outline-none"
            style={{ outline: "none" }}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="all">All</option>
            {categoryOptions}
          </select>
        </div>

        <button
          className="btn bg-[#EFDCAB] capitalize font-roboto font-light tracking-wider flex items-center"
          onClick={() => openDrawer()}
        >
          <FaCirclePlus className="text-[.8rem]" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="flex justify-end px-2">
          <p className="text-sm my-5  font-poppins font-light">
            <strong className="uppercase font-poppins font-[500]">
              Total :{" "}
            </strong>
            <span className="p-2 rounded border ms-1 border-[#cacaca]">
              {totalCount}
            </span>
          </p>
        </div>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-[#00000070] bg-opacity-40 flex justify-center items-center z-50 font-roboto">
            <div className="bg-white py-4 px-4 rounded shadow-xl w-[90%] max-w-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold ">Confirm Deletion</h2>
                <IoClose
                  onClick={() => {
                    setShowConfirmModal(false);
                    setDeleteTarget({
                      id: null,
                      groupId: null,
                      isGroupHeader: false,
                    });
                  }}
                  className="text-lg cursor-pointer"
                />
              </div>
              <p className="mb-8 tracking-wide text-sm">
                Are you sure you want to delete this product?
                {deleteTarget.isGroupHeader && (
                  <span className="block text-sm text-red-500 mt-2">
                    This is the group’s main product. Variants will be
                    restructured.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-sm uppercase rounded-xs"
                  onClick={() => {
                    setShowConfirmModal(false);
                    setDeleteTarget({
                      id: null,
                      groupId: null,
                      isGroupHeader: false,
                    });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-error text-white uppercase rounded-xs"
                  onClick={() =>
                    handleDelete(
                      deleteTarget.id,
                      deleteTarget.groupId,
                      deleteTarget.isGroupHeader
                    )
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        <table className="table">
          <thead>
            <tr className="bg-[#443627] text-white">
              <th className="opacity-80">No.</th>
              <th className="opacity-80">Image</th>
              <th className="opacity-80">Name</th>
              <th className="opacity-80">Product Group</th>
              <th className="opacity-80">Category</th>
              <th className="opacity-80 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <AdminProductSkeleton key={idx} />
              ))
            ) : products?.length > 0 ? (
              products.map((group, idx) => (
                <React.Fragment key={group._id}>
                  <tr className="capitalize text-nowrap">
                    <td>{(currentPage - 1) * resultsPerPage + (idx + 1)}</td>
                    <td>
                      <img
                        src={
                          Array.isArray(group.images) && group.images.length > 0
                            ? group.images[0]
                            : "https://via.placeholder.com/60"
                        }
                        alt="image"
                        className="w-14 h-14 rounded object-cover"
                      />
                    </td>
                    <td>{group.name}</td>
                    <td>{group.productGroup}</td>
                    <td>{group.category.main}</td>
                    <td>
                      <div className="flex items-center gap-3 justify-center">
                        <button
                          title="delete"
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => {
                            setDeleteTarget({
                              id: group._id,
                              groupId: group.productGroup,
                              isGroupHeader: true,
                            });
                            setShowConfirmModal(true);
                          }}
                        >
                          <MdDelete />
                        </button>
                        <button
                          title="show variants"
                          className="btn btn-sm btn-outline"
                          onClick={() => toggleVariants(group.productGroup)}
                        >
                          {expandedGroupId === group.productGroup
                            ? "Hide"
                            : "Variants"}
                        </button>
                        <button
                          title="edit"
                          className="btn btn-sm btn-outline btn-success"
                          onClick={() => openDrawer(group)}
                        >
                          <MdEdit />
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedGroupId === group.productGroup && (
                    <>
                      {Array.isArray(groupVariants?.variants) &&
                      groupVariants.variants.length > 1 ? (
                        groupVariants.variants.slice(1).map((v, vi) => (
                          <tr
                            key={v._id}
                            className="bg-base-300 capitalize text-nowrap"
                          >
                            <td>{`${
                              (currentPage - 1) * resultsPerPage + (idx + 1)
                            }.${vi + 2}`}</td>
                            <td>
                              <img
                                src={
                                  Array.isArray(v.images) && v.images.length > 0
                                    ? v.images[0]
                                    : "https://via.placeholder.com/60"
                                }
                                alt="variant"
                                className="w-12 h-12 rounded object-cover"
                              />
                            </td>
                            <td>{v.name}</td>
                            <td>{v.productGroup}</td>
                            <td>{v.category.main}</td>
                            <td>
                              <div className="flex items-center gap-3 justify-center">
                                <button
                                  className="btn btn-sm btn-outline btn-error"
                                  onClick={() => {
                                    setDeleteTarget({
                                      id: v._id,
                                      groupId: group.productGroup,
                                      isGroupHeader: false,
                                    });
                                    setShowConfirmModal(true);
                                  }}
                                >
                                  <MdDelete />
                                </button>
                                <button
                                  className="btn btn-sm btn-outline btn-success"
                                  onClick={() => openDrawer(v)}
                                >
                                  <MdEdit />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-base-300">
                          <td colSpan="6" className="text-center py-4">
                            No additional variants.
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="my-5 flex justify-center font-cardo font-light">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 bg-[#00000070] bg-opacity-40 z-40 flex justify-end">
          <div className="bg-base-200 w-[24rem] h-full p-4 pt-10 relative overflow-y-auto">
            <button
              className="btn btn-sm btn-error absolute top-3 right-4"
              onClick={closeDrawer}
            >
              <IoClose className="text-xl cursor-pointer opacity-50" />
            </button>
            <ProductForm
              initial={initial}
              categories={categories}
              materials={materials}
              onSuccess={() => {
                closeDrawer();
                setExpandedGroupId(null);
                if (category === "all") {
                  dispatch(getGroupedProducts({ page: currentPage }));
                } else {
                  dispatch(
                    getProductsByMain({
                      mainCategory: category,
                      page: currentPage,
                    })
                  );
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProducts;
