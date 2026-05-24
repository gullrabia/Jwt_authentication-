import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const { backendUrl, getUserData, isLoggedIn, userData } = useContext(AppContext);
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
    pasteData.forEach((char, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = char;
      }
    });
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

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [isLoggedIn, userData, navigate]);

  // Inline styles – no external CSS needed
  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 50%, #831843 100%)",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    },
    floatingBlob: (top, left, size, color, delay = "0s") => ({
      position: "absolute",
      top,
      left,
      width: size,
      height: size,
      background: color,
      borderRadius: "50%",
      filter: "blur(80px)",
      opacity: 0.3,
      animation: "float 6s ease-in-out infinite",
      animationDelay: delay,
    }),
    logo: {
      position: "absolute",
      top: "20px",
      left: "20px",
      width: "120px",
      cursor: "pointer",
      transition: "transform 0.3s",
      zIndex: 10,
    },
    form: {
      position: "relative",
      zIndex: 10,
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(12px)",
      padding: "32px",
      borderRadius: "24px",
      width: "400px",
      maxWidth: "90%",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
      transition: "transform 0.3s, box-shadow 0.3s",
      animation: shake ? "shake 0.3s ease-in-out" : "none",
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      textAlign: "center",
      background: "linear-gradient(135deg, #a5b4fc, #f472b6)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      marginBottom: "12px",
    },
    subtitle: {
      textAlign: "center",
      color: "#cbd5e1",
      marginBottom: "32px",
      fontSize: "14px",
    },
    otpContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      marginBottom: "32px",
    },
    otpInput: {
      width: "100%",
      height: "64px",
      textAlign: "center",
      fontSize: "28px",
      fontWeight: "bold",
      borderRadius: "12px",
      border: "1px solid #334155",
      backgroundColor: "#1e293b",
      color: "white",
      outline: "none",
      transition: "all 0.2s",
    },
    button: {
      width: "100%",
      padding: "12px",
      borderRadius: "12px",
      fontWeight: "600",
      fontSize: "16px",
      color: "white",
      background: "linear-gradient(135deg, #4f46e5, #db2777)",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "opacity 0.2s, transform 0.1s",
      opacity: isLoading ? 0.7 : 1,
    },
    resendText: {
      textAlign: "center",
      color: "#94a3b8",
      marginTop: "24px",
      fontSize: "14px",
    },
    resendButton: {
      background: "none",
      border: "none",
      color: "#818cf8",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      paddingLeft: "4px",
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "2px solid rgba(255,255,255,0.3)",
      borderTopColor: "white",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
  };

  // Inject keyframes into head once
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
      .otp-focus:focus {
        border-color: #a855f7;
        box-shadow: 0 0 0 3px rgba(168,85,247,0.3);
      }
    `;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  return (
    <div style={styles.container}>
      {/* Animated blobs */}
      <div style={styles.floatingBlob("10%", "5%", "280px", "#4f46e5")} />
      <div style={styles.floatingBlob("70%", "80%", "320px", "#db2777", "2s")} />
      <div style={styles.floatingBlob("40%", "60%", "200px", "#f59e0b", "4s")} />

      <img
        onClick={() => navigate("/")}
        src={assets?.logo || "/placeholder-logo.png"}
        alt="Logo"
        style={styles.logo}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />

      <form onSubmit={handleSubmit} style={styles.form} onPaste={handlePaste}>
        <h1 style={styles.title}>Email Verification</h1>
        <p style={styles.subtitle}>Enter the 6-digit code sent to your email</p>

        <div style={styles.otpContainer}>
          {Array(6).fill("").map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              required
              ref={(el) => (inputRefs.current[index] = el)}
              onInput={(e) => handleInput(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              style={styles.otpInput}
              className="otp-focus"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? (
            <>
              <div style={styles.spinner}></div>
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Email</span>
          )}
        </button>

        <p style={styles.resendText}>
          Didn't receive the code?{" "}
          <button
            type="button"
            onClick={() => {
              inputRefs.current.forEach((input) => {
                if (input) input.value = "";
              });
              inputRefs.current[0]?.focus();
              toast.info("New OTP has been sent to your email");
            }}
            style={styles.resendButton}
          >
            Resend Code
          </button>
        </p>
      </form>
    </div>
  );
};

export default EmailVerify;