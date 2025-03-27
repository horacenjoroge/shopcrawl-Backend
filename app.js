require("dotenv").config(); // Load .env variables at the very top
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

// Initialize Express app
const app = express();

// Load environment variables
const { RAPIDAPI_KEY, MONGO_URI } = process.env;

// Validate essential environment variables
if (!RAPIDAPI_KEY) {
  console.error(" RAPIDAPI_KEY is missing in .env file!");
  process.exit(1);
}
if (!MONGO_URI) {
  console.error(" MONGO_URI is missing in .env file!");
  process.exit(1);
}

console.log(" RAPIDAPI_KEY Loaded");

// MongoDB Connection with Auto-Reconnect
mongoose
  .connect(MONGO_URI) // Removed deprecated options
  .then(() => console.log(" MongoDB connected successfully"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

// Handle MongoDB disconnection
mongoose.connection.on("disconnected", async () => {
  console.warn(" MongoDB disconnected. Reconnecting...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log(" MongoDB reconnected.");
  } catch (err) {
    console.error(" Reconnection failed:", err);
  }
});

// Graceful shutdown for MongoDB
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 MongoDB connection closed. Exiting...");
  process.exit(0);
});

// Import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
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

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api", searchRoutes);

// Catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(" Server Error:", err.message);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: req.app.get("env") === "development" ? err : {},
  });
});

module.exports = app;
