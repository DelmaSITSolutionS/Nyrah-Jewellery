import React, { useEffect, useState, Suspense, lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer, Flip } from "react-toastify";
import { useDispatch } from "react-redux";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Shared Components
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader";
import Logout from "./components/Logout";

// Protected Routes
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import ProtectedUserRoute from "./components/ProtectedUserRoute";

// Redux
import { getUserProfile } from "./redux/apis/userApi";
import { getAllCategories } from "./redux/apis/categoryApi";

import ProductDetail from "./components/ProductDetail/ProductDetail";
import Cart from "./components/cart";
import ChargesAdmin from "./components/admin/ChargesAdmin";
import CheckoutSummary from "./pages/checkout/CheckoutSummary";
import AddressSection from "./components/AddressSection";
import OrderDetail from "./pages/order/OrderDetail";
import UserOrders from "./pages/order/UserOrders";
import Profile from "./pages/profile/Profile";
import ScrollToTop from "./components/scrollToTop";
import NotFound from "./pages/NotFound";
import { fetchCart } from "./redux/apis/cartApi";
import SearchResultsPage from "./components/Navbar/SearchResultsPage";
import Material from "./pages/admin/Material";
import { getAllMaterials } from "./redux/apis/materialApi";
import AdminInstaPost from "./pages/admin/AdminInstaPost";
import AdminDiscountBanner from "./pages/admin/AdminDiscountBanner ";

// Lazy-loaded Pages
const Home = lazy(() => import("./pages/home/Home"));
const Contact = lazy(() => import("./pages/contact/Contact"));
const DiamondEducation = lazy(() =>
  import("./pages/diamondEducation/DiamondEducation")
);
const Faq = lazy(() => import("./pages/FAQ's/Faq"));
const About = lazy(() => import("./pages/about/About"));
const RefundAndReturnPolicy = lazy(() =>
  import("./pages/refundAndReturnPolicy/RefundAndReturnPolicy")
);
const PrivacyPolicy = lazy(() => import("./pages/privacyPolicy/PrivacyPolicy"));
const ShippingPolicy = lazy(() =>
  import("./pages/shippingPolicy/ShippingPolicy")
);
const TermsAndConditions = lazy(() =>
  import("./pages/termsAndConditions/TermsAndConditions")
);
const Shop = lazy(() => import("./pages/shop/Shop"));

// Lazy-loaded Admin Pages
const Admin = lazy(() => import("./pages/admin/Admin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Users = lazy(() => import("./pages/admin/Users"));
const Category = lazy(() => import("./pages/admin/Category"));
const Size = lazy(() => import("./pages/admin/Size"));
const Feature = lazy(() => import("./pages/admin/Feature"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));

import { FaWhatsapp } from "react-icons/fa";
import CancellationPolicy from "./pages/lifetimeUpgradePolicy/CancellationPolicy";

export default function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [login, setLogin] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {}, [dispatch]);

  // Props to pass
  const closeCart = () => setCartOpen(false);

  useEffect(() => {
    dispatch(getUserProfile()).finally(() => setInitialLoaded(true));
    dispatch(getAllCategories());
    dispatch(getAllMaterials());
    dispatch(fetchCart());
  }, [dispatch]);

  if (!initialLoaded) return <Loader />;

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        pauseOnFocusLoss
        theme="light"
        transition={Flip}
      />

      {/* <a
        href="https://wa.me/9197335271778"
        className="fixed bottom-4 right-4 rounded-full p-3 bg-[#000000] text-[#ffffff] text-4xl z-[98]"
        target="_blank"
      >
        <FaWhatsapp />
      </a> */}

      {!isAdminRoute && (
        <Navbar login={login} setLogin={setLogin} setCartOpen={setCartOpen} />
      )}
      <Cart isOpen={cartOpen} onClose={closeCart} />
      <ScrollToTop />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/diamond-education" element={<DiamondEducation />} />
          <Route path="/faqs" element={<Faq />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/cancellation-policy"
            element={<CancellationPolicy />}
          />
          <Route path="/refund-return" element={<RefundAndReturnPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/terms-conditions" element={<TermsAndConditions />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:main" element={<Shop />} />
          <Route path="/product/:main/:sub" element={<Shop />} />

          <Route path="/material/:tag/:sub" element={<Shop />} />
          <Route path="/material/:tag" element={<Shop />} />
          <Route
            path="/product/group/:groupname"
            element={
              <ProductDetail setCartOpen={setCartOpen} setLogin={setLogin} />
            }
          />
          <Route path="/search" element={<SearchResultsPage />} />

          {/* User Routes */}
          <Route path="/user" element={<ProtectedUserRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="logout" element={<Logout />} />
            <Route path="add-address" element={<AddressSection />} />
            <Route path="order/:id" element={<OrderDetail />} />
            <Route path="orders" element={<UserOrders />} />
          </Route>

          <Route path="/checkout" element={<ProtectedUserRoute />}>
            <Route index element={<CheckoutSummary />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<Admin />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<Orders />} />
              <Route
                path="/admin/order/:id"
                element={<OrderDetail mode="admin" />}
              />
              <Route path="category" element={<Category />} />
              <Route path="tags" element={<Material />} />
              <Route path="size" element={<Size />} />
              <Route path="feature" element={<Feature />} />
              <Route path="users" element={<Users />} />
              <Route path="logout" element={<Logout />} />
              <Route path="charges" element={<ChargesAdmin />} />
              <Route path="instapost" element={<AdminInstaPost />} />
              <Route path="discount" element={<AdminDiscountBanner />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>

      {!isAdminRoute && <Footer />}
    </>
  );
}
