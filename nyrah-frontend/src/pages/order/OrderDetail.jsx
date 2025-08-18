// src/pages/order/OrderDetail.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../../redux/apis/orderApi";
import { FaBoxesPacking } from "react-icons/fa6";
import { FaShippingFast } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { MdClose } from "react-icons/md";

/* ——————————————————————————————————————————————— */
/* Small helpers */
/* ——————————————————————————————————————————————— */
const Row = ({ left, right, bold }) => (
  <div className={`flex justify-between ${bold && "font-semibold"}`}>
    <span>{left}</span>
    <span className="whitespace-nowrap">₹ {right.toLocaleString()}</span>
  </div>
);

export default function OrderDetail({ mode = "user" }) {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedOrder, loading, error } = useSelector((s) => s.order);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  if (loading || !selectedOrder)
    return <p className="pt-[6rem] text-center">Loading order…</p>;

  if (error)
    return <p className="pt-[6rem] text-center text-red-500">❌ {error}</p>;

  const {
    _id,
    status,
    statusMessage,
    createdAt,
    shippedAt,
    deliveredAt,
    shippingInfo,
    charges,
    items,
    totalAmount,
    paymentInfo,
  } = selectedOrder;

  const sub = items.reduce((t, it) => t + it.finalPrice * it.quantity, 0);

  return (
    <div
      className={`px-4 md:px-8  ${
        mode === "user" ? "md:py-[9rem] py-[6rem]":"py-6"
      } max-w-5xl mx-auto font-roboto space-y-8`}
    >
      {/* HEADER */}
      <header className="space-y-1">
        <h1 className="text-2xl font-cardo font-semibold">
          Order&nbsp;#{_id.slice(-6).toUpperCase()}
        </h1>
        <p className="text-sm font-poppins text-gray-600">
          Placed on {new Date(createdAt).toLocaleString()}
        </p>
        <ul className="steps w-full py-4">
          <li
            className={`step text-sm tracking-wider ${
              (status === "Processing" ||
                status === "Shipped" ||
                status === "Delivered" ||
                status === "Cancelled") &&
              "step-neutral"
            }`}
          >
            <span className="step-icon">
              <FaBoxesPacking />
            </span>
            Processing
            {statusMessage && status === "Processing" && (
              <p className="text-xs text-gray-500 italic">{statusMessage}</p>
            )}
          </li>
          <li
            className={`step text-sm tracking-wider ${
              (status === "Shipped" ||
                status === "Delivered" ||
                status === "Cancelled") &&
              "step-neutral"
            }`}
          >
            <span className="step-icon">
              <FaShippingFast />
            </span>
            Shipped
            {statusMessage && status === "Shipped" && (
              <p className="text-xs text-gray-500 italic">{statusMessage}</p>
            )}
          </li>
          <li
            className={`step text-sm tracking-wider ${
              status === "Delivered" && "step-neutral"
            }`}
          >
            <span className="step-icon">
              <GiCheckMark />
            </span>
            Delivered
            {statusMessage && status === "Delivered" && (
              <p className="text-xs text-gray-500 italic">{statusMessage}</p>
            )}
          </li>
          {status === "Cancelled" && (
            <li
              className={`step text-sm tracking-wider ${
                status === "Cancelled" && "step-neutral"
              }`}
            >
              <span className="step-icon">
                <MdClose />
              </span>
              Cancelled
              {statusMessage && status === "Cancelled" && (
                <p className="text-xs text-gray-500 italic">{statusMessage}</p>
              )}
            </li>
          )}
        </ul>
      </header>

      {/* TIMELINE */}
      <section className="text-xs text-gray-500">
        {shippedAt && <p>🚚 Shipped: {new Date(shippedAt).toLocaleString()}</p>}
        {deliveredAt && (
          <p>📦 Delivered: {new Date(deliveredAt).toLocaleString()}</p>
        )}
      </section>

      {/* ITEMS */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium uppercase font-cardo">Items</h2>
        {items.map((it) => (
          <article
            key={it._id}
            className="flex gap-4 p-4 border border-[#dddddd] bg-base-100"
          >
            <img
              src={it.product.images?.[0]}
              alt={it.product.name}
              className="w-20 h-20 object-cover"
            />
            <div className="flex-1 text-sm space-y-3">
              <h3 className="tracking-wider font-cardo uppercase">
                {it.product.name}
              </h3>

              <p>
                <strong>SKU : </strong>
                {it.product.productGroup}
              </p>

              {it.customizations && (
                <ul className="text-gray-600 space-y-1 font-poppins text-sm">
                  {Object.entries(it.customizations).map(([k, v]) => (
                    <li key={k}>
                      <span className="capitalize text-black font-medium">
                        {k}
                      </span>{" "}
                      :{" "}
                      <span className="text-gray-800">
                        {typeof v === "object" ? v.value : v}
                      </span>
                      {mode === "admin" &&
                        typeof v === "object" &&
                        v.price > 0 && (
                          <span className="ml-2 text-xs text-green-600">
                            (+₹{v.price})
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              )}

              {mode === "admin" && (
                <p className="text-xs  text-gray-700">
                  Base: ₹
                  {(it.finalPrice - it.customizationPrice).toLocaleString()} |{" "}
                  Custom: ₹{it.customizationPrice.toLocaleString()}
                </p>
              )}

              <p className="font-poppins">
                Qty {it.quantity} × ₹ {it.finalPrice} ={" "}
                <strong>
                  ₹ {(it.finalPrice * it.quantity).toLocaleString()}
                </strong>
              </p>
            </div>
          </article>
        ))}
      </section>

      {/* ADDRESS */}
      <section className="border border-[#dddddd] font-poppins p-4 bg-base-100">
        <h2 className="text-lg font-semibold mb-2 font-cardo tracking-wider">
          Shipping Address
        </h2>
        <div className="text-sm leading-6">
          <p>{shippingInfo.name}</p>
          <p>{shippingInfo.street}</p>
          <p>
            {shippingInfo.city} – {shippingInfo.pincode}
          </p>
          <p>
            {shippingInfo.state}, {shippingInfo.country}
          </p>
          <p>📞 {shippingInfo.phone}</p>
        </div>
      </section>

      {/* PAYMENT SUMMARY */}
      <section className="border border-[#dddddd] font-poppins p-4 bg-base-100 space-y-2 text-sm">
        <h2 className="text-lg font-medium mb-2">Payment Summary</h2>
        <Row left="Subtotal" right={sub} />
        <Row left="GST" right={charges.gst || 0} />
        <Row left="Shipping" right={charges.shipping || 0} />
        {charges.engraving != 0 && (
          <Row left="Engraving" right={charges.engraving} />
        )}
        {charges.hallmarking != 0 && (
          <Row left="Hallmarking" right={charges.hallmarking} />
        )}
        {charges.specialRequest != 0 && (
          <Row left="Special Request" right={charges.specialRequest} />
        )}

        <Row left="Total Amount" right={totalAmount} bold />
      </section>

      {/* PAYMENT INFO (only admin) */}
      {mode === "admin" ||
        (paymentInfo && (
          <section className="border p-4 bg-base-100 space-y-1 text-sm">
            <h2 className="text-lg font-medium mb-2">Payment Info</h2>
            <p>
              <strong>Method:</strong> {paymentInfo?.provider || "—"}
            </p>
            <p>
              <strong>Status:</strong> {paymentInfo?.status || "—"}
            </p>
            <p>
              <strong>Payment ID:</strong> {paymentInfo?.id || "—"}
            </p>
          </section>
        ))}
    </div>
  );
}
