const pool = require("./db");

const insertUser = async (userData) => {
  const {
    username,
    email,
    password,
    vehicle_number,
    wallet_balance,
    due_amount,
    qr_code,
  } = userData;

  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, password, vehicle_number, wallet_balance, due_amount, qr_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        username,
        email,
        password,
        vehicle_number,
        wallet_balance,
        due_amount,
        qr_code,
      ]
    );
    return result.rows[0]; // Return the newly inserted user
  } catch (error) {
    console.error("Error inserting user:", error);
    throw error;
  }
};

// Function to get user by email or vehicle number
const getUserByEmailOrVehicle = async (email, vehicle_number) => {
  try {
    const query = `
      SELECT * FROM users 
      WHERE email = COALESCE($1, email) OR vehicle_number = COALESCE($2, vehicle_number)
    `;

    const result = await pool.query(query, [
      email || null,
      vehicle_number || null,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
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

// Find user by email
const getUserByEmail = async (email) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);
    return result.rows[0] || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
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

const updateUserBalanceAndDue = async (vehicleNumber, balance, dueAmount) => {
  vehicleNumber = String(vehicleNumber).toUpperCase();
  const query = `
    UPDATE users
    SET wallet_balance = $1, due_amount = $2
    WHERE vehicle_number = $3
    RETURNING *;
  `;

  const values = [balance, dueAmount, vehicleNumber];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Export functions
module.exports = {
  getUserByEmailOrVehicle,
  insertUser,
  createHistoryTable,
  getUserByEmail,
  updateUserBalance,
  updateUserBalanceAndDue,
};
