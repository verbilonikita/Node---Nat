const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get Tour Data
  const tours = await Tour.find();
  // 2) build Template

  // 3) Render template
  res.status(200).render("_overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = (req, res) => {
  // const tour = await Tour.findOne({slug: req.params})
  res.status(200).render("_tour", {
    title: "The Forest Hiker",
  });
};
