import pg from "pg";
const { Pool } = pg; // Destructure Pool from the default export

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Toll Collection",
  password: "root",
  port: 5432,
});

export { pool };
