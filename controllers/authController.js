const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const crypto = require("crypto");

const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    // secure: true, //over https only
    httpOnly: true, //cookie is readonly for browser
  });
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//SignUp
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

//Login
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 404));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) return next(new AppError("Incorrect email or password!", 401));
  createSendToken(user, 200, res);
});

//Authorization User

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // validate token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      //check if user still exists
      const currentUser = await User.findById(decoded.id);
      //Checks
      if (!currentUser) return next();
      if (currentUser.changedPasswordAfter(decoded.iat)) return next();

      // Deliver data to pug straight away
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      next();
    }
  }
  next();
};

//Authorization Admin
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Role amin and lead guide
    if (!roles.includes(req.user.role)) return next(new AppError("You do not have permission", 403));

    next();
  };
};

//Password forgot

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //Get user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("No user found!", 404));
  //Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // Send it back as an email
  const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Send a PATCH request with ${resetURL}.`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "token sent to email!",
    });
  } catch (err) {
    (user.passwordResetToken = undefined), (user.passwordExpiredToken = undefined), await user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error finding email", 500));
  }
});

//Password reset
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token not expired, and there is user, set the new password
  if (!user) return next(new AppError("Token is invalid or expired!"));
  // 3) Updated changedPasswordAt for that user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 4) Log the user and send JWT
  createSendToken(newUser, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  //1. Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  //2 Check if password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }
  // 3 If it is update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4. Log user in with new JWT
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(new AppError("You are not logged in! Please log in to get access.", 401));
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("The user belonging to this token does no longer exist.", 401));
  }
  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User recently changed password! Please log in again.", 401));
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});
