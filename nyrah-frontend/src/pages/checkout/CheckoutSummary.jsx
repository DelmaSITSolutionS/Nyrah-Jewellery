//  src/pages/checkout/CheckoutSummary.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCharges } from "../../redux/apis/chargesApi";
import AddressSection from "../../components/AddressSection";
import RazorpayButton from "../../components/RazorpayButton";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../utils/axiosInstance";

export default function CheckoutSummary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: charges, loading: chargesLoading } = useSelector(
    (s) => s.charges
  );

  const location = useLocation();
  const [buyNowItem, setBuyNowItem] = useState(null);

  const user = useSelector((state) => state.user.user);
  const address = user?.address;
  const isAddressComplete =
    address && Object.values(address).every((val) => val?.trim?.() !== "");

  const cartItems = useSelector((s) => s.cart?.items || []);
  const items = buyNowItem ? [buyNowItem] : cartItems;

  useEffect(() => {
    const qp = new URLSearchParams(location.search);
    if (qp.get("buynow") === "true") {
      const item = JSON.parse(sessionStorage.getItem("buyNowItem"));
      if (item) {
        setBuyNowItem(item);
        // 🔁 Fetch correct final price from server
        (async () => {
          try {
            const { data } = await API.post("/product/calculate-price", {
              productId: item.productId,
              detailsRef: item.detailsRef,
              detailsModel: item.detailsModel,
              customizations: item.customizations || {},
            });

            // update with accurate price
            setBuyNowItem({
              ...item,
              finalPrice: data.finalPrice,
              customizationPrice: data.customizationPrice,
            });
          } catch (err) {
            console.error("Failed to calculate price", err);
          }
        })();
      }
    }
  }, [location]);

  /* ---------- fetch charges once ---------- */
  useEffect(() => {
    dispatch(fetchCharges());
  }, [dispatch]);

  /* ---------- country / courier ---------- */
  const [country, setCountry] = useState("India");
  const [courier, setCourier] = useState("");
  const [countries, setCountries] = useState(["India"]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const json = await res.json();
        setCountries(json.map((c) => c.name.common).sort());
      } catch {
        /* ignore – keep fallback */
      }
    })();
  }, []);

  /* ---------- extra services ---------- */
  const [extras, setExtras] = useState({
    hallmarking: false,
    specialRequest: false,
    specialNote: "",
  });

  /* ========== derived flags & totals  ========== */
  /* engraving is automatic – any item carrying a non‑empty engraving string */
  const hasEngraving = useMemo(
    () =>
      items.some(
        (it) =>
          typeof it.customizations?.engraving?.value === "string" &&
          it.customizations.engraving.value.trim() !== ""
      ),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.finalPrice * it.quantity, 0),
    [items]
  );

  const gst = useMemo(
    () => (charges?.gstRate ? subtotal * charges.gstRate : 0),
    [subtotal, charges]
  );

  const shipping = useMemo(() => {
    if (!charges) return 0;
    if (country === "India") return charges.domesticShipping ?? 0;
    const line = charges.internationalShipping?.find(
      (r) => r.country === country && r.courier === courier
    );
    return line?.charge ?? 0;
  }, [country, courier, charges]);

  const extraCharges = useMemo(() => {
    if (!charges) return 0;
    let t = 0;
    if (hasEngraving) t += charges.otherCharges?.engraving ?? 0;
    if (extras.hallmarking) t += charges.otherCharges?.hallmarking ?? 0;
    if (extras.specialRequest)
      t += charges.otherCharges?.specialRequestDefault ?? 0;
    return t;
  }, [charges, hasEngraving, extras]);

  const grandTotal = subtotal + gst + shipping + extraCharges;

  /* loading fallback */
  if (chargesLoading || !charges) return <CheckoutSkeleton />;

  /* ✅ No valid item to checkout – redirect */
  if (!buyNowItem && items.length === 0) {
    navigate("/shop");
    return null;
  }

  /* ---------- render ---------- */
  return (
    <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-10 px-4 md:px-6 lg:px-8 pt-[6rem] lg:pt-[9rem] max-w-6xl mx-auto pb-8 ">
      {/* ② Items summary */}
      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-light font-cardo uppercase mb-3">
            Items
          </h2>
          <div className="space-y-4">
            {items.map((it, index) => (
              <article
                key={index}
                className="flex gap-4 border border-[#dddddd] p-4 bg-base-100"
              >
                <img
                  src={it.product.images?.[0]}
                  alt={it.product.name}
                  className="w-20 h-20 object-cover"
                />
                <div className="flex-1 text-sm">
                  <h3 className="font-medium font-cardo uppercase">
                    {it.product.name}
                  </h3>
                  <p className="text-gray-500 first-letter:uppercase">
                    {it.product.category?.main}
                  </p>

                  {/* customizations */}
                  {it.customizations && (
                    <ul className="mt-1 text-gray-600 space-y-0.5 font-cardo">
                      {Object.entries(it.customizations).map(([k, v]) => (
                        <li className="capitalize" key={k}>
                          <strong>{k} :</strong>{" "}
                          {typeof v === "object" ? v.value : v}
                        </li>
                      ))}
                    </ul>
                  )}

                  <p className="mt-2 font-poppins">
                    Qty {it.quantity} × ₹{it.finalPrice} ={" "}
                    <strong>
                      ₹{(it.finalPrice * it.quantity).toLocaleString()}
                    </strong>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ① Address block  */}
        <AddressSection />

        {/* ③ Shipping options */}
        {charges.internationalShipping.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="select select-bordered w-full"
              value={country}
              autoComplete="false"
              id="country"
              onChange={(e) => {
                setCountry(e.target.value);
                setCourier("");
              }}
            >
              <option disabled>Choose Country</option>
              {countries.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {country !== "India" && (
              <select
                id="courier"
                className="select select-bordered w-full"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
              >
                <option value="">Select Courier</option>
                {charges.internationalShipping
                  .filter((r) => r.country === country)
                  .map((r) => (
                    <option key={r.courier}>{r.courier}</option>
                  ))}
              </select>
            )}
          </section>
        )}
      </div>

      <div className="space-y-2 lg:w-[30%] max-h-[70vh] bg-base-200 p-3 flex flex-col justify-end">
        {/* ④ Extra services */}
        <section className="space-y-3 font-cardo text-sm uppercase tracking-wider">
          {hasEngraving && (
            <p className="text-sm">
              ✦ Engraving&nbsp;fee: ₹{charges.otherCharges.engraving}
            </p>
          )}

          <label htmlFor="hallmarking" className="flex items-center gap-2">
            <input
              id="hallmarking"
              type="checkbox"
              className="checkbox"
              checked={extras.hallmarking}
              onChange={() =>
                setExtras((p) => ({ ...p, hallmarking: !p.hallmarking }))
              }
            />
            Hallmarking
          </label>

          <label htmlFor="specialRequest" className="flex items-center gap-2">
            <input
              id="specialRequest"
              type="checkbox"
              className="checkbox"
              checked={extras.specialRequest}
              onChange={() =>
                setExtras((p) => ({ ...p, specialRequest: !p.specialRequest }))
              }
            />
            Special&nbsp;request
          </label>

          {extras.specialRequest && (
            <input
              id="note"
              className="input input-bordered w-full"
              placeholder="Write your request…"
              value={extras.specialNote}
              onChange={(e) =>
                setExtras((p) => ({ ...p, specialNote: e.target.value }))
              }
            />
          )}
        </section>

        {/* ⑤ Cost breakdown */}
        <section className="border-t pt-4 font-poppins text-sm space-y-1">
          <Row lbl="Subtotal" val={subtotal} />
          <Row
            lbl={`GST (${(charges.gstRate * 100).toFixed(0)} %)`}
            val={gst}
          />
          <Row lbl="Shipping" val={shipping} />
          {hasEngraving && (
            <Row lbl="Engraving" val={charges.otherCharges.engraving} />
          )}
          {extras.hallmarking && (
            <Row lbl="Hallmarking" val={charges.otherCharges.hallmarking} />
          )}
          {extras.specialRequest && (
            <Row
              lbl="Special Request"
              val={charges.otherCharges.specialRequestDefault}
            />
          )}

          <Row lbl="Total" val={grandTotal} bold />
        </section>

        {/* ⑥ CTA */}
        {isAddressComplete ? (
          <RazorpayButton
            grandTotal={grandTotal}
            charges={{
              gst,
              shipping,
              engraving: hasEngraving
                ? charges?.otherCharges?.engraving ?? 0
                : 0,
              hallmarking: extras.hallmarking
                ? charges?.otherCharges?.hallmarking ?? 0
                : 0,
              specialRequest: extras.specialRequest
                ? charges?.otherCharges?.specialRequestDefault ?? 0
                : 0,
            }}
            buyNowItem={buyNowItem}
          />
        ) : (
          <p className="text-red-500 font-medium text-center mt-4">
            Please complete your shipping address above to proceed with
            checkout.
          </p>
        )}
      </div>
    </div>
  );
}

/* helper row component */
const Row = ({ lbl, val, bold }) => (
  <div className={`flex justify-between tracking-wide ${bold && "font-semibold"}`}>
    <span>{lbl}</span>
    <span>₹ {val.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
  </div>
);

const CheckoutSkeleton = () => (
  <div className="px-4 md:px-6 lg:px-8 pt-[6rem] md:pt-[9rem] max-w-6xl mx-auto pb-8 space-y-8 animate-pulse">
    {/* Items */}
    <section className="space-y-3">
      <div className="h-5 bg-gray-300 rounded w-24" />
      {[1, 2].map((_, i) => (
        <div key={i} className="flex gap-4 border p-4 bg-gray-100">
          <div className="w-20 h-20 bg-gray-300 rounded" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 w-3/4 rounded" />
            <div className="h-3 bg-gray-200 w-1/2 rounded" />
            <div className="h-3 bg-gray-200 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </section>

    {/* Address */}
    <section className="space-y-2">
      <div className="h-4 bg-gray-300 w-1/3 rounded" />
      <div className="h-10 bg-gray-200 rounded" />
    </section>

    {/* Selects */}
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-12 bg-gray-200 rounded" />
      <div className="h-12 bg-gray-200 rounded" />
    </section>

    {/* Extras */}
    <section className="space-y-2">
      <div className="h-4 bg-gray-300 w-1/4 rounded" />
      <div className="h-4 bg-gray-300 w-2/4 rounded" />
    </section>

    {/* Totals */}
    <section className="space-y-2">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 w-full rounded" />
      ))}
    </section>

    {/* Button */}
    <div className="h-12 bg-gray-300 rounded w-full" />
  </div>
);
