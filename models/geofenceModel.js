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
};

// export default {
//   insertGeofence,
//   getAllGeofences,
// };
