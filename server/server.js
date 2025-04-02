// Purpose: Server file for backend
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const authRoutes = require("./auth");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json()); // Middleware for JSON body parsing
app.use("/api/auth", authRoutes); // Include auth routes

const PORT = process.env.PORT || 3001;

// Middleware to handle database connection errors
const dbErrorHandler = async (req, res, next) => {
  try {
    req.dbConnection = await db(); // Get database connection
    next();
  } catch (error) {
    console.error('Database connection error in middleware:', error);
    return res.status(500).json({ 
      error: 'Database connection error', 
      message: 'Unable to connect to the database. Please try again later.' 
    });
  }
};

// Apply the database middleware to all routes that need DB access
app.use(['/menu', '/users/login', '/dashboard/inventory', '/dashboard/users', '/dashboard/users/delete', '/dashboard/users/update', '/dashboard/users/insert'], dbErrorHandler);

app.get('/', (req, res) => {
  res.send('Hi, Node.js v22.14.0 backend! Connect via API to frontend!!!!!! :)');
});

app.get('/menu', async (req, res) => {
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query('SELECT name, description, image_name, price FROM items');
    const menuItems = results.map(item => ({
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image: item.image_name
    }));
    res.json(menuItems);
  } catch (err) {
    console.error('Error fetching menu:', err);
    return res.status(500).json({ 
      error: 'Database query error', 
      message: 'Failed to fetch menu items.' 
    });
  }
});

app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query(
      'SELECT role, name, email, password FROM users WHERE email = ? AND password = ?', 
      [email, password]
    );
    
    if (results.length > 0) {
      const user = results[0];
      
      // Don't send password back to client
      const userWithoutPassword = {
        role: user.role,
        name: user.name,
        email: user.email
      };
      res.json({ success: true, user: userWithoutPassword });
    } else {
      return res.status(401).json({ error: 'Invalid email or password!' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ 
      error: 'Database query error', 
      message: 'An error occurred during login.' 
    });
  }
});

/* USER DASHBOARD */
app.get('/dashboard/inventory', async (req, res) => {
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query('SELECT items.name as item_name, price, quantity, reorder_threshold, suppliers.name as supplier_name FROM items, suppliers WHERE items.supplier_id = suppliers.supplier_id');
    const inventory = results.map(item => ({
      dessert: item.item_name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      limit: item.reorder_threshold,
      supplier: item.supplier_name
    }));
    res.json(inventory);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    return res.status(500).json({ 
      error: 'Database query error', 
      message: 'Failed to fetch inventory.' 
    });
  }
});

app.get('/dashboard/users', async (req, res) => {
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query('SELECT name, role, hours_worked, hourly_pay_rate, email FROM users');
    const users = results.map(user => ({
      name: user.name,
      role: user.role,
      hours: parseFloat(user.hours_worked),
      pay: parseFloat(user.hourly_pay_rate),
      email: user.email
    }));
    res.json(users);
      
  } catch (err) {
    console.error('Error fetching inventory:', err);
    return res.status(500).json({ 
      error: 'Database query error', 
      message: 'Failed to fetch inventory.' 
    });
  }
});

app.post('/dashboard/users/insert', async (req, res) => {
  const { role, name, email, password, hourly_pay_rate } = req.body;
  if (!role || !name || !email || !password || !hourly_pay_rate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query(
      'SELECT email FROM users WHERE email = ? ', 
      [email]
    );
    
    if (results.length > 0) {
      return res.status(409).json({ error: 'Email already in use!' });
    } else {
      const [insertResult] = await req.dbConnection.query(
        'INSERT INTO users (role, name, email, password, hours_worked, hourly_pay_rate) VALUES (?, ?, ?, ?, ?, ?)', 
        [role, name, email, password, 0, hourly_pay_rate]
      );
      if (insertResult.affectedRows > 0) {
        res.json({ success: true, message: 'User added successfully!' });
      }
      else {
        return res.status(500).json({ error: 'Failed to add user.' });
      }
    }
    
  } catch (err) {
    console.error('Insert user error:', err);
    return res.status(500).json({ 
      error: 'Database insert error', 
      message: 'An error occurred during inserting user.' 
    });
  }
});

app.delete('/dashboard/users/delete', async (req, res) => {
  const { email } = req.body;
  

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  
  try {
    // Connection is now available as req.dbConnection
    const [deleteResult] = await req.dbConnection.query(
      'DELETE FROM users WHERE email = ?', 
      [email]
    );
    
    if (deleteResult.affectedRows > 0) {
      res.json({ success: true, message: 'User deleted successfully!' });
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
    
  } catch (err) {
    console.error('Delete user error:', err);
    return res.status(500).json({ 
      error: 'Database delete error', 
      message: 'An error occurred during deleting user.' 
    });
  }
});

app.patch('/dashboard/users/update', async (req, res) => {
  const { role, name, email, hourly_pay_rate } = req.body;
  if (!role || !name || !email || !hourly_pay_rate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  try {
    // Connection is now available as req.dbConnection
    const [updateResult] = await req.dbConnection.query(
      'UPDATE users SET role = ?, name = ?, hourly_pay_rate = ? WHERE email = ?', 
      [role, name, hourly_pay_rate, email]
    );
    
    if (updateResult.affectedRows > 0) {
      res.json({ success: true, message: 'User updated successfully!' });
    } else {
      return res.status(404).json({ error: 'User not found.' });
    }
    
  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({ 
      error: 'Database update error', 
      message: 'An error occurred during updating user.' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Server error', 
    message: 'An unexpected error occurred.' 
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle application shutdown
process.on('SIGINT', () => {
  console.log('Application shutting down...');
  // Close database connections or perform cleanup if needed
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Log to monitoring service or file
  process.exit(1);
});
/*
// Purpose: Server file for backend
const express = require('express');
const cors = require("cors");
const authRoutes = require("./auth");
const db = require("./db");

const app = express();
app.use(cors());

app.use(express.json()); // Middleware for JSON body parsing
app.use("/api/auth", authRoutes); // Include auth routes

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hi, Node.js v22.14.0 backend! Connect via API to frontend!!!!!! :)');
});

app.get('/menu', async (req, res) => {
  try {
    const connection = await db(); // Await the connection
    const [results] = await connection.query('SELECT name, description, image_name, price FROM items');
    const menuItems = results.map(item => ({
      //id: item.item_id,
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image: item.image_name
    }));
    res.json(menuItems);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try{
    const connection = await db(); // Get the connection
    const [results] = await connection.query('SELECT role, name, email, password FROM users WHERE email = ? AND password = ?', [email, password]);
    if (results.length > 0) {
      const user = results[0];
            
      // Don't send password back to client
      const userWithoutPassword = {
      role: user.role,
      name: user.name,
      email: user.email
      };
      res.json({ success: true, user: userWithoutPassword });
    }
    else {
      return res.status(401).json({ error: 'Invalid email or password!' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
  
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/