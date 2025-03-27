require('dotenv').config(); // Load environment variables from .env

const mysql = require('mysql2/promise');

async function connect() { // Function to connect to the database   
  if (global.connection && global.connection.state !== 'disconnected') { //check if connection is already established
    return global.connection; // If so, return the connection
  }
  
  const connection = await mysql.createConnection({ //if issures with connection, will try create pool
    host: process.env.DB_HOST, // Load host from .env
    user: process.env.DB_USER, // Load user from .env
    password: process.env.DB_PASSWORD, // Load password from .env
    database: process.env.DB_DATABASE, // Load database from .env
  });

  global.connection = connection;
  return connection;
}

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
  

module.exports = connect;