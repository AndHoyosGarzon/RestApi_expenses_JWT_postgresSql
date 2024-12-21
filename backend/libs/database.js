import pg from "pg";
import { config } from "dotenv";

config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
});
