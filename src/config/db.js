import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

let dbConnection;

if (process.env.NODE_ENV === "production") {
  dbConnection = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  dbConnection = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
}

export default dbConnection;
