const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

// Route for user registration
router.post("/register", userController.registerUser);

// Get user info route (by email or vehicle_number)
router.get("/info", userController.getUserInfo);
// router.get("/info", authenticate, userController.getUserInfo);

// Login user
router.post("/login", userController.loginUser);

router.post("/add-funds", userController.addFundsToWallet);

module.exports = router;
