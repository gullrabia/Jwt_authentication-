import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

try {
  await connectDB();
} catch (err) {
  console.error(err);
}

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Working",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

export default app;