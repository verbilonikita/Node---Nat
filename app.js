//Express
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");

//View Engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

const rateLimit = require("express-rate-limit");
// headers security
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

//xss stop
const xss = require("xss-clean");
// anti parameters polution
const hpp = require("hpp");
//parse cookie

//Addons
const morgan = require("morgan");
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

//Error Handling
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

//Routes
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const viewRouter = require("./routes/viewRoutes");

// Security HTTP headers
// app.use(
//   helmet(),
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["self'"],
//       scriptSrc: [
//         "self'",
//         "http://127.0.0.1:3000",
//         "https://unpkg.com/axios/dist/axios.min.js",
//         "https://fonts.googleapis.com/",
//       ],
//       objectSrc: ["'none'"],
//       upgradeInsecureRequests: [],
//     },
//   })
// );

// Limiter Request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from that API, please try in hour",
});
app.use("/api", limiter);

//Data Sanitization agains NOSQL
app.use(mongoSanitize());
//Against xss
app.use(xss());
// Parameter polution
// app.use(
//   hpp({
//     whitelist: [
//       "duration",
//       "ratingsQuantity",
//       "ratingsAverage",
//       "maxGroupSize",
//       "difficulty",
//       "price",
//     ],
//   })
// );

//To be able manipulate with json from req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true })); //data from form will be available on req.body when submitted
app.use(cookieParser());
// To access static files like html or images

// Routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//All invalid routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.path} on this server!`, 404));
});
// Error handling
app.use(globalErrorHandler);

//Export to Server
module.exports = app;
