import React, { useState } from "react";
import "./Login.css";
import { useDispatch } from "react-redux";
import { sendOtp, verifyOtp } from "../../redux/apis/userApi";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-toastify";
import { BiShow, BiHide } from "react-icons/bi";

function Login({ close }) {
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();

    toast
      .promise(dispatch(sendOtp({ email, password })).unwrap(), {
        pending: "Sending OTP…",
        success: "OTP sent!",
        error: {
          render({ data }) {
            // `data` is the error string from unwrap()
            return typeof data === "string" ? data : "Failed to send OTP";
          },
        },
      })
      .then(() => {
        setStep(2);
      });
  };

  const handleVerify = (e) => {
    e.preventDefault();
    toast
      .promise(dispatch(verifyOtp({ email, otp })).unwrap(), {
        pending: "Verifying…",
        success: "Logged in!",
        error: "Invalid or expired OTP",
      })
      .then(() => {
        setStep(1)
        setOtp("")
        close();
      });
  };

  const slideVariant = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: 0.3, easing: "ease-in-out" },
  };

  return (
    <div className="login-container">
      <button onClick={close} className="close-btn">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <h2 className="font-cardo">{step === 1 ? "SIGN IN" : "ENTER OTP"}</h2>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.form key="form1" {...slideVariant} onSubmit={handleSendOtp}>
            <label htmlFor="email">
              USERNAME OR EMAIL<span>*</span>
            </label>
            <input
              type="text"
              id="email"
              name="email"
              autoComplete="true"
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">
              PASSWORD<span>*</span>
            </label>
            <div className="password-field flex relative ">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="pe-12"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute right-0 h-full flex items-center px-4 text-xl text-zinc-400">
                <BiHide
                  title="hide"
                  onClick={() => setShowPassword(false)}
                  className={!showPassword ? "hidden" : "cursor-pointer"}
                />
                <BiShow
                  title="show"
                  onClick={() => setShowPassword(true)}
                  className={showPassword ? "hidden" : "cursor-pointer"}
                />
              </div>
            </div>

            <p className="forgot-text">
              <a href="">FORGOT YOUR PASWORD?</a>
            </p>

            <button type="submit" className="login-btn">
              LOGIN
            </button>
          </motion.form>
        ) : (
          <motion.form className="flex flex-col justify-center items-center" key="form2" {...slideVariant} onSubmit={handleVerify}>
            <p className="mb-3 text-sm text-gray-600">
              We just emailed a 6-digit code to <strong>{email}</strong>
            </p>

            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="otp-input text-center"
              required
            />

            <button type="submit" className="login-btn">
              Verify &amp; Login
            </button>

            <button
              type="button"
              className="resend-btn text-xs mt-3 uppercase font-poppins text-[#C19A6B] tracking-wider cursor-pointer"
              onClick={(e) => handleSendOtp(e)}
            >
              Resend OTP
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;
