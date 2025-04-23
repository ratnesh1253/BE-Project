import { pool } from "./models/db.js"; // Note the .js extension is required in ES modules
import bcrypt from "bcrypt";

async function createAdmin() {
  try {
    const password = "admin@1234";
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
            INSERT INTO admin (first_name, last_name, email, password)
            VALUES ('Ratnesh', 'Kshirsagar', 'admin@tollcollection.com', $1);
        `;

    await pool.query(query, [hashedPassword]);
    console.log("Admin created successfully with hashed password");
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await pool.end(); // Close the connection pool when done
  }
}

createAdmin();
