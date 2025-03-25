const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/userController");
const validateUser = require("../utils/express-validator");

const router = express.Router();

// Route for user registration
router.post("/register", validateUser, userController.registerUser);

// Route for fetching user data
router.get("/:vehicle_number", userController.getUserData);

// Route for updating balance and due amount
router.put("/:vehicle_number/update-balance", userController.updateBalance);

module.exports = router;
