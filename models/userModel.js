const pool = require("./db");

// Function to insert new user data
const insertUser = async (
  name,
  email,
  password,
  vehicle_number,
  balance = 0.0,
  due_amount = 0.0
) => {
  try {
    const result = await pool.query(
      `INSERT INTO user_data (name, email, password, vehicle_number, balance, due_amount) 
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, email, password, vehicle_number, balance, due_amount]
    );
    return result.rows[0]; // Return the inserted user data
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

// Function to get user by vehicle number
const getUserByVehicleNumber = async (vehicle_number) => {
  try {
    const result = await pool.query(
      "SELECT * FROM user_data WHERE vehicle_number = $1",
      [vehicle_number]
    );
    return result.rows[0]; // Return the user data
  } catch (error) {
    throw new Error("Error retrieving user data: " + error.message);
  }
};

// Function to update user's balance
const updateUserBalance = async (vehicle_number, newBalance) => {
  try {
    await pool.query(
      "UPDATE user_data SET balance = $1 WHERE vehicle_number = $2",
      [newBalance, vehicle_number]
    );
  } catch (error) {
    throw new Error("Error updating user balance: " + error.message);
  }
};

// Function to clear due amount for the user
const clearUserDueAmount = async (vehicle_number) => {
  try {
    await pool.query(
      "UPDATE user_data SET due_amount = 0 WHERE vehicle_number = $1",
      [vehicle_number]
    );
  } catch (error) {
    throw new Error("Error clearing due amount: " + error.message);
  }
};

// Function to get the current due amount of the user
const getUserDueAmount = async (vehicle_number) => {
  try {
    const result = await pool.query(
      "SELECT due_amount FROM user_data WHERE vehicle_number = $1",
      [vehicle_number]
    );
    return result.rows[0]?.due_amount || 0; // Return due amount
  } catch (error) {
    throw new Error("Error retrieving due amount: " + error.message);
  }
};

// Function to create a history table for a new user
const createHistoryTable = async (tableName) => {
  // Allow only alphanumeric characters and underscores in the table name
  if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
    throw new Error("Invalid table name");
  }

  const query = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
        id SERIAL PRIMARY KEY,                
        date VARCHAR(10) NOT NULL,            
        time VARCHAR(8) NOT NULL,             
        latitude NUMERIC(8, 6) NOT NULL,      
        longitude NUMERIC(8, 6) NOT NULL,     
        speed NUMERIC(6, 2) NOT NULL,         
        charges_applied NUMERIC(10, 2),       
        created_at TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata')   
    );
  `;
  try {
    await pool.query(query);
    console.log(`Table ${tableName} created successfully.`);
  } catch (error) {
    console.error(`Error creating table ${tableName}:`, error);
    throw error;
  }
};

const updateUserBalanceAndDue = async (vehicleNumber, balance, dueAmount) => {
  const query = `
    UPDATE user_data
    SET balance = $1, due_amount = $2
    WHERE vehicle_number = $3
    RETURNING *;
  `;

  const values = [balance, dueAmount, vehicleNumber];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Export functions
module.exports = {
  getUserByVehicleNumber,
  updateUserBalance,
  clearUserDueAmount,
  getUserDueAmount,
  insertUser,
  createHistoryTable,
  updateUserBalanceAndDue,
};
