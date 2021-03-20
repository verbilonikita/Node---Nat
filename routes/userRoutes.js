const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/login", authController.isLoggedIn, authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch("/updateMyPassword", authController.protect, authController.updatePassword);
router.patch("/updateme", authController.protect, userController.updateMe);
router.delete("/deleteme", authController.protect, userController.deleteMe);

//Routes

router.route("/").get(userController.getAllUsers).post(userController.createUser);
router.route("/:id").get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
