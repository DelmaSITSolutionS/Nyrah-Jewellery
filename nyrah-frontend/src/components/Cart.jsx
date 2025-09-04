// src/components/Cart/Cart.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateCartItemQuantity,
} from "../redux/apis/cartApi";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { VscClose } from "react-icons/vsc";
import currencyConverter from "../utils/currencyConverter";

export default function Cart({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((s) => s.cart);
  const [qty, setQty] = useState({});

  const [convertedPrices, setConvertedPrices] = useState({});
  const [totalPrice, setTotalPrice] = useState(null);

  const navigate = useNavigate();

  const total = cartItems.reduce(
    (t, i) => t + i.finalPrice * (qty[i._id] || i.quantity),
    0
  );

  const selectedCurrency = useSelector((state) => state.currency.selected);

  const symbol = selectedCurrency?.currencies
    ? selectedCurrency.currencies[Object.keys(selectedCurrency.currencies)[0]]
        .symbol
    : "₹";

  /* convert total + each product price */
  useEffect(() => {
    let isMounted = true;
    const convertAll = async () => {
      if (!selectedCurrency) return;

      // convert total
      const convertedTotal = await currencyConverter(
        selectedCurrency,
        Number(total)
      );
      if (isMounted) setTotalPrice(convertedTotal);

      // convert each item price
      const priceMap = {};
      for (let item of cartItems) {
        priceMap[item._id] = await currencyConverter(
          selectedCurrency,
          Number(item.finalPrice)
        );
      }
      if (isMounted) setConvertedPrices(priceMap);
    };

    convertAll();
    return () => {
      isMounted = false;
    };
  }, [selectedCurrency, cartItems, total]);

  /* fetch once */
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  /* sync quantities when cartItems change */
  useEffect(() => {
    const q = {};
    cartItems.forEach((i) => (q[i._id] = i.quantity));
    setQty(q);
  }, [cartItems]);

  /* lock body scroll */
  useEffect(() => {
    if (isOpen) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  /* animation variants */
  const backdrop = {
    hidden: { opacity: 0 },
    show: { opacity: 0.4, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };
  const panel = {
    hidden: { x: "100%" },
    show: { x: 0, transition: { type: "tween", duration: 0.3 } },
    exit: { x: "100%", transition: { type: "tween", duration: 0.25 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.div
            key="cart-backdrop"
            className="fixed inset-0 bg-black z-[1001]"
            variants={backdrop}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={onClose}
          />

          {/* drawer */}
          <motion.div
            key="cart-panel"
            className="fixed right-0 top-0 h-full w-full sm:w-[350px] bg-base-100 z-[1002] flex flex-col shadow-lg p-4"
            variants={panel}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {/* header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b-1 border-b-[#7c7c7c]">
              <h2 className="text-lg uppercase font-noto-serif-display font-light">
                Cart
              </h2>
              <button onClick={onClose}>
                <VscClose className="text-2xl cursor-pointer text-[#4f4f4f]" />
              </button>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center mt-8 font-cardo uppercase  font-light">
                  Your cart is empty.
                </p>
              ) : (
                cartItems.map((it) => (
                  <div
                    key={it._id}
                    className="flex gap-3 border-b border-b-[#7c7c7c] pb-5"
                  >
                    <img
                      src={it.product?.images?.[0]}
                      alt={it.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 font-roboto">
                      <h3 className=" text-lg tracking-wide font-cardo line-clamp-2 uppercase text-[#4A4A4A]">
                        {it.product?.name}
                      </h3>
                      {/* <div className="flex gap-1 items-center text-sm text-[#7e7e7e]">
                        <strong className="font-[400] text-black font-poppins">
                          Metal :{" "}
                        </strong>
                        <p className="capitalize font-[400] font-poppins tracking-wider">
                          {it.detailsRef?.metalTone}
                        </p>
                      </div> */}
                      <div>
                        {convertedPrices[it._id] ? (
                          <span className="font-poppins text-[.9rem]">
                            {symbol} {convertedPrices[it._id].toLocaleString()}
                          </span>
                        ) : (
                          <span className="skeleton text-white">
                            Loading...
                          </span>
                        )}
                      </div>
                      <div className="flex items-center mt-2 gap-2">
                        <div className="flex items-center border ">
                          <button
                            className="px-2 py-1 text-lg hover:bg-gray-100"
                            onClick={() => {
                              const newQty = Math.max(
                                1,
                                (qty[it._id] || it.quantity) - 1
                              );
                              setQty((prev) => ({ ...prev, [it._id]: newQty }));
                              dispatch(
                                updateCartItemQuantity({
                                  cartItemId: it._id,
                                  quantity: newQty,
                                })
                              );
                            }}
                          >
                            −
                          </button>
                          <span className=" w-8 text-center">
                            {qty[it._id] || it.quantity}
                          </span>
                          <button
                            className="px-2 py-1 text-lg hover:bg-gray-100"
                            onClick={() => {
                              const newQty = (qty[it._id] || it.quantity) + 1;
                              setQty((prev) => ({ ...prev, [it._id]: newQty }));
                              dispatch(
                                updateCartItemQuantity({
                                  cartItemId: it._id,
                                  quantity: newQty,
                                })
                              );
                            }}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(it._id))}
                          className="uppercase tracking-wider hover:text-[#C19A6B] text-xs font-light cursor-pointer"
                        >
                          {/* <FaTrashAlt className="text-red-500" /> */}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* total + checkout */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-[#7c7c7c] mt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-[1rem] font-cardo uppercase tracking-wide font-[400] ">
                    Total :
                  </span>
                  {totalPrice !== null ? (
                    <span>
                      {symbol} {totalPrice.toLocaleString()}
                    </span>
                  ) : (
                    <span className="skeleton text-white">Loading...</span>
                  )}
                </div>
                <button
                  className="btn btn-outline btn-neutral rounded-none uppercase tracking-wider font-[400] w-full mt-4"
                  onClick={() => {
                    onClose(); // Close the cart drawer
                    navigate("/checkout"); // Go to checkout page
                  }}
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
