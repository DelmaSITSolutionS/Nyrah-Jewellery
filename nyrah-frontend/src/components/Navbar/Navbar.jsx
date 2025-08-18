import "./Navbar.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "react-toastify";

import Login from "../Login/Login";
import SearchOverlay from "./SearchOverlay";

import goldenLogo from "../../assets/golden-logo.png";

import { CiViewBoard } from "react-icons/ci";
import { BsPerson } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import { PiHandbagSimpleLight } from "react-icons/pi";

function Navbar({ setCartOpen, login, setLogin }) {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [openNav, setOpenNav] = useState(false);

  const { categories } = useSelector((state) => state.category);
  const { materials } = useSelector((state) => state.material);

  const [activeSub, setActiveSub] = useState(null);
  const [openIndex, setOpenIndex] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpenIndex(false); // close dropdown on route change
  }, [location.pathname]);

  const handleCart = () => {
    if (!isAuthenticated) {
      setCartOpen(false);
      setLogin(true);
      toast.error("Please login");
      return;
    }
    setCartOpen(true);
  };
  return (
    <nav
      className={`${
        scrolled
          ? "backdrop-blur-md bg-[#FDF6F0]/60 hover:bg-[#FDF6F0] duration-100 transition-all"
          : "bg-[#FDF6F0]"
      }`}
    >
      <div className="mobile-view">
        <div className="social-icon">
          <svg
            onClick={() => setOpenNav(true)}
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 5H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M3 12H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M3 19H21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {isAuthenticated ? (
            <div className="dropdown dropdown-center">
              <div tabIndex={0} role="button">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 13C15.9916 13 18.4167 10.5749 18.4167 7.58333C18.4167 4.59179 15.9916 2.16667 13 2.16667C10.0085 2.16667 7.58337 4.59179 7.58337 7.58333C7.58337 10.5749 10.0085 13 13 13Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.3059 23.8333C22.3059 19.6408 18.135 16.25 13 16.25C7.86504 16.25 3.69421 19.6408 3.69421 23.8333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow"
              >
                {user?.role === "admin" && (
                  <li className="active:text-white dropdown-links">
                    <NavLink
                      to={"/admin"}
                      className=" p-2 font-roboto font-light uppercase tracking-wider "
                    >
                      <CiViewBoard className="text-[1rem]" />
                      DashBoard
                    </NavLink>
                  </li>
                )}
                <li className="active:text-white dropdown-links">
                  <NavLink
                    to={"/user/profile"}
                    className=" p-2 font-poppins  font-light uppercase tracking-wider "
                  >
                    <BsPerson className="text-[1rem]" />
                    Profile
                  </NavLink>
                </li>
                <li className="active:text-white dropdown-links">
                  <NavLink
                    to={"/user/orders"}
                    className=" p-2 font-roboto font-light uppercase tracking-wider "
                  >
                    <PiHandbagSimpleLight className="text-[1rem]" />
                    orders
                  </NavLink>
                </li>
                <li className="active:text-white dropdown-links">
                  <NavLink
                    className=" p-2 font-roboto font-light uppercase tracking-wider "
                    to={"/user/logout"}
                  >
                    <IoMdLogOut className="text-[1rem]" />
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          ) : (
            <NavLink onClick={() => setLogin((prev) => !prev)} to={"/"}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 13C15.9916 13 18.4167 10.5749 18.4167 7.58333C18.4167 4.59179 15.9916 2.16667 13 2.16667C10.0085 2.16667 7.58337 4.59179 7.58337 7.58333C7.58337 10.5749 10.0085 13 13 13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.3059 23.8333C22.3059 19.6408 18.135 16.25 13 16.25C7.86504 16.25 3.69421 19.6408 3.69421 23.8333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          )}
        </div>
        <div className="logo">
          <NavLink to={"/"}>
            <img src={goldenLogo} alt="LOGO" />
          </NavLink>
        </div>
        <div className="user-icon">
          <button onClick={() => setShowSearch(true)}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4583 22.75C18.1422 22.75 22.75 18.1423 22.75 12.4583C22.75 6.7744 18.1422 2.16667 12.4583 2.16667C6.77436 2.16667 2.16663 6.7744 2.16663 12.4583C2.16663 18.1423 6.77436 22.75 12.4583 22.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23.8333 23.8333L21.6666 21.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button onClick={handleCart}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.125 8.30917V7.25833C8.125 4.82083 10.0858 2.42667 12.5233 2.19917C15.4267 1.9175 17.875 4.20334 17.875 7.0525V8.5475"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.75006 23.8333H16.2501C20.6051 23.8333 21.3851 22.0892 21.6126 19.9658L22.4251 13.4658C22.7176 10.8225 21.9592 8.66667 17.3334 8.66667H8.66672C4.04089 8.66667 3.28256 10.8225 3.57506 13.4658L4.38756 19.9658C4.61506 22.0892 5.39506 23.8333 9.75006 23.8333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.7868 13H16.7965"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.20234 13H9.21207"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div
        className={`mobile-nav-box ${
          !openNav ? "slide-right" : "slide-current"
        }`}
      >
        <svg
          onClick={() => {
            setOpenNav(false);
            setActiveSub(false);
          }}
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <ul>
          {categories?.map((category) => {
            const hasSub = category.sub && category.sub.length > 0;
            const isOpen = activeSub === category.main;

            return (
              <li className="flex flex-col" key={category._id || category.main}>
                <div
                  className="flex justify-between w-full"
                  onClick={() =>
                    hasSub
                      ? setActiveSub((prev) =>
                          prev === category.main ? null : category.main
                        )
                      : setOpenNav(false)
                  }
                >
                  <NavLink
                    onClick={() => {
                      setOpenNav(false);
                      setActiveSub(false);
                    }}
                    className={"uppercase"}
                    to={`/product/${category.main}`}
                  >
                    {category.main}s
                  </NavLink>

                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                      stroke="currentColor"
                      strokeWidth=".8"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4.31528 12H21.192"
                      stroke="currentColor"
                      strokeWidth=".8"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <AnimatePresence initial={false}>
                  {hasSub && isOpen && (
                    <motion.ul
                      className="submenu ml-1 mt-3 border-t-1"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {category.sub.map((sub, idx) => (
                        <li key={idx}>
                          <NavLink
                            className={"capitalize"}
                            to={`/product/${category.main.toLowerCase()}/${sub.toLowerCase()}`}
                            onClick={() => setOpenNav(false)}
                          >
                            {sub}s
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}

          {materials?.map((material) => {
            const hasSub = material.sub && material.sub.length > 0;
            const isOpen = activeSub === material.tag;

            return (
              <li className="flex flex-col" key={material._id || material.tag}>
                <div
                  className="flex justify-between w-full"
                  onClick={() =>
                    hasSub
                      ? setActiveSub((prev) =>
                          prev === material.tag ? null : material.tag
                        )
                      : setOpenNav(false)
                  }
                >
                  <NavLink
                    onClick={() => {
                      setOpenNav(false);
                      setActiveSub(false);
                    }}
                    className={"uppercase"}
                    to={`/material/${material.tag}`}
                  >
                    {material.tag}s
                  </NavLink>

                  {hasSub && (
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                        stroke="currentColor"
                        strokeWidth=".8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4.31528 12H21.192"
                        stroke="currentColor"
                        strokeWidth=".8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {hasSub && isOpen && (
                    <motion.ul
                      className="submenu ml-1 mt-3 border-t-1"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {material.sub.map((sub, idx) =>
                        sub !== "all" ? (
                          <li key={idx}>
                            <NavLink
                              className={"capitalize"}
                              to={`/material/${material.tag}/${sub}`}
                              onClick={() => setOpenNav(false)}
                            >
                              {sub}s
                            </NavLink>
                          </li>
                        ) : (
                          <li key={idx}>
                            <NavLink
                              className={"capitalize"}
                              to={`/material/${material.tag}`}
                              onClick={() => setOpenNav(false)}
                            >
                              {sub}
                            </NavLink>
                          </li>
                        )
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            );
          })}

          {/* Add static items after dynamic ones if needed */}
          <li>
            <NavLink
              onClick={() => {
                setOpenNav(false);
                setActiveSub(false);
              }}
              to="/shop"
              className={"uppercase"}
            >
              shop
            </NavLink>
            <svg
              width="22"
              height="22"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                stroke="currentColor"
                strokeWidth=".8"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.31528 12H21.192"
                stroke="currentColor"
                strokeWidth=".8"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
          <li>
            <NavLink
              onClick={() => {
                setOpenNav(false);
                setActiveSub(false);
              }}
              to="/about"
              className={"uppercase"}
            >
              about us
            </NavLink>
            <svg
              width="22"
              height="22"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                stroke="currentColor"
                strokeWidth=".8"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.31528 12H21.192"
                stroke="currentColor"
                strokeWidth=".8"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
          <li>
            <NavLink
              className={"uppercase"}
              onClick={() => {
                setOpenNav(false);
                setActiveSub(false);
              }}
              to="/contact"
            >
              contact
            </NavLink>
            <svg
              width="22"
              height="22"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2756 5.92999L21.3625 12L15.2756 18.07"
                stroke="currentColor"
                strokeWidth=".8"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4.31528 12H21.192"
                stroke="currentColor"
                strokeWidth=".8"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </li>
        </ul>
      </div>
              {/* https://www.facebook.com/share/16VQe1nbEx/?mibextid=wwXIfr */}
              {/* https://maps.app.goo.gl/i88EzywbYGLfExkSA */}
              {/* https://www.instagram.com/nyrahjewelry?igsh=b29pbG10bjFhOGIy */}
      {/* desktop view  */}
      <div className="first-part">
        <div className="social-icon">
          <NavLink
            to={"/"}
            target="_blank"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 30 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.033 30.75H14.967C6.71428 30.75 0 24.0357 0 15.783V15.717C0 7.46426 6.71428 0.749985 14.967 0.749985H15.033C23.2857 0.749985 30 7.46426 30 15.717V15.783C30 24.0357 23.2857 30.75 15.033 30.75ZM14.967 1.76545C7.27381 1.76545 1.01547 8.02378 1.01547 15.717V15.783C1.01547 23.4762 7.27381 29.7345 14.967 29.7345H15.033C22.7262 29.7345 28.9845 23.4762 28.9845 15.783V15.717C28.9845 8.02378 22.7262 1.76545 15.033 1.76545H14.967Z"
                fill="currentColor"
              />
              <path
                d="M19.4848 7.15454H10.5162C8.03847 7.15454 6.02277 9.17024 6.02277 11.648V19.853C6.02277 22.3307 8.03847 24.3464 10.5162 24.3464H19.4848C21.9626 24.3464 23.9783 22.3307 23.9783 19.853V11.648C23.9783 9.17024 21.9626 7.15454 19.4848 7.15454ZM7.60791 11.648C7.60791 10.0446 8.91279 8.7397 10.5162 8.7397H19.4848C21.0883 8.7397 22.3931 10.0446 22.3931 11.648V19.853C22.3931 21.4564 21.0883 22.7613 19.4848 22.7613H10.5162C8.91279 22.7613 7.60791 21.4564 7.60791 19.853V11.648Z"
                fill="currentColor"
              />
              <path
                d="M15.0005 19.9291C17.3046 19.9291 19.1802 18.0546 19.1802 15.7495C19.1802 13.4444 17.3057 11.5698 15.0005 11.5698C12.6954 11.5698 10.8209 13.4444 10.8209 15.7495C10.8209 18.0546 12.6954 19.9291 15.0005 19.9291ZM15.0005 13.156C16.4313 13.156 17.5951 14.3197 17.5951 15.7505C17.5951 17.1813 16.4313 18.345 15.0005 18.345C13.5697 18.345 12.406 17.1813 12.406 15.7505C12.406 14.3197 13.5697 13.156 15.0005 13.156Z"
                fill="currentColor"
              />
              <path
                d="M19.5671 12.2451C20.1876 12.2451 20.6933 11.7404 20.6933 11.1189C20.6933 10.4975 20.1886 9.99277 19.5671 9.99277C18.9456 9.99277 18.441 10.4975 18.441 11.1189C18.441 11.7404 18.9456 12.2451 19.5671 12.2451Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          <NavLink
            to={"/"}
            target="_blank"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 30 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.999 30.749C14.1931 30.749 13.3842 30.6844 12.5965 30.5573C9.11781 29.9975 5.9296 28.2092 3.61989 25.5222C1.28497 22.8059 0 19.3352 0 15.7495C0 7.47866 6.72842 0.75 15 0.75C23.2716 0.75 30 7.47866 30 15.7495C30 19.3907 28.6787 22.9028 26.2803 25.6372C23.904 28.3464 20.6391 30.1105 17.0888 30.6057C16.402 30.7016 15.7 30.75 15.001 30.75L14.999 30.749ZM14.999 1.95938C7.39511 1.95938 1.20932 8.14537 1.20932 15.7485C1.20932 22.5568 6.07887 28.2819 12.7891 29.3621C14.1417 29.58 15.5598 29.5951 16.9204 29.4055C23.6861 28.4624 28.7887 22.5911 28.7887 15.7485C28.7887 8.14537 22.6029 1.95938 14.999 1.95938Z"
                fill="currentColor"
              />
              <path
                d="M17.0031 12.9122V16.0481H20.8822L20.268 20.2722H17.0031V30.0046C16.3485 30.0954 15.6788 30.1428 14.999 30.1428C14.2143 30.1428 13.4437 30.0802 12.6933 29.9592V20.2722H9.11578V16.0481H12.6933V12.2112C12.6933 9.83079 14.6228 7.90026 17.0041 7.90026V7.90228C17.0112 7.90228 17.0172 7.90026 17.0243 7.90026H20.8832V11.5535H18.3617C17.6123 11.5535 17.0041 12.1618 17.0041 12.9112L17.0031 12.9122Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
          <NavLink to={"/"} target="_blank">
            <svg
              width="22"
              height="22"
              viewBox="0 0 32 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.86427 5.61698C9.38222 -0.183992 19.3714 -0.929837 25.8375 4.08386C32.8424 9.47048 34.0445 19.6636 28.5732 26.6662C23.0604 33.7103 12.6982 34.7876 5.77615 29.1109C-1.02151 23.5171 -1.97485 13.1583 3.74513 6.44569C4.03528 6.07278 4.28398 5.57555 4.86427 5.61698C5.23731 7.06723 3.82803 7.60588 3.24774 8.5589C-0.0267413 13.8212 0.0976211 20.368 3.70369 25.506C7.22687 30.4783 13.5271 32.8816 19.33 31.4727C25.3401 30.0225 30.0653 25.0917 30.8943 19.3736C31.8062 12.9096 29.112 7.02579 23.6822 3.75238C18.4181 0.561848 11.9106 0.976188 6.77091 4.74682C6.27353 5.11974 5.94194 6.36282 4.86427 5.61698Z"
                fill="currentColor"
              />
              <path
                d="M22.5631 15.0643C22.0242 18.3377 20.4492 21.6525 17.6721 24.3873C16.5944 25.4646 15.4752 25.4646 14.3976 24.3458C11.9521 21.7354 10.2112 18.6692 9.50658 15.1886C8.84339 11.9152 11.8277 8.60034 15.5167 8.22742C19.1228 7.89593 22.6045 11.0036 22.5631 15.0643ZM15.3924 11.2936C15.9726 13.5726 15.3094 14.8157 13.9002 14.1941C10.6671 12.7024 12.1593 15.3543 12.3251 16.1002C12.7396 18.1719 14.3147 19.125 16.3871 19.0007C18.4181 18.8764 20.0761 16.8046 19.9103 14.8571C19.7445 12.7439 18.1695 11.4594 15.3924 11.2936Z"
                fill="currentColor"
              />
            </svg>
          </NavLink>
        </div>
        <div className="logo">
          <NavLink to={"/"}>
            <img src={goldenLogo} alt="LOGO" />
          </NavLink>
        </div>
        <div className="user-icon">
          {isAuthenticated ? (
            <div className="dropdown dropdown-center">
              <div tabIndex={0} role="button">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 13C15.9916 13 18.4167 10.5749 18.4167 7.58333C18.4167 4.59179 15.9916 2.16667 13 2.16667C10.0085 2.16667 7.58337 4.59179 7.58337 7.58333C7.58337 10.5749 10.0085 13 13 13Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.3059 23.8333C22.3059 19.6408 18.135 16.25 13 16.25C7.86504 16.25 3.69421 19.6408 3.69421 23.8333"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow"
              >
                {user?.role === "admin" && (
                  <li className="active:text-white dropdown-links">
                    <NavLink
                      to={"/admin"}
                      className=" p-2 font-roboto font-light uppercase tracking-wider "
                    >
                      <CiViewBoard className="text-[1rem]" />
                      DashBoard
                    </NavLink>
                  </li>
                )}
                <li className="active:text-white dropdown-links">
                  <NavLink
                    to={"/user/profile"}
                    className=" p-2 font-roboto font-light uppercase tracking-wider "
                  >
                    <BsPerson className="text-[1rem]" />
                    Profile
                  </NavLink>
                </li>
                <li className="active:text-white dropdown-links">
                  <NavLink
                    to={"/user/orders"}
                    className=" p-2 font-roboto font-light uppercase tracking-wider "
                  >
                    <PiHandbagSimpleLight className="text-[1rem]" />
                    orders
                  </NavLink>
                </li>
                <li className="active:text-white dropdown-links">
                  <NavLink
                    className=" p-2 font-roboto font-light uppercase tracking-wider "
                    to={"/user/logout"}
                  >
                    <IoMdLogOut className="text-[1rem]" />
                    Logout
                  </NavLink>
                </li>
              </ul>
            </div>
          ) : (
            <NavLink onClick={() => setLogin((prev) => !prev)} to={"/"}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 13C15.9916 13 18.4167 10.5749 18.4167 7.58333C18.4167 4.59179 15.9916 2.16667 13 2.16667C10.0085 2.16667 7.58337 4.59179 7.58337 7.58333C7.58337 10.5749 10.0085 13 13 13Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.3059 23.8333C22.3059 19.6408 18.135 16.25 13 16.25C7.86504 16.25 3.69421 19.6408 3.69421 23.8333"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>
          )}

          <button onClick={() => setShowSearch(true)}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.4583 22.75C18.1422 22.75 22.75 18.1423 22.75 12.4583C22.75 6.7744 18.1422 2.16667 12.4583 2.16667C6.77436 2.16667 2.16663 6.7744 2.16663 12.4583C2.16663 18.1423 6.77436 22.75 12.4583 22.75Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M23.8333 23.8333L21.6666 21.6667"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button onClick={handleCart}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.125 8.30917V7.25833C8.125 4.82083 10.0858 2.42667 12.5233 2.19917C15.4267 1.9175 17.875 4.20334 17.875 7.0525V8.5475"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.75006 23.8333H16.2501C20.6051 23.8333 21.3851 22.0892 21.6126 19.9658L22.4251 13.4658C22.7176 10.8225 21.9592 8.66667 17.3334 8.66667H8.66672C4.04089 8.66667 3.28256 10.8225 3.57506 13.4658L4.38756 19.9658C4.61506 22.0892 5.39506 23.8333 9.75006 23.8333Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.7868 13H16.7965"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.20234 13H9.21207"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="second-part">
        <ul>
          {categories.map((category) => (
            <li
              className="menu-item "
              key={category._id || category.main}
              onMouseEnter={() => setOpenIndex(true)}
              onMouseLeave={() => setOpenIndex(false)}
            >
              <NavLink className={"uppercase"} to={`/product/${category.main}`}>
                {category.main.toUpperCase()}s
              </NavLink>
              {category.sub?.length > 0 && (
                <ul className={`${openIndex ? "link-dropdown" : "block-nav"}`}>
                  {category.sub.map((sub, idx) => (
                    <li key={idx}>
                      <NavLink
                        className={"capitalize"}
                        to={`/product/${category.main}/${sub}`}
                      >
                        {sub}s
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
          {materials.map((material) => (
            <li
              className="menu-item "
              key={material._id || material.main}
              onMouseEnter={() => setOpenIndex(true)}
              onMouseLeave={() => setOpenIndex(false)}
            >
              <NavLink className={"uppercase"} to={`/material/${material.tag}`}>
                {material.tag.toUpperCase()}
              </NavLink>
              {material.sub?.length > 0 && (
                <ul className={`${openIndex ? "link-dropdown" : "block-nav"}`}>
                  {material.sub.map((sub, idx) =>
                    sub !== "all" ? (
                      <li key={idx}>
                        <NavLink
                          className={"capitalize"}
                          to={`/material/${material.tag}/${sub}`}
                        >
                          {sub}s
                        </NavLink>
                      </li>
                    ) : (
                      <li key={idx}>
                        <NavLink
                          className={"capitalize"}
                          to={`/material/${material.tag}`}
                        >
                          {sub}
                        </NavLink>
                      </li>
                    )
                  )}
                </ul>
              )}
            </li>
          ))}
          <li>
            <NavLink className={"uppercase"} to="/shop">
              shop
            </NavLink>
          </li>
          <li>
            <NavLink className={"uppercase"} to="/about">
              About us
            </NavLink>
          </li>
          <li>
            <NavLink className={"uppercase"} to="/contact">
              contact
            </NavLink>
          </li>
        </ul>
      </div>

      {/* funcationality  */}
      <div className={`${login ? "login-wraper" : "hidden"}`}>
        <Login close={() => setLogin(false)} />
      </div>

      <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </nav>
  );
}

export default Navbar;
