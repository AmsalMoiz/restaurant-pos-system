require('dotenv').config(); // Load environment variables from .env

const mysql = require('mysql2/promise');

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_DATABASE,
  // Connection pool settings
  waitForConnections: true,
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0, // Unlimited queue
  // Correct timeout setting
  connectTimeout: 60000, // Connection timeout in milliseconds
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Database pool error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('Database connection was closed. Will be re-established on next query.');
  }
});

// Ping database to check for connection status periodically
setInterval(async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connection is healthy');
  } catch (error) {
    console.error('Error pinging database:', error);
  }
}, 300000); // Check every 5 minutes

async function connect() {
  try {
    // Get a connection from the pool
    return pool;
  } catch (error) {
    console.error('Error getting connection from pool:', error);
    throw error;
  }
}



module.exports = connect;

// async function testConnection() {
//     try {
//       const connection = await connect();
//       const [rows] = await connection.execute('SELECT 1');
//       console.log('Database connection successful:', rows);
//     } catch (error) {
//       console.error('Database connection failed:', error);
//     }
//   }
  
// testConnection(); // Test the database connection
