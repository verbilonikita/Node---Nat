const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewsController");

router.get("/", viewController.getOverview);
router.get("/tour/:id", viewController.getTour);

module.exports = router;
