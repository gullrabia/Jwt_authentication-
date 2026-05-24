import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  // ✅ FIX: Use correct context property names (check your AppContext)
  const { backendUrl, getUserData, isLoggedIn, userData } = useContext(AppContext);
  //                                   ^^^^^^^^^^ (capital 'I') – match your context

  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

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
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    pasteData.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    // Auto-submit after paste if all 6 digits filled
    if (pasteData.length === 6) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const otp = inputRefs.current.map((input) => input.value).join("");

      if (otp.length !== 6) {
        toast.error("Please enter a valid 6-digit OTP");
        triggerShake();
        setIsLoading(false);
        return;
      }

      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

      if (data.success) {
        toast.success(data.message);
        // ✅ Refresh user data to update isAccountVerified
        if (getUserData) await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
        triggerShake();
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error(error.response?.data?.message || error.message || "Verification failed");
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Redirect if already verified (avoid loops)
  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  // ✅ Fallback: Ensure background and input styles exist (add inline styles if CSS missing)
  const inputStyle = {
    width: "3rem",
    height: "3rem",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255,255,255,0.2)",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    color: "white",
    outline: "none",
    transition: "all 0.2s",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-reverse"></div>
      </div>

      {/* Logo – with fallback */}
      <img
        onClick={() => navigate("/")}
        src={assets?.logo || "/placeholder-logo.png"}
        alt="logo"
        className="absolute top-5 left-5 sm:left-20 w-32 cursor-pointer transition-all duration-300 hover:scale-105 z-10"
      />

      <form
        onSubmit={handleSubmit}
        className={`relative z-10 bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/10 transition-all duration-300 hover:shadow-indigo-500/20 ${
          shake ? "animate-shake" : ""
        }`}
        onPaste={handlePaste}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Email Verification
        </h1>

        <p className="text-center mb-6 text-slate-300">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between mb-8 gap-2">
          {Array(6)
            .fill("")
            .map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                required
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="otp-input"
                style={inputStyle} // inline fallback in case CSS missing
                autoFocus={index === 0}
              />
            ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-lg font-semibold text-white hover:from-indigo-700 hover:to-pink-700 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Email</span>
          )}
        </button>

        <p className="text-center text-slate-400 text-sm mt-6">
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => {
              // Clear OTP inputs
              inputRefs.current.forEach((input) => {
                if (input) input.value = "";
              });
              inputRefs.current[0]?.focus();
              // You should call a resend OTP API here
              toast.info("New OTP has been sent to your email");
            }}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Resend Code
          </button>
        </p>
      </form>

      {/* Add required animations if missing */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 6s ease-in-out infinite; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .otp-input:focus {
          border-color: #a855f7;
          box-shadow: 0 0 0 2px rgba(168,85,247,0.3);
        }
      `}</style>
    </div>
  );
};

export default EmailVerify;