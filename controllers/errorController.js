const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message);
};

const handleDuplicateDieldsDB = (err) => {
  const message = `Duplicate Value please use another ${err.path}: ${err.value}`;
  return new AppError(message);
};

const handleJWTExpiredError = () => {
  const message = "Your token expired, please login again";
  return new AppError(message, 401);
};

const sendErrorDev = (err, req, res) => {
  if (req.url.startsWith("/api")) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render("_error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
};

const handleJWTError = () => new AppError("Invalid token. Please login again!", 401);

const sendErrorProd = (err, res) => {
  // send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //other unknown error
  } else {
    console.error("ERROR", err);

    res.status(500).json({
      status: "error",
      message: "something went very wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateDieldsDB(error.code);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
