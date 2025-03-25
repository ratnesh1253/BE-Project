const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");

// Controller to handle user registration
exports.registerUser = async (req, res) => {
  const errors = validationResult(req); // Validate the request body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, vehicle_number } = req.body;

  try {
    // Check if vehicle_number is provided
    if (!vehicle_number) {
      return res.status(400).json({ message: "Vehicle number is required" });
    }
    // Check if user already exists
    const existingUser = await userModel.getUserByVehicleNumber(vehicle_number);
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Vehicle number is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const newUser = await userModel.insertUser(
      name,
      email,
      hashedPassword,
      vehicle_number
    );

    // Create a history table for the user's vehicle
    const tableName = `${vehicle_number}_history`;
    await userModel.createHistoryTable(tableName);

    return res.status(201).json({
      message: "User registered successfully and history table created",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to fetch user data by vehicle number
exports.getUserData = async (req, res) => {
  const { vehicle_number } = req.params;

  if (!vehicle_number) {
    return res.status(400).json({ error: "Vehicle number is required" });
  }

  try {
    const user = await userModel.getUserByVehicleNumber(vehicle_number);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to update user's balance based on vehicle number
exports.updateBalance = async (req, res) => {
  // Vehicle number and new amount
  const { vehicle_number } = req.params;
  const { newAmount } = req.body;
  console.log(newAmount);

  try {
    // Step 1: Fetch the user's current balance and due amount based on the vehicle number
    const user = await userModel.getUserByVehicleNumber(vehicle_number);

    if (!user) {
      return res
        .status(404)
        .send("User not found for the provided vehicle number");
    }

    let currentBalance = parseFloat(user.balance); // Convert balance to float

    const dueAmount = parseFloat(user.due_amount); // Convert due amount to float

    // Step 2: Add the new amount to the current balance
    currentBalance += parseFloat(newAmount); // Add new amount to current balance

    // Step 3: Check if there is a due amount and subtract from the balance if possible
    if (dueAmount > 0 && currentBalance >= dueAmount) {
      currentBalance -= dueAmount; // Subtract due amount from the balance
      await userModel.clearUserDueAmount(vehicle_number); // Clear due amount
    }
    // Step 4: Update the balance in the database
    await userModel.updateUserBalance(vehicle_number, currentBalance);

    // Send the success response
    res.status(200).send("Balance updated successfully");
  } catch (error) {
    console.error("Error updating balance:", error.message);
    res.status(500).send("An error occurred while updating the balance");
  }
};
