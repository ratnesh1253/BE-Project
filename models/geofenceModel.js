import { pool } from "./db.js";

// Insert geofenced data
// Insert a new geofence
export const insertGeofence = async ({
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
  adminId,
}) => {
  const query = `
  INSERT INTO geofenced_data (
    name, lat1, lon1, lat2, lon2, lat3, lon3, lat4, lon4, charges, created_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
    adminId,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Retrieve all geofenced areas
export const getAllGeofences = async () => {
  try {
    const query = `
      SELECT 
        g.*, 
        a.first_name AS admin_first_name, 
        a.last_name AS admin_last_name
      FROM geofenced_data g
      JOIN admin a ON g.created_by = a.id
      ORDER BY g.created_at ASC;
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error in getAllGeofences:", err.message);
    throw err; // Re-throw the error to be caught by the controller
  }
};

// In your model
export const updateGeofence = async (
  id,
  { name, lat1, lon1, lat2, lon2, lat3, lon3, lat4, lon4, charges }
) => {
  const query = `
    UPDATE geofenced_data SET
      name = $1,
      lat1 = $2,
      lon1 = $3,
      lat2 = $4,
      lon2 = $5,
      lat3 = $6,
      lon3 = $7,
      lat4 = $8,
      lon4 = $9,
      charges = $10,
      updated_at = NOW()
    WHERE id = $11
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
    id,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteGeofence = async (id) => {
  const query = `
    DELETE FROM geofenced_data
    WHERE id = $1
    RETURNING *;
  `;

  const result = await pool.query(query, [id]);
  return result;
};

// export default {
//   insertGeofence,
//   getAllGeofences,
// };
