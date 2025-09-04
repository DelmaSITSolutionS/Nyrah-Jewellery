import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import API from "../utils/axiosInstance";
import { createOrder } from "../redux/apis/orderApi";
import { resetCart } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { clearCartAPI } from "../redux/apis/cartApi";

export default function PaypalButton({ grandTotal, charges, buyNowItem = null }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paypalRef = useRef();

  const cartItems = buyNowItem ? [buyNowItem] : useSelector((s) => s.cart.items);
  const user = useSelector((s) => s.user.user);
  const selectedCurrency = useSelector((s) => s.currency.selected);
  const currencyCode = selectedCurrency ? Object.keys(selectedCurrency.currencies)[0] : "USD";
  const totalAmount = Math.round(grandTotal * 100) / 100;

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=${currencyCode}`;
    script.addEventListener("load", () => {
      window.paypal.Buttons({
        createOrder: async (_, actions) => {
          // call your backend to create order
          const { data: order } = await API.post("/payment/paypal/create-order", {
            amount: totalAmount,
            currency: currencyCode,
          });
          return order.id; // use returned order ID
        },
        onApprove: async (data, actions) => {
          // capture order on backend
          const { data: capture } = await API.post("/payment/paypal/capture-order", {
            orderID: data.orderID,
          });

          if (capture.status !== "COMPLETED") {
            toast.error("Payment not completed");
            return;
          }
       
          // create local order in DB
          const result = await dispatch(createOrder({
            cartItems,
            symbol:selectedCurrency?.currencies[currencyCode].symbol,
            currency:currencyCode,
            shippingInfo: {
              name: user?.address?.name,
              street: user?.address?.street,
              country: user?.address?.country,
              state: user?.address?.state,
              city: user?.address?.city,
              pincode: user?.address?.pincode,
              phone: user?.address?.phone,
            },
            charges,
            paymentInfo: {
              id: capture.id,
              status: "Paid",
              provider: "PayPal",
            },
            totalAmount: grandTotal,
          })).unwrap();

          dispatch(clearCartAPI());
          dispatch(resetCart());
          toast.success("Payment successful 🎉");
          navigate(`/user/order/${result._id}`);
        },
        onError: (err) => {
          console.error(err);
          toast.error("PayPal payment failed");
        },
      }).render(paypalRef.current);
    });
    document.body.appendChild(script);
  }, [totalAmount, currencyCode]);

  return <div ref={paypalRef} />;
}
