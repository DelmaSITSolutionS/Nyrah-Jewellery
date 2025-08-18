import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/apis/orderApi";
import { useNavigate } from "react-router-dom";

export default function UserOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((s) => s.order);


  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // ⏳ Skeleton while loading
  if (loading)
    return (
      <div className="max-w-5xl min-h-screen mx-auto pt-[6rem] md:pt-[9rem] px-4 space-y-4 pb-16">
        <h1 className="text-2xl font-medium uppercase font-cardo  mb-2">My Orders</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 border shadow-sm bg-white space-y-3"
          >
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-4 w-1/2" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="skeleton w-14 h-14 rounded-md" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );

  if (error) return <p className="text-center text-red-500 pt-20">{error}</p>;

  if (!orders || orders.length === 0)
    return (
      <div className="h-screen flex justify-center items-center">
        <p className=" text-center py-20 uppercase font-cardo">No orders yet</p>
      </div>
    );

  return (
    <div className="max-w-5xl font-roboto min-h-screen mx-auto pt-[6rem] md:pt-[9rem] px-4 space-y-6 pb-16">
      <h1 className="text-2xl font-light uppercase font-cardo mb-4">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          onClick={() => navigate(`/user/order/${order._id}`)}
          className="border border-[#dddddd] hover:border-black hover:bg-base-100 hover:scale-101 font-poppins bg-white  transition cursor-pointer p-4 space-y-3 shadow-sm"
        >
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              Order ID: <strong>{order._id.slice(-6).toUpperCase()}</strong>
            </span>
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="text-sm text-gray-700">
            <strong>{order.items.length}</strong> item(s) – Total:{" "}
            <strong>₹{order.totalAmount.toLocaleString()}</strong> – Status:{" "}
            <strong>{order.status}</strong>
          </div>

          <div className="flex gap-4 overflow-x-auto pt-2 pb-1">
            {order.items.slice(0, 4).map((it, idx) => (
              <div
                key={idx}
                className="w-36 min-w-[8rem] flex flex-col gap-1 text-xs"
              >
                <img
                  src={it.product?.images?.[0] || "/no-img.jpg"}
                  alt={it.product?.name}
                  className="w-full h-20 object-cover"
                />
                <div className="font-medium truncate font-cardo uppercase">
                  {it.product?.name || "Item"}
                </div>
                <div className="text-gray-600">
                  ₹ {it.finalPrice} × {it.quantity}
                </div>
              </div>
            ))}

            {order.items.length > 4 && (
              <div className="w-20 h-20 flex items-center justify-center text-xs bg-gray-200 rounded-md">
                +{order.items.length - 4} more
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
