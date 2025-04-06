const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const validateUser = require("../utils/express-validator");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// Route for user registration
router.post("/register", validateUser, userController.registerUser);

// Get user info route (by email or vehicle_number)
router.get("/info", userController.getUserInfo);
// router.get("/info", authenticate, userController.getUserInfo);

// Login user
router.post("/login", userController.loginUser);

router.post("/add-funds", userController.addFundsToWallet);

module.exports = router;
