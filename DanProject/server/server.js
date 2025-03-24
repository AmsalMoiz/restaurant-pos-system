const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3002;
require('dotenv').config();
const mysql = require('mysql2');

var db=mysql.createConnection({
  host:"restaurant-pos.mysql.database.azure.com", 
  user:"pos_user", 
  password:'V32np-v>k#:K"/sd(r2B!WE,^?_"ke', 
  database:"mydb", 
  port:3306,
  ssl: { // Enable SSL
    rejectUnauthorized: true,
  },
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Basic route
app.get('/', (req, res) => {
  res.send('API is working! Try /users');
});

// API route to fetch users from the database (staff users)
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ------------------- CUSTOMER ROUTES -------------------

// Get all customers (for testing purposes)
app.get('/customers', (req, res) => {
  db.query('SELECT customer_id, customer_name, customer_email, customer_phone_num FROM customers', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Customer login
app.post('/customers/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT customer_id, customer_name, customer_email, customer_phone_num FROM customers WHERE customer_email = ? AND customer_password = ?',
    [email, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      res.json({ success: true, customer: results[0] });
    }
  );
});

// Customer registration
app.post('/customers/register', (req, res) => {
  const { name, email, phone, password, cardNumber, expiry, cvv } = req.body;
  
  // First check if email already exists
  db.query(
    'SELECT customer_id FROM customers WHERE customer_email = ?',
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      if (results.length > 0) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      
      // Get the next available customer_id
      db.query('SELECT MAX(customer_id) as max_id FROM customers', (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        
        const nextId = (results[0].max_id || 0) + 1;
        
        // Insert the new customer
        db.query(
          'INSERT INTO customers (customer_id, customer_name, customer_email, customer_phone_num, customer_password, customer_card_num, customer_exp, customer_cvv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [nextId, name, email, phone, password, cardNumber || null, expiry || null, cvv || null],
          (err, results) => {
            if (err) {
              return res.status(500).json({ error: err.message });
            }
            
            res.json({ 
              success: true, 
              customer: { 
                customer_id: nextId, 
                customer_name: name, 
                customer_email: email, 
                customer_phone_num: phone 
              } 
            });
          }
        );
      });
    }
  );
});

// Update customer profile
app.put('/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, cardNumber, expiry, cvv } = req.body;
  
  let query = 'UPDATE customers SET ';
  const updateValues = [];
  const params = [];
  
  if (name) {
    updateValues.push('customer_name = ?');
    params.push(name);
  }
  
  if (phone) {
    updateValues.push('customer_phone_num = ?');
    params.push(phone);
  }
  
  if (cardNumber) {
    updateValues.push('customer_card_num = ?');
    params.push(cardNumber);
  }
  
  if (expiry) {
    updateValues.push('customer_exp = ?');
    params.push(expiry);
  }
  
  if (cvv) {
    updateValues.push('customer_cvv = ?');
    params.push(cvv);
  }
  
  if (updateValues.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  query += updateValues.join(', ') + ' WHERE customer_id = ?';
  params.push(id);
  
  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json({ success: true });
  });
});

// ------------------- MENU ROUTES -------------------

// Get all menu items
app.get('/menu', (req, res) => {
  db.query('SELECT * FROM items', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const menuItems = results.map(item => ({
      id: item.item_id,
      name: item.item_name,
      description: `${item.item_category} category item`,
      price: parseFloat(item.item_cost),
      category: item.item_category,
      image: '/api/placeholder/100/100' // Placeholder image
    }));
    
    res.json(menuItems);
  });
});

// ------------------- ORDER ROUTES -------------------

// Create a new online order
app.post('/orders', (req, res) => {
  const { customerId, items, subtotal, total, discountId = null } = req.body;
  
  // Start a transaction
  db.beginTransaction(err => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Get the next available online_id
    db.query('SELECT MAX(online_id) as max_id FROM online_transactions', (err, results) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message });
        });
      }
      
      const nextOrderId = (results[0].max_id || 0) + 1;
      
      // Insert the order
      db.query(
        'INSERT INTO online_transactions (online_id, fk_online_customer_id, online_subtotal, fk_discount_id, online_total) VALUES (?, ?, ?, ?, ?)',
        [nextOrderId, customerId, subtotal, discountId, total],
        (err, results) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message });
            });
          }
          
          // Get the next available online_item_id
          db.query('SELECT MAX(online_item_id) as max_id FROM online_transaction_items', (err, results) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: err.message });
              });
            }
            
            let nextItemId = (results[0].max_id || 0) + 1;
            const orderItems = [];
            
            // Process each order item
            const processItems = items.map(item => {
              return new Promise((resolve, reject) => {
                const itemSubtotal = parseFloat(item.price) * item.quantity;
                
                db.query(
                  'INSERT INTO online_transaction_ttems (online_item_id, ofk_item_id, online_item_quantity, online_item_subtotal, fk_online_id) VALUES (?, ?, ?, ?, ?)',
                  [nextItemId, item.id, item.quantity, itemSubtotal, nextOrderId],
                  (err, results) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    
                    orderItems.push({
                      id: nextItemId,
                      item_id: item.id,
                      quantity: item.quantity,
                      subtotal: itemSubtotal
                    });
                    
                    nextItemId++;
                    resolve();
                  }
                );
              });
            });
            
            Promise.all(processItems)
              .then(() => {
                db.commit(err => {
                  if (err) {
                    return db.rollback(() => {
                      res.status(500).json({ error: err.message });
                    });
                  }
                  
                  res.json({ 
                    success: true, 
                    order: {
                      id: nextOrderId,
                      customer_id: customerId,
                      subtotal,
                      total,
                      discount_id: discountId,
                      timestamp: new Date(),
                      items: orderItems
                    }
                  });
                });
              })
              .catch(err => {
                db.rollback(() => {
                  res.status(500).json({ error: err.message });
                });
              });
          });
        }
      );
    });
  });
});

// Get customer's order history
app.get('/customers/:id/orders', (req, res) => {
  const { id } = req.params;
  
  db.query(
    `SELECT ot.online_id, ot.online_subtotal, ot.online_total, ot.online_timestamp,
            oti.online_item_id, oti.ofk_item_id, oti.online_item_quantity, oti.online_item_subtotal,
            i.item_name, i.item_category, i.item_cost
     FROM online_transactions ot
     JOIN online_transaction_items oti ON ot.online_id = oti.fk_online_id
     JOIN Items i ON oti.ofk_item_id = i.item_id
     WHERE ot.fk_online_customer_id = ?
     ORDER BY ot.online_timestamp DESC`,
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      // Group the results by order
      const orders = {};
      results.forEach(row => {
        const orderId = row.online_id;
        
        if (!orders[orderId]) {
          orders[orderId] = {
            id: orderId,
            subtotal: parseFloat(row.online_subtotal),
            total: parseFloat(row.online_total),
            timestamp: row.online_timestamp,
            items: []
          };
        }
        
        orders[orderId].items.push({
          id: row.online_item_id,
          item_id: row.ofk_item_id,
          name: row.item_name,
          category: row.item_category,
          price: parseFloat(row.item_cost),
          quantity: row.online_item_quantity,
          subtotal: parseFloat(row.online_item_subtotal)
        });
      });
      
      res.json(Object.values(orders));
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});