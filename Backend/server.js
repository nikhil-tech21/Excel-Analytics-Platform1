const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // fallback if .env missing
    credentials: true,
  })
);
app.use(express.json()); // parse JSON requests

// --- API Routes ---
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/excel", require("./routes/excelRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/admin", require("./routes/adminRoutes")); // ✅ Admin-only routes

// --- Static Files ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Health Check Route ---
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// --- 404 Handler ---
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
  );
});