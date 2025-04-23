import { pool } from "./db.js";

// Get admin by email
export const getAdminByEmail = async (email) => {
  const query = "SELECT * FROM admin WHERE email = $1";
  const result = await pool.query(query, [email]);
  return result.rows[0]; // return single admin or undefined
};

// export default { getAdminByEmail };
