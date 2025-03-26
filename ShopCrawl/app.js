require("dotenv").config(); // Load .env variables at the very top
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const mongoose = require("mongoose");

// Initialize Express app
var app = express();

// Load environment variables
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const MONGO_URI = process.env.MONGO_URI;

// Validate essential environment variables
if (!RAPIDAPI_KEY) {
  console.error("❌ RAPIDAPI_KEY is missing in .env file!");
  process.exit(1);
}
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file!");
  process.exit(1);
}

console.log("✅ RAPIDAPI_KEY Loaded");

// MongoDB Connection with Auto-Reconnect
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Handle MongoDB disconnection
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Reconnecting...");
  mongoose.connect(MONGO_URI);
});

// Graceful shutdown for MongoDB
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed. Exiting...");
  process.exit(0);
});

// Import routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const searchRoutes = require("./routes/searchRoutes");

// Middleware setup
app.use(logger("dev"));
app.use(cors()); // Enable CORS for frontend integration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Define Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", searchRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
