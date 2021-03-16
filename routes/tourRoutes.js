//Express
const express = require("express");
const router = express.Router();

//Functions
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

// router.param("id", tourController.checkID);

router
  .route("/top-5-cheap")
  .get(tourController.alliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route("/:id/")
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  )
  .get(tourController.getTour);

module.exports = router;
