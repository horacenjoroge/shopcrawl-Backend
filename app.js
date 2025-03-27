var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");

// Debugging Logs
console.log("Starting backend...");

// Import Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var historyRouter = require('./routes/history'); // Add this line to import history router

var app = express();

// Debugging middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Debugging CORS issues
app.use(cors({
  origin: '*', // Change this to your frontend URL to restrict access
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));
console.log("CORS enabled");

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/history', historyRouter); // Add this line to use history routes

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.error(`404 Not Found - ${req.originalUrl}`);
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(`Error occurred: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

// Connect to MongoDB
console.log("Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI, { dbName: "ShopCrawl" })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));



module.exports = app;