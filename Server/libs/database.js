import pg from 'pg'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certificates
    ca: fs.readFileSync("C:/Users/yogesh/Downloads/ca.pem").toString(), // Path to your CA certificate
  },
});
