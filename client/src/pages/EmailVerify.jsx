import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;
  const { backendUrl, getUserData, isLoggedin, userData } = useContext(AppContext);
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
    if (pasteData.length === 6) {
      inputRefs.current[5]?.focus();
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
        await getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
        triggerShake();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
      triggerShake();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedin && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedin, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-reverse"></div>
      </div>

      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="logo"
        className="absolute top-5 left-5 sm:left-20 w-32 cursor-pointer transition-all duration-300 hover:scale-105 z-10"
      />

      <form
        onSubmit={handleSubmit}
        className={`relative z-10 bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/10 transition-all duration-300 hover:shadow-indigo-500/20 ${shake ? 'animate-shake' : ''}`}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
          Email Verification
        </h1>

        <p className="text-center mb-6 text-slate-300">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex justify-between mb-8 gap-2" onPaste={handlePaste}>
          {Array(6).fill("").map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              required
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="otp-input text-center"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="spinner"></div>
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Email</span>
          )}
        </button>

        <p className="text-center text-slate-400 text-sm mt-6">
          Didn't receive the code?{' '}
          <button
            type="button"
            onClick={() => {
              inputRefs.current.forEach(input => { if (input) input.value = ''; });
              inputRefs.current[0]?.focus();
              toast.info("New OTP has been sent to your email");
            }}
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Resend Code
          </button>
        </p>
      </form>
    </div>
  );
};

export default EmailVerify;