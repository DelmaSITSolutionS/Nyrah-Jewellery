import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../utils/axiosInstance";
import { createOrder } from "../redux/apis/orderApi";
import { resetCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { clearCartAPI } from "../redux/apis/cartApi";

export default function RazorpayButton({ grandTotal, charges, buyNowItem = null }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false); // ⬅️ loading state

  const cartItems = buyNowItem ? [buyNowItem] : useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.user.user);

  const shippingInfo = {
    name: user?.address?.name || "",
    street: user?.address?.street || "",
    country: user?.address?.country || "India",
    state: user?.address?.state || "",
    city: user?.address?.city || "",
    pincode: user?.address?.pincode || "",
    phone: user?.address?.phone || "",
  };

  const totalAmount = Math.round(grandTotal * 100) / 100;

  const handlePayment = async () => {
    try {

      const { data: orderData } = await API.post("/payment/create-order", {
        amount: totalAmount,
      });

      const options = {
        key: "rzp_live_jj7mhiUZ7Ua602",
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Nyrah Jewellery",
        description: "Secure Payment",
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            setIsLoading(true); // ⬅️ START loading

            await API.post("/payment/verify", response);
            toast.success("Payment verified 🎉");

            const result = await dispatch(
              createOrder({
                cartItems,
                shippingInfo,
                charges,
                paymentInfo: {
                  id: response.razorpay_payment_id,
                  status: "Paid",
                  provider: "Razorpay",
                },
                totalAmount: grandTotal,
              })
            ).unwrap();

            dispatch(clearCartAPI());
            dispatch(resetCart());

            navigate(`/user/order/${result._id}`);
          } catch (err) {
            toast.error(
              err.response?.data?.message || "Payment verification failed"
            );
          } finally {
            setIsLoading(false); // ⬅️ STOP loading after success or fail
          }
        },
        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@example.com",
          contact: shippingInfo.phone || "",
        },
        theme: { color: "#8A2BE2" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to start payment");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handlePayment}
        className="btn btn-primary w-full mt-4"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : `Pay ₹${totalAmount.toLocaleString()}`}
      </button>

      {isLoading && (
        <div className="absolute inset-2 h-[100%] flex items-center justify-center bg-white/50 z-10 rounded">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      )}
    </div>
  );
}
