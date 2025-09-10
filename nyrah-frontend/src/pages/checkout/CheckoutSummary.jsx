// src/pages/checkout/CheckoutSummary.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCharges } from "../../redux/apis/chargesApi";
import AddressSection from "../../components/AddressSection";
import RazorpayButton from "../../components/RazorpayButton";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../../utils/axiosInstance";
import currencyConverter from "../../utils/currencyConverter";
import PaypalButton from "../../components/PaypalButton";

export default function CheckoutSummary() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: charges, loading: chargesLoading } = useSelector(
    (s) => s.charges
  );
  const selectedCurrency = useSelector((s) => s.currency.selected);
  const cartItems = useSelector((s) => s.cart?.items || []);
  const user = useSelector((state) => state.user.user);

  const location = useLocation();
  const [buyNowItem, setBuyNowItem] = useState(null);

  const [country, setCountry] = useState("India");
  const [courier, setCourier] = useState("");
  const [countries, setCountries] = useState(["India"]);

  const [extras, setExtras] = useState({
    hallmarking: false,
    specialRequest: false,
    specialNote: "",
  });

  // ✅ Load buy-now item if needed
  useEffect(() => {
    const qp = new URLSearchParams(location.search);
    if (qp.get("buynow") === "true") {
      const item = JSON.parse(sessionStorage.getItem("buyNowItem"));
      if (item) {
        setBuyNowItem(item);
        (async () => {
          try {
            const { data } = await API.post("/product/calculate-price", {
              productId: item.productId,
              detailsRef: item.detailsRef,
              detailsModel: item.detailsModel,
              customizations: item.customizations || {},
            });
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

  useEffect(() => {
    dispatch(fetchCharges());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        const json = await res.json();
        setCountries(json.map((c) => c.name.common).sort());
      } catch {
        /* ignore */
      }
    })();
  }, []);

  const address = user?.address;
  const isAddressComplete =
    address && Object.values(address).every((val) => val?.trim?.() !== "");

  const items = buyNowItem ? [buyNowItem] : cartItems;

  const hasEngraving = useMemo(
    () =>
      items.some(
        (it) =>
          typeof it.customizations?.engraving?.value === "string" &&
          it.customizations.engraving.value.trim() !== ""
      ),
    [items]
  );

  // ---- calculations ----
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
    console.log(country)
    if (country !== "India") {
      console.log(subtotal<=8002)
      if (subtotal <= 8802) return charges.domesticShipping;
    }
    // const line = charges.internationalShipping?.find(
    //   (r) => r.country === country && r.courier === courier
    // );
    return 0;
  }, [country, courier, charges, subtotal]);

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

  // ---- currency conversion state ----
  const [converted, setConverted] = useState({
    subtotal: null,
    gst: null,
    shipping: null,
    extra: null,
    grandTotal: null,
    engraving: null,
    hallmarking: null,
    specialR: null,
    items: {},
  });

  const symbol = selectedCurrency?.currencies
    ? selectedCurrency.currencies[Object.keys(selectedCurrency.currencies)[0]]
        .symbol
    : "₹";

  // ✅ convert all values
  useEffect(() => {
    let active = true;
    const convertAll = async () => {
      if (!selectedCurrency) return;
      try {
        const itemConversions = {};
        await Promise.all(
          items.map(async (it) => {
            const convertedLine = await currencyConverter(
              selectedCurrency,
              it.finalPrice * it.quantity
            );
            itemConversions[it.product._id || it.productId] = convertedLine;
          })
        );

        const [sub, g, sh, ex, gt, e, h, sr] = await Promise.all([
          currencyConverter(selectedCurrency, subtotal),
          currencyConverter(selectedCurrency, gst),
          currencyConverter(selectedCurrency, shipping),
          currencyConverter(selectedCurrency, extraCharges),
          currencyConverter(selectedCurrency, grandTotal),
          currencyConverter(selectedCurrency, charges.otherCharges?.engraving),
          currencyConverter(
            selectedCurrency,
            charges.otherCharges?.hallmarking
          ),
          currencyConverter(
            selectedCurrency,
            charges.otherCharges?.specialRequestDefault
          ),
        ]);
        if (active) {
          setConverted({
            subtotal: sub,
            gst: g,
            shipping: sh,
            extra: ex,
            grandTotal: gt,
            items: itemConversions,
            engraving: e,
            hallmarking: h,
            specialR: sr,
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
  }, [
    selectedCurrency,
    items,
    subtotal,
    gst,
    shipping,
    extraCharges,
    grandTotal,
  ]);

  if (chargesLoading || !charges) return <CheckoutSkeleton />;

  if (!buyNowItem && items.length === 0) {
    navigate("/shop");
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-10 px-4 md:px-6 lg:px-8 pt-[6rem] lg:pt-[9rem] max-w-6xl mx-auto pb-8 ">
      {/* items + address + shipping left */}
      <div className="space-y-8">
        {/* items */}
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

                  <p className="mt-2 font-poppins flex justify-between">
                    <span>
                      Qty {it.quantity} × {symbol}{" "}
                      {(
                        converted.items[it.product._id || it.productId] ??
                        it.finalPrice * it.quantity
                      ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <AddressSection />

        {/* {charges.internationalShipping.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="select select-bordered w-full"
              value={country}
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
        )} */}
      </div>

      {/* right summary */}
      <div className="space-y-2 lg:w-[30%] h-full bg-base-200 p-3 flex flex-col justify-end">
        <section className="space-y-3 font-cardo text-sm uppercase tracking-wider">
          {hasEngraving && (
            <p className="text-sm">
              ✦ Engraving fee: ₹{charges.otherCharges.engraving}
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
            Special request
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

        <section className="border-t pt-4 font-poppins text-sm space-y-1">
          <Row
            lbl="Subtotal"
            val={converted.subtotal ?? subtotal}
            symbol={symbol}
          />
          <Row
            lbl={`GST (${(charges.gstRate * 100).toFixed(0)} %)`}
            val={converted.gst ?? gst}
            symbol={symbol}
          />
          <Row
            lbl="Shipping"
            val={converted.shipping ?? shipping}
            symbol={symbol}
          />
          {hasEngraving && (
            <Row
              lbl="Engraving"
              val={converted.engraving ?? charges.otherCharges.engraving}
              symbol={symbol}
            />
          )}
          {extras.hallmarking && (
            <Row
              lbl="Hallmarking"
              val={converted.hallmarking ?? charges.otherCharges.hallmarking}
              symbol={symbol}
            />
          )}
          {extras.specialRequest && (
            <Row
              lbl="Special Request"
              val={
                converted.specialR ?? charges.otherCharges.specialRequestDefault
              }
              symbol={symbol}
            />
          )}
          <Row
            lbl="Total"
            val={converted.grandTotal ?? grandTotal}
            bold
            symbol={symbol}
          />
        </section>

        {isAddressComplete ? (
          selectedCurrency?.cca2 === "IN" ? (
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
            <PaypalButton
              grandTotal={converted.grandTotal}
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
          )
        ) : (
          <p className="text-red-500 font-medium text-center mt-4">
            Please complete your shipping address above to proceed with
            checkout.
          </p>
        )}

        <section>
          <div className="my-3">
            <h2 className="font-bold mb-3">Shipping Policy</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li className="text-justify">
                We offer <strong>"worldwide shipping"</strong> with convenient{" "}
                <strong>"doorstep delivery"</strong>.
              </li>
              <li>
                Shipping charges range from <strong>"$60 to $80"</strong>,
                depending on location.
              </li>
              <li>
                Orders are delivered within{" "}
                <strong>*15–20 business days*</strong>.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold mb-3">Refund & Return Policy</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li className="text-justify">
                Returns are accepted within <strong>"30 days"</strong> of
                delivery.
              </li>
              <li>
                <strong>Customized orders</strong> are{" "}
                <strong>"non-refundable"</strong>.
              </li>
              <li>
                <strong>"Shipping and insurance fees"</strong> are not
                refundable.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

const Row = ({ lbl, val, bold, symbol }) => (
  <div
    className={`flex justify-between tracking-wide ${bold && "font-semibold"}`}
  >
    <span>{lbl}</span>
    <span>
      {symbol} {val?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </span>
  </div>
);

const CheckoutSkeleton = () => (
  <div className="px-4 md:px-6 lg:px-8 pt-[6rem] md:pt-[9rem] max-w-6xl mx-auto pb-8 space-y-8 animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-1/3"></div>
    <div className="h-24 bg-gray-300 rounded"></div>
    <div className="h-24 bg-gray-300 rounded"></div>
  </div>
);
