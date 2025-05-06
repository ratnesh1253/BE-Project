const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Controller to handle user registration
exports.registerUser = async (req, res) => {
  const errors = validationResult(req); // Validate request body
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    email,
    password,
    phone_number,
    vehicle_number,
    first_name,
    last_name,
    address_line1,
    city,
    state,
    country,
    pin,
  } = req.body;

  try {
    // Validate required fields
    if (
      !email ||
      !password ||
      !phone_number ||
      !vehicle_number ||
      !first_name ||
      !last_name ||
      !address_line1 ||
      !city ||
      !state ||
      !country ||
      !pin
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists (by email or vehicle number)
    const existingUser = await userModel.getUserByEmailOrVehicle(
      email,
      vehicle_number
    );
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email or Vehicle number is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const newUser = await userModel.insertUser({
      email,
      password: hashedPassword,
      phone_number,
      vehicle_number,
      first_name,
      last_name,
      address_line1,
      city,
      state,
      country,
      pin,
      wallet_balance: 0.0,
      due_amount: 0.0,
    });

    // Create history table for this user's vehicle
    const historyTableName = `${vehicle_number}_history`;
    await userModel.createHistoryTable(historyTableName);

    return res.status(201).json({
      message: "User registered successfully, and history table created",
      user: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller to get user info
exports.getUserInfo = async (req, res) => {
  const { email, vehicle_number } = req.query;

  try {
    // Ensure at least one parameter is provided
    if (!email && !vehicle_number) {
      return res
        .status(400)
        .json({ message: "Email or Vehicle number is required" });
    }

    // Fetch user data from the database
    const user = await userModel.getUserByEmailOrVehicle(email, vehicle_number);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.getUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid credentials (Email is not registered)" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: "Invalid credentials (Password is Wrong)" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      "process.env.JWT_SECRET",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        vehicle_number: user.vehicle_number,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
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

// Add funds to wallet after adjusting due amount
exports.addFundsToWallet = async (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid email or amount" });
  }

  try {
    // Fetch user details by email
    const user = await userModel.getUserByEmailOrVehicle(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let newWalletBalance = parseFloat(user.wallet_balance);
    let newDueAmount = parseFloat(user.due_amount);
    let adjustedAmount = parseFloat(amount); // Amount after due adjustment

    if (newDueAmount > 0) {
      if (adjustedAmount >= newDueAmount) {
        // Pay off due and add remaining to wallet
        adjustedAmount -= newDueAmount;
        newDueAmount = 0; // Due amount is fully cleared
      } else {
        // Partially pay off due, no wallet addition
        newDueAmount -= adjustedAmount;
        adjustedAmount = 0;
      }
    }

    // Add remaining funds (if any) to the wallet
    newWalletBalance += adjustedAmount;

    // Update the user's wallet and due amount
    await userModel.updateUserBalanceAndDue(
      user.vehicle_number, // Use email instead of vehicle_number
      newWalletBalance,
      newDueAmount
    );

    res.status(200).json({
      success: true,
      message: `Funds added successfully. Wallet: ₹${newWalletBalance}, Due: ₹${newDueAmount}`,
      updated_wallet_balance: newWalletBalance,
      updated_due_amount: newDueAmount,
    });
  } catch (error) {
    console.error("Error adding funds:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
