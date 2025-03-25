const { body, validationResult } = require("express-validator");

// Validation middleware
const validateUser = [
  body("name").not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("vehicle_number")
    .not()
    .isEmpty()
    .withMessage("Vehicle number is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

module.exports = validateUser;
