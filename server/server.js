// Purpose: Server file for backend
require('dotenv').config();
const express = require('express');
const cors = require("cors");
const path = require('path');
const authRoutes = require("./auth");
const db = require("./db");
const transactionRoutes = require("./InpersonTransactions");
const employeeReportRoutes = require("./EmployeeReport");
const app = express();
const logHoursRoute = require("./logHours");
const ItemSalesReportRoutes = require("./ItemSalesReportRoutes");
const multer = require('multer');
const customerReportRoutes = require("./CustomerReport");

app.use(cors());
app.use(express.json({limit: '5mb' })); // Middleware for JSON body parsing, with a limit of 5mb
app.use("/api/auth", authRoutes); // Include auth routes
app.use("/api", logHoursRoute); // Include log hours routes
app.use("/api/sales-report", ItemSalesReportRoutes); 
app.use("/api", customerReportRoutes); // Add this line to include customer report routes



const PORT = process.env.PORT || 80;

// Middleware to handle database connection errors
const dbErrorHandler = async (req, res, next) => {
  try {
    req.dbConnection = await db(); // Get database connection
    // Sets timezone to Central Time Zone
    await req.dbConnection.query("SET time_zone = '-10:00'");
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
//app.use(['/menu', '/users/login', '/dashboard/inventory', '/dashboard/users', '/dashboard/users/delete', '/dashboard/users/update', '/dashboard/users/insert', '/dashboard/suppliers', '/dashboard/suppliers/insert', '/dashboard/suppliers/delete', '/dashboard/suppliers/update', '/dashboard/reorder_alerts'], dbErrorHandler);
app.use(dbErrorHandler);
app.use("/dashboard", transactionRoutes);
app.use("/dashboard", employeeReportRoutes);

app.get('/', (req, res) => {
  res.send('Hi, Node.js v22.14.0 backend! Connect via API to frontend!!!!!! :)');
});

app.get('/api/menu', async (req, res) => {
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query('SELECT name, description, image_data, price FROM items');
    const menuItems = results.map(item => ({
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
      image: item.image_data ? `data:image/jpeg;base64,${item.image_data.toString('base64')}` : null
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
      'SELECT user_id, role, name, email, password FROM users WHERE email = ? AND password = ?', 
      [email, password]
    );
    
    if (results.length > 0) {
      const user = results[0];
      
      // Don't send password back to client
      const userWithoutPassword = {
        user_id: user.user_id,
        role: user.role,
        name: user.name,
        email: user.email
      };
      res.json({ success: true, user: userWithoutPassword });
      
      global.logged_in_user_id = user.user_id;

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
    const [results] = await req.dbConnection.query('SELECT items.item_id as item_id, items.name as item_name, price, quantity, reorder_threshold, image_name, suppliers.name as supplier_name FROM items, suppliers WHERE items.supplier_id = suppliers.supplier_id');
    const inventory = results.map(item => ({
      item_id: item.item_id,
      dessert: item.item_name,
      price: parseFloat(item.price),
      quantity: item.quantity,
      limit: item.reorder_threshold,
      image_name: item.image_name,
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


//USERS

app.get('/dashboard/users', async (req, res) => {
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query('SELECT user_id, name, role, hourly_pay_rate, email FROM users');
    const users = results.map(user => ({
      user_id: user.user_id,
      name: user.name,
      role: user.role,
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
        'INSERT INTO users (role, name, email, password, hourly_pay_rate) VALUES (?, ?, ?, ?, ?)', 
        [role, name, email, password, hourly_pay_rate]
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


app.patch('/dashboard/users/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, hourly_pay_rate, password } = req.body;

  if (!name || !role || !hourly_pay_rate) {
    return res.status(400).json({ error: 'All fields except password are required.' });
  }

  try {
    const baseQuery = 'UPDATE users SET name = ?, role = ?, hourly_pay_rate = ?';
    const values = [name, role, hourly_pay_rate];

    if (password) {
      // Update password as well
      const [result] = await req.dbConnection.query(
        baseQuery + ', password = ? WHERE user_id = ?',
        [...values, password, id]
      );
      return res.json({ success: true, message: 'User and password updated successfully!' });
    } else {
      // Skip updating password
      const [result] = await req.dbConnection.query(
        baseQuery + ' WHERE user_id = ?',
        [...values, id]
      );
      return res.json({ success: true, message: 'User updated successfully!' });
    }

  } catch (err) {
    console.error('Update user error:', err);
    return res.status(500).json({
      error: 'Database update error',
      message: 'An error occurred during updating user.'
    });
  }
});

app.delete('/dashboard/users/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await req.dbConnection.query(
      'DELETE FROM users WHERE user_id = ?',
      [id]
    );

    if (result.affectedRows > 0) {
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


//SUPPLIERS


app.get('/dashboard/suppliers', async (req, res) => {
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query('SELECT name, email, phone_number, rating FROM suppliers');
    const suppliers = results.map(supplier => ({
      name: supplier.name,
      email: supplier.email,
      phone_number: supplier.phone_number,
      rating: parseFloat(supplier.rating)
    }));
    res.json(suppliers);
      
  } catch (err) {
    console.error('Error fetching inventory:', err);
    return res.status(500).json({ 
      error: 'Database query error', 
      message: 'Failed to fetch inventory.' 
    });
  }
}
);

app.post('/dashboard/suppliers/insert', async (req, res) => {
  const { name, email, phone_number, rating } = req.body;
  if (!name || !email || !phone_number || !rating) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  try {
    // Connection is now available as req.dbConnection
    const [results] = await req.dbConnection.query(
      'SELECT email, phone_number FROM suppliers WHERE email = ? OR phone_number = ?',
      [email, phone_number] 
    );
    
    if (results.length > 0) {
      return res.status(409).json({ error: 'Email or phone number already in use!' });
    } else {
      const [insertResult] = await req.dbConnection.query(
        'INSERT INTO suppliers (name, email, phone_number, rating) VALUES (?, ?, ?, ?)', 
        [name, email, phone_number, rating]
      );
      if (insertResult.affectedRows > 0) {
        res.json({ success: true, message: 'Supplier added successfully!' });
      }
      else {
        return res.status(500).json({ error: 'Failed to add supplier.' });
      }
    }
    
  } catch (err) {
    console.error('Insert supplier error:', err);
    return res.status(500).json({ 
      error: 'Database insert error', 
      message: 'An error occurred during inserting supplier.' 
    });
  }
});

app.delete('/dashboard/suppliers/delete', async (req, res) => {
  const { email } = req.body;
  

  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  
  try {
    // Connection is now available as req.dbConnection
    const [deleteResult] = await req.dbConnection.query(
      'DELETE FROM suppliers WHERE email = ?', 
      [email]
    );
    
    if (deleteResult.affectedRows > 0) {
      res.json({ success: true, message: 'Supplier deleted successfully!' });
    } else {
      return res.status(404).json({ error: 'Supplier not found.' });
    }
    
  } catch (err) {
    console.error('Delete supplier error:', err);
    return res.status(500).json({ 
      error: 'Database delete error', 
      message: 'An error occurred during deleting supplier.' 
    });
  }
});

app.patch('/dashboard/suppliers/update', async (req, res) => {
  const { name, email, phone_number, rating } = req.body;
  if (!name || !email || !phone_number || !rating) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  
  try {
    // Connection is now available as req.dbConnection
    const [updateResult] = await req.dbConnection.query(
      'UPDATE suppliers SET name = ?, phone_number = ?, rating = ? WHERE email = ?', 
      [name, phone_number, rating, email]
    );
    
    if (updateResult.affectedRows > 0) {
      res.json({ success: true, message: 'Supplier updated successfully!' });
    } else {
      return res.status(404).json({ error: 'Supplier not found.' });
    }
    
  } catch (err) {
    console.error('Update supplier error:', err);
    return res.status(500).json({ 
      error: 'Database update error', 
      message: 'An error occurred during updating supplier.' 
    });
  }
}
);

app.get('/dashboard/reorder_alerts', async (req, res) => {
  try {
    const [results] = await req.dbConnection.query('SELECT items.name as item_name, alert_date, resolved FROM reorder_alerts, items WHERE afk_item_id = item_id');
    const alerts = results.map(alert => ({
      item: alert.item_name,
      timestamp: alert.alert_date,
      resolved: alert.resolved
    }));
    res.json(alerts);
  } catch (err) {
    console.error('Error fetching alerts:', err);
    return res.status(500).json({
      error: 'Database query error',
      message : 'Failed to fetch alerts.'
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


const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // file size limit of 5MB
});

app.patch('/dashboard/items/:itemId', upload.single('image'), async (req, res) => {
  console.log('Received request to update item:', req.params.itemId);
  const itemId = req.params.itemId;
  const updatedItemData = req.body;
  const newImage = req.file;

  try {
    const connection = await req.dbConnection.getConnection();
    let updateQuery = 'UPDATE items SET name = ?, price = ?, quantity = ?, reorder_threshold = ?, supplier_id = (SELECT supplier_id FROM suppliers WHERE name = ?) WHERE item_id = ?';
    const updateValues = [
      updatedItemData.dessert,
      parseFloat(updatedItemData.price),
      parseInt(updatedItemData.quantity),
      parseInt(updatedItemData.limit),
      updatedItemData.supplier,
      itemId, // itemId for the WHERE 
    ];

    if (newImage) {
      updateQuery = 'UPDATE items SET name = ?, price = ?, quantity = ?, reorder_threshold = ?, supplier_id = (SELECT supplier_id FROM suppliers WHERE name = ?), image_name = ?, image_data = ? WHERE item_id = ?';
      updateValues.pop(); // Remove the itemId added earlier
      updateValues.push(newImage.originalname, newImage.buffer, itemId); // Add image name, data, and then itemId
    }

    const [updateResult] = await connection.execute(updateQuery, updateValues);

    if (updateResult.affectedRows > 0) {
      const [updatedRows] = await connection.execute(
        'SELECT items.item_id as item_id, items.name as item_name, price, quantity, reorder_threshold, image_name, suppliers.name as supplier_name FROM items, suppliers WHERE items.supplier_id = suppliers.supplier_id AND items.item_id = ?',
        [itemId]
      );
      const updatedItem = updatedRows.map(item => ({
        item_id: item.item_id,
        dessert: item.item_name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        limit: item.reorder_threshold,
        image_name: item.image_name,
        supplier: item.supplier_name
      }))[0];

      connection.release();
      res.json(updatedItem);
    }
    else {
      connection.release();
      return res.status(404).json({ error: 'Item not found or no changes made.' });
    }
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});


app.delete('/dashboard/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await db();
    const [result] = await connection.execute('DELETE FROM items WHERE item_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

app.post('/dashboard/items', upload.single('image'), async (req, res) => {
  const { dessert, price, quantity, limit, supplier } = req.body;
  const newImage = req.file;

  if (!dessert || !price || !quantity || !limit || !supplier) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const connection = await req.dbConnection.getConnection();
    let insertQuery = `INSERT INTO items (name, price, quantity, reorder_threshold, supplier_id) VALUES (?, ?, ?, ?, (SELECT supplier_id FROM suppliers WHERE name = ?))`;
    const insertValues = [dessert, price, quantity, limit, supplier];

    if (newImage) {
      insertQuery = `INSERT INTO items (name, price, quantity, reorder_threshold, supplier_id, image_name, image_data) VALUES (?, ?, ?, ?, (SELECT supplier_id FROM suppliers WHERE name = ?), ?, ?)`;
      insertValues.push(newImage.originalname, newImage.buffer);
    }

    const [result] = await connection.execute(insertQuery, insertValues);

    const newItem = {
      item_id: result.insertId,
      dessert,
      price: parseFloat(price),
      quantity,
      limit,
      supplier,
      image_name: newImage ? newImage.originalname : null,
    };

    connection.release();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Add item error:", error);
    res.status(500).json({ error: "Failed to add item." });
  }
});

//reservations

app.post('/api/reservations', async (req, res) => {
  const { name, email, phone, num_guests, date, time, table_name, special_requests } = req.body;

  try {

    const [existing] = await req.dbConnection.query(
      `SELECT COUNT(*) as count FROM reservations WHERE email = ? AND date = ?`,
      [email, date]
    );

    if (existing[0].count >= 2) {
      return res.status(403).json({ message: 'Limit reached: You may only make 2 reservations per day.' });
    }

    const [conflicts] = await req.dbConnection.query(
      `SELECT * FROM reservations
       WHERE table_name = ?
         AND date = ?
         AND ABS(TIMESTAMPDIFF(MINUTE, time, ?)) < 120`,
      [table_name, date, time]
    );

    if (conflicts.length > 0) {
      return res.status(409).json({ message: 'Table is already booked during this time.' });
    }

    await req.dbConnection.query(
      `INSERT INTO reservations (name, email, phone, num_guests, date, time, table_name, special_requests)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, phone, num_guests, date, time, table_name, special_requests]
    );

    res.status(200).json({ message: 'Reservation successful!' });
  } catch (err) {
    console.error('Reservation error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

app.get("/api/reservations", async (req, res) => {
  const { date } = req.query;
  const connection = await req.dbConnection;

  try {
    const [results] = await connection.execute(
      "SELECT table_name, time FROM reservations WHERE date = ?",
      [date]
    );

    res.json(results);
  } catch (error) {
    console.error("Fetch reservations error:", error);
    res.status(500).json({ error: "Database fetch error" });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => { // move catch all get to the end
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
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