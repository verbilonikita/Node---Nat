const Tour = require("../models/tourModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get Tour Data
  const tours = await Tour.find();

  // 3) Render template
  res.status(200).render("_overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  try {
    const tour = await Tour.findOne({ _id: req.params.id });
    res.status(200).render("_tour", {
      title: tour.name,
      tour,
    });
  } catch (err) {
    next(new AppError("No tour was found", 404));
  }
});

exports.login = catchAsync(async (req, res) => {
  res.status(200).render("_login", {
    title: "Log into your account",
  });
});

exports.getAccount = catchAsync(async (req, res) => {
  res.status(200).render("_account", {
    title: "Your account",
    status: "success",
  });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render("_account", {
    title: "Your account",
    user: updatedUser,
  });
});
