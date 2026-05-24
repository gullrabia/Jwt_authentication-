import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

// ---------- CORS configuration ----------
// Use your actual frontend URL in production
const allowedOrigins = [
  "https://jwt-authentication-5rqq5jekz-rabia-gulls-projects.vercel.app",
  "http://localhost:5173", // for local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,          // allow cookies to be sent
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

// Apply CORS globally
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests explicitly (returns 204 without any logic)
app.options("*", (req, res) => {
  res.sendStatus(204);
});

// ---------- Other middleware ----------
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1); // trust first proxy (important for cookies on Vercel)

// ---------- Database connection (lazy, skip for OPTIONS) ----------
let isConnected = false;

app.use(async (req, res, next) => {
  // Skip DB connection for preflight requests
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// ---------- Routes ----------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ---------- Export for Vercel (no app.listen) ----------
export default app;