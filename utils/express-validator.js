const { body } = require("express-validator");

// Validation middleware
const validateUser = [
  body("username").not().isEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Email is invalid"),
  body("vehicle_number")
    .matches(/^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/)
    .withMessage("Invalid vehicle number format (Expected: MH12AB1234)"),
  body("password")
    .isLength({ min: 6 })
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/\d/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character")
    .withMessage(
      "Password must be at least 6 characters long with at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

module.exports = validateUser;
