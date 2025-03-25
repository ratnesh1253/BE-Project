const pool = require("./db");

// Insert geofenced data
// Insert a new geofence
exports.insertGeofence = async ({
  name,
  lat1,
  lon1,
  lat2,
  lon2,
  lat3,
  lon3,
  lat4,
  lon4,
  charges,
}) => {
  const query = `
    INSERT INTO geofenced_data 
    (name, lat1, lon1, lat2, lon2, lat3, lon3, lat4, lon4, charges)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    name,
    lat1,
    lon1,
    lat2,
    lon2,
    lat3,
    lon3,
    lat4,
    lon4,
    charges,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Retrieve all geofenced areas
exports.getAllGeofences = async () => {
  const query = `
    SELECT * FROM geofenced_data ORDER BY created_at ASC;
  `;
  const result = await pool.query(query);
  return result.rows;
};
