var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// Load environment variables
require("dotenv").config();

// CORS
const cors = require("cors");

// Mongoose
const mongoose = require("mongoose");

//routes

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');

var app = express();

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()); // FIX: Move CORS setup here

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', authRouter);


// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
// app.use(function(err, req, res, next) {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   res.status(err.status || 500);
//   res.render('error');
// });


// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({ error: err.message });
});

// Connect to MongoDB
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ShopCrawl"
  }
)
.then(() => console.log(' MongoDB Connected'))
.catch(err => console.log(' MongoDB Connection Error:', err));

if (require.main === module) {
  app.listen(5000, () => console.log(' Server running on port 5000'));
}

module.exports = app;
