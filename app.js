require("dotenv").config(); // Load environment variables early
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const createError = require("http-errors");

// Import Routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const searchRouter = require("./routes/searchRoutes"); // ✅ Import Search Route
const historyRouter = require("./routes/history");
 const savedRouter = require("./routes/saved"); // ✅ Import Saved Route

const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL || "*";
app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);
console.log(`🌐 CORS enabled for: ${allowedOrigins}`);

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/history", historyRouter); // ✅ Add History Route
app.use("/api/search", searchRouter); // ✅ Add Search Route
app.use("/api/products", savedRouter); // ✅ Add Saved Route

// 404 Handler
app.use((req, res, next) => {
  console.error(`❌ 404 Not Found - ${req.originalUrl}`);
  next(createError(404));
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(`🔥 Error occurred: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log("🛢️ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "ShopCrawl",
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log("✅ MongoDB Connected!");
    return true;  // Return success status
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    return false;  // Return failure status instead of exiting
  }
};

// Expose the connectDB function for bin/www
app.connectDB = connectDB;

// Start Server
const PORT = process.env.PORT || 3000;
if (require.main === module) {
  connectDB().then((connected) => {
    if (connected) {
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    } else {
      process.exit(1);
    }
  });
}

module.exports = app;