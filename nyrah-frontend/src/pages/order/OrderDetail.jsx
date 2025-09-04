// src/pages/order/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../../redux/apis/orderApi";
import { FaBoxesPacking } from "react-icons/fa6";
import { FaShippingFast } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import currencyConverter from "../../utils/currencyConverter";

const Row = ({ left, right, bold, symbol }) => (
  <div className={`flex justify-between ${bold ? "font-semibold" : ""}`}>
    <span>{left}</span>
    <span className="whitespace-nowrap">
      {symbol} {right != null ? right.toLocaleString() : "-"}
    </span>
  </div>
);

export default function OrderDetail({ mode = "user" }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedOrder, loading, error } = useSelector((s) => s.order);

  const [converted, setConverted] = useState({
    subtotal: 0,
    gst: 0,
    shipping: 0,
    engraving: 0,
    hallmarking: 0,
    specialR: 0,
    items: {},
    customizations: {},
  });

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  // Convert all prices once order is loaded
  useEffect(() => {
    if (!selectedOrder || !selectedOrder.currency) return;
    let active = true;

    const convertAll = async () => {
      try {
        const { currency, items = [], charges = {} } = selectedOrder;

        // Convert item totals
        const itemConversions = {};
        const customizationConversions = {};
        await Promise.all(
          items.map(async (it) => {
            const itemTotal = await currencyConverter(
              null,
              it.finalPrice * it.quantity,
              currency
            );
            itemConversions[it.product._id || it.productId] = itemTotal;

            // Convert customizations individually
            if (it.customizations) {
              customizationConversions[it._id] = {};
              for (const [k, v] of Object.entries(it.customizations)) {
                if (typeof v === "object" && v.price > 0) {
                  customizationConversions[it._id][k] = await currencyConverter(
                    null,
                    v.price,
                    currency
                  );
                }
              }
            }
          })
        );

        // Convert subtotal & charges
        const subtotalRaw = items.reduce(
          (t, it) => t + it.finalPrice * it.quantity,
          0
        );

        const [
          subtotalC,
          gstC,
          shippingC,
          engravingC,
          hallmarkingC,
          specialRC,
        ] = await Promise.all([
          currencyConverter(null, subtotalRaw,currency),
          currencyConverter(null, charges.gst || 0,currency),
          currencyConverter(null, charges.shipping || 0,currency),
          currencyConverter(null, charges.engraving || 0,currency),
          currencyConverter(null, charges.hallmarking || 0,currency),
          currencyConverter(null, charges.specialRequest || 0,currency),
        ]);

   

        if (active) {
          setConverted({
            subtotal: subtotalC,
            gst: gstC,
            shipping: shippingC,
            engraving: engravingC,
            hallmarking: hallmarkingC,
            specialR: specialRC,
            items: itemConversions,
            customizations: customizationConversions,
          });
        }
      } catch (err) {
        console.error("Conversion failed:", err);
      }
    };

    convertAll();
    return () => {
      active = false;
    };
  }, [selectedOrder]);


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
    symbol,
    paymentInfo,
  } = selectedOrder;

  return (
    <div
      className={`px-4 md:px-8 ${
        mode === "user" ? "md:py-[9rem] py-[6rem]" : "py-6"
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
              ["Processing", "Shipped", "Delivered", "Cancelled"].includes(status)
                ? "step-neutral"
                : ""
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
              ["Shipped", "Delivered", "Cancelled"].includes(status)
                ? "step-neutral"
                : ""
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
          <li className={`step text-sm tracking-wider ${status === "Delivered" ? "step-neutral" : ""}`}>
            <span className="step-icon">
              <GiCheckMark />
            </span>
            Delivered
            {statusMessage && status === "Delivered" && (
              <p className="text-xs text-gray-500 italic">{statusMessage}</p>
            )}
          </li>
          {status === "Cancelled" && (
            <li className="step text-sm tracking-wider step-neutral">
              <span className="step-icon">
                <MdClose />
              </span>
              Cancelled
              {statusMessage && (
                <p className="text-xs text-gray-500 italic">{statusMessage}</p>
              )}
            </li>
          )}
        </ul>
      </header>

      {/* TIMELINE */}
      <section className="text-xs text-gray-500">
        {shippedAt && <p>🚚 Shipped: {new Date(shippedAt).toLocaleString()}</p>}
        {deliveredAt && <p>📦 Delivered: {new Date(deliveredAt).toLocaleString()}</p>}
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
              <h3 className="tracking-wider font-cardo uppercase">{it.product.name}</h3>
              <p><strong>SKU : </strong>{it.product.productGroup}</p>

              {it.customizations && (
                <ul className="text-gray-600 space-y-1 font-poppins text-sm">
                  {Object.entries(it.customizations).map(([k, v]) => (
                    <li key={k}>
                      <span className="capitalize text-black font-medium">{k}</span> :{" "}
                      <span className="text-gray-800">{typeof v === "object" ? v.value : v}</span>
                      {mode === "admin" &&
                        typeof v === "object" &&
                        v.price > 0 && (
                          <span className="ml-2 text-xs text-green-600">
                            (+{symbol}
                            {converted.customizations[it._id]?.[k]?.toLocaleString() || v.price.toLocaleString()})
                          </span>
                        )}
                    </li>
                  ))}
                </ul>
              )}

              {mode === "admin" && (
                <p className="text-xs text-gray-700">
                  Base: {symbol}
                  {converted.items[it.product._id || it.productId]
                    ? (converted.items[it.product._id || it.productId] - (it.customizationPrice || 0)).toLocaleString()
                    : (it.finalPrice - it.customizationPrice).toLocaleString()} |{" "}
                  Custom: {symbol}
                  {it.customizationPrice && converted.customizations[it._id]
                    ? Object.values(converted.customizations[it._id]).reduce((a, b) => a + b, 0).toLocaleString()
                    : (it.customizationPrice || 0).toLocaleString()}
                </p>
              )}

              <p className="font-poppins">
                Qty {it.quantity} × {symbol} {it.finalPrice} ={" "}
                <strong>
                  {symbol}
                  {converted.items[it.product._id || it.productId]?.toLocaleString() ||
                    (it.finalPrice * it.quantity).toLocaleString()}
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
          <p>{shippingInfo.city} – {shippingInfo.pincode}</p>
          <p>{shippingInfo.state}, {shippingInfo.country}</p>
          <p>📞 {shippingInfo.phone}</p>
        </div>
      </section>

      {/* PAYMENT SUMMARY */}
      <section className="border border-[#dddddd] font-poppins p-4 bg-base-100 space-y-2 text-sm">
        <h2 className="text-lg font-medium mb-2">Payment Summary</h2>
        <Row left="Subtotal" right={converted.subtotal} symbol={symbol} />
        <Row left="GST" right={converted.gst} symbol={symbol} />
        <Row left="Shipping" right={converted.shipping} symbol={symbol} />
        {converted.engraving !== 0 && <Row left="Engraving" right={converted.engraving} symbol={symbol} />}
        {converted.hallmarking !== 0 && <Row left="Hallmarking" right={converted.hallmarking} symbol={symbol} />}
        {converted.specialR !== 0 && <Row left="Special Request" right={converted.specialR} symbol={symbol} />}

        {/* grandTotal stays as-is */}
        <Row left="Total Amount" right={totalAmount} bold symbol={symbol} />
      </section>

      {/* PAYMENT INFO */}
      {mode === "admin" || (paymentInfo && (
        <section className="border p-4 bg-base-100 space-y-1 text-sm">
          <h2 className="text-lg font-medium mb-2">Payment Info</h2>
          <p><strong>Method:</strong> {paymentInfo?.provider || "—"}</p>
          <p><strong>Status:</strong> {paymentInfo?.status || "—"}</p>
          <p><strong>Payment ID:</strong> {paymentInfo?.id || "—"}</p>
        </section>
      ))}
    </div>
  );
}
