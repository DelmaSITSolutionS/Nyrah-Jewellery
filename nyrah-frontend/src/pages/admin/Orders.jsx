import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../redux/apis/orderApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosSend } from "react-icons/io";

function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.order);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const openModal = (orderId, newStatus) => {
    setSelectedOrderId(orderId);
    setSelectedStatus(newStatus);
    setStatusMessage("");
    setModalOpen(true);
  };

  const confirmStatusChange = async () => {
    try {
      await dispatch(
        updateOrderStatus({
          orderId: selectedOrderId,
          status: selectedStatus,
          message: statusMessage,
        })
      ).unwrap();

      toast.success("Status updated successfully");
      dispatch(fetchAllOrders());
      setModalOpen(false);
    } catch (err) {
      toast.error(err || "Failed to update status");
    }
  };

  console.log(selectedStatus)

  return (
    <div className="">
      <div className="flex shadow-md p-2 justify-between items-center w-full">
        <h2 className="text-xl uppercase font-noto-serif font-[400] text-[#443627]">
          All Orders
        </h2>
      </div>

      {loading ? (
        <div className="pt-5">
          <p className="text-center mx-3">Loading...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-[#443627] text-white">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <React.Fragment key={order._id}>
                  {order.items.map((item, i) => (
                    <tr key={i} className="text-sm">
                      <td>{idx + 1}</td>
                      <td>{order._id.slice(-6).toUpperCase()}</td>
                      <td className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={item.product?.images?.[0] || "/no-img.jpg"}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover border border-zinc-300"
                        />
                        <span className="text-nowrap">{item.product?.name}</span>
                      </td>
                      <td>{item.quantity}</td>
                      <td>₹{item.finalPrice?.toLocaleString() || "-"}</td>
                      <td>
                        <select
                        id={`status ${idx}`}
                          className="select select-sm border  border-zinc-300"
                          value={order.status}
                          onChange={(e) =>
                            openModal(order._id, e.target.value)
                          }
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline btn-primary"
                          onClick={() => navigate(`/admin/order/${order._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm ms-3 btn-secondary btn-outline"
                          onClick={(e) =>
                            openModal(order._id, order.status)}
                        >
                          <IoIosSend />
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for status message */}
      {modalOpen && (
        <dialog id="status-modal" className="modal modal-open">
          <div className="modal-box w-full max-w-md">
            <h3 className="font-bold text-lg mb-2">
              Update Status to {selectedStatus}
            </h3>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Enter a message for user (optional)"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              rows={4}
            />
            <div className="modal-action">
              <button
                className="btn btn-neutral"
                onClick={confirmStatusChange}
              >
                Confirm
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Orders;
