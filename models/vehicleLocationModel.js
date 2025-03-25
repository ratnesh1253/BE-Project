const pool = require("./db");

// Function to get the latest entry from the vehicle_data table
async function getLastEntry() {
  const result = await pool.query(
    "SELECT * FROM vehicle_data ORDER BY id DESC LIMIT 1"
  );
  return result.rows[0];
}

// Function to insert a new entry into the vehicle_data table
async function insertVehicleData(time, date, latitude, longitude, speed) {
  const result = await pool.query(
    "INSERT INTO vehicle_data (date, time, latitude, longitude, speed) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [date, time, latitude, longitude, speed]
  );
  return result.rows[0];
}

// Function to retrieve all data from the vehicle_data table
async function getAllVehicleData() {
  const result = await pool.query("SELECT * FROM vehicle_data");
  return result.rows;
}

const insertVehicleLocation = async (tableName, data) => {
  const { date, time, latitude, longitude, speed, charges_applied } = data;

  const query = `
    INSERT INTO ${tableName} (date, time, latitude, longitude, speed, charges_applied)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;

  const values = [date, time, latitude, longitude, speed, charges_applied];
  const result = await pool.query(query, values);

  return result.rows[0];
};

// Fetch vehicle location history
const getVehicleHistory = async (tableName) => {
  const query = `
    SELECT id, date, time, latitude, longitude, speed, charges_applied, created_at
    FROM ${tableName}
    ORDER BY created_at DESC;
  `;

  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  getLastEntry,
  insertVehicleData,
  getAllVehicleData,
  insertVehicleLocation,
  getVehicleHistory,
};
