import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Footer() {
  const { categories } = useSelector((state) => state.category);
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* <div className="footer-column">
          <h3>SHOP</h3>
          <ul>
            <li>
              <Link to="">Natural Diamond Jewelry</Link>
            </li>
            <li>
              <Link to="">Lab Grown Diamond Jewelry</Link>
            </li>
            <li>
              <Link to="">Gemstone Jewelry</Link>
            </li>
            <li>
              <Link to="">Gold Vintage Jewelry</Link>
            </li>
            <li>
              <Link to="">Fine Jewelry</Link>
            </li>
            <li>
              <Link to="">Loose Diamond</Link>
            </li>
          </ul>
        </div> */}
        <div className="footer-column">
          <h3>POLICIES</h3>
          <ul>
            <li>
              <Link to="/shipping-policy">Shipping Policy</Link>
            </li>
            <li>
              <Link to="/refund-return">Refund & Return Policy</Link>
            </li>
            <li>
              <Link to="/cancellation-policy">Cancellation Policy</Link>
            </li>
            <li>
              <Link to="/privacy-policy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms-conditions">Terms & Conditions</Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>CATEGORIES</h3>
          <ul>
            {categories.map((category, i) => (
              <li key={i} >
                <Link to={`/product/${category?.main}`}>{category?.main}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h3>WHY NYRAH</h3>
          <ul>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/diamond-education">Diamond Education</Link>
            </li>
            <li>
              <Link to="/faqs">FAQ's</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>
        <div className="footer-column">
          <h3>STORE DETAILS</h3>
          <ul>
            <li>
              <i className="fas fa-phone"></i> +91 9737527178
            </li>
            <li>
              <i className="fas fa-envelope"></i>{" "}
              <Link to="mailto:nyrahbyjhanvi@gmail.com">
                nyrahbyjhanvi@gmail.com
              </Link>
            </li>
            <li>
              <i className="fas fa-location-dot"></i> Surat, India
            </li>
              <li>
              JANKRISHNA DIAMONDS
            </li>
          </ul>
          <div className="social-icons flex">
            <Link to={"https://www.instagram.com/nyrahjewelry?igsh=b29pbG10bjFhOGIy"} target="_blank">
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
            </Link>
            <Link to={"https://www.facebook.com/share/16VQe1nbEx/?mibextid=wwXIfr"} target="_blank">
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
            </Link>
            <Link to={"https://maps.app.goo.gl/URrj2CgWj7LM9opY7"} target="_blank">
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
            </Link>
          </div>
        </div>
      </div>
      {/* <hr  style="border-color: #d6c4b2; margin: 0;" width="90%" /> */}
      <hr style={{ borderColor: "#4A4A4A", margin: "0", width: "100%" }} />

      <div className="footer-bottom">
        <p>
          Nyrah © 2025 by All Rights Reserved. Powered By DelmasIT Solutions
        </p>
      </div>
    </footer>
  );
}

export default Footer;
