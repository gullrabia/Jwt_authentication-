// ResetPassword.jsx

import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // STATE
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([]);

  // OTP INPUT HANDLERS
  const handleInput = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    e.target.value = value;

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .split("");

    pastedData.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  // SEND OTP
  const onSubmitEmail = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );

      if (data.success) {
        toast.success(data.message);

        // STORE EMAIL
        sessionStorage.setItem("resetEmail", email);

        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || error.message
      );
    }
  };

  // VERIFY OTP
  const onSubmitOtp = (e) => {
    e.preventDefault();

    const enteredOtp = inputRefs.current
      .map((input) => input?.value || "")
      .join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    // STORE OTP
    sessionStorage.setItem("otp", enteredOtp);

    setIsOtpSubmitted(true);
  };

  // RESET PASSWORD
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    const otp = sessionStorage.getItem("otp");
    const storedEmail = sessionStorage.getItem("resetEmail");

    console.log({
      storedEmail,
      otp,
      newPassword,
    });

    if (!storedEmail || !otp || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        {
          email: storedEmail,
          otp,
          newPassword,
        }
      );

      if (data.success) {
        toast.success(data.message);

        // CLEAR STORAGE
        sessionStorage.removeItem("otp");
        sessionStorage.removeItem("resetEmail");

        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="flex items-center justify-center gap-6 min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 p-4">

      {/* LOGO */}
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="absolute top-5 left-5 sm:left-20 w-32 cursor-pointer"
        alt="logo"
      />

      {/* EMAIL FORM */}
      {!isEmailSent && (
        <form
          onSubmit={onSubmitEmail}
          className="bg-slate-900 p-8 rounded-2xl shadow-xl w-96"
        >
          <h1 className="text-2xl font-semibold text-white text-center mb-4">
            Reset Password OTP
          </h1>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#333A5C] text-white outline-none mb-4"
            required
          />

          <button className="w-full py-3 bg-indigo-600 text-white rounded-full">
            Send OTP
          </button>
        </form>
      )}

      {/* OTP FORM */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={onSubmitOtp}
          className="bg-slate-900 p-8 rounded-2xl shadow-xl w-96"
        >
          <h1 className="text-white text-2xl text-center mb-4">
            Verify OTP
          </h1>

          <div className="flex justify-between mb-6" onPaste={handlePaste}>
            {Array(6)
              .fill("")
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 bg-[#333A5C] text-white text-center rounded"
                />
              ))}
          </div>

          <button className="w-full py-3 bg-indigo-600 text-white rounded-full">
            Verify OTP
          </button>
        </form>
      )}

      {/* NEW PASSWORD FORM */}
      {isOtpSubmitted && (
        <form
          onSubmit={onSubmitNewPassword}
          className="bg-slate-900 p-8 rounded-2xl shadow-xl w-96"
        >
          <h1 className="text-white text-2xl text-center mb-4">
            New Password
          </h1>

          <input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded bg-[#333A5C] text-white outline-none mb-4"
            required
          />

          <button className="w-full py-3 bg-green-600 text-white rounded-full">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;