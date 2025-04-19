const express = require('express');
const router = express.Router();

// Start the transaction, some empty values
router.post('/initial/transaction', async (req, res) => {
    const { user_id, payment_method, order_type } = req.body;
    if (!user_id || !payment_method || !order_type) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    let connection;
    try {
      // Get a connection from the pool and start a transaction
      connection = await req.dbConnection.getConnection();
      await connection.beginTransaction();
      const status = 'Processing'; // Default status
      // Insert the transaction record
      const [insertResult] = await connection.query(
        "INSERT INTO transactions (user_id, payment_method, status, order_type) VALUES (?, ?, ?, ?)", 
        [user_id, payment_method, status, order_type]
      );
      
      if (insertResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(500).json({ error: 'Failed to add initial transaction.' });
      }
      
      // Get the inserted transaction ID directly from the insert result
      const transaction_id = insertResult.insertId;
      
      // Commit the transaction
      await connection.commit();
      console.log('Transaction ID:', transaction_id);
      // Return both success message and the new transaction ID
      res.json({ 
        success: true, 
        message: 'Transaction added successfully!',
        transaction_id: transaction_id 
      });
      
    } catch (err) {
      // Roll back the transaction in case of error
      if (connection) await connection.rollback();
      console.error('Insert transaction error:', err);
      return res.status(500).json({ 
        error: 'Database insert error', 
        message: 'An error occurred during inserting initial transaction.' 
      });
    } finally {
      // Release the connection back to the pool
      if (connection) connection.release();
    }
  });

// Starts setting up the transaction_items
router.post('/transaction_items', async (req, res) => {
    const { transaction_id, item_id, quantity } = req.body;
    if (!transaction_id || !item_id || !quantity) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    
    try {
      // First get the item price
      const [itemResult] = await req.dbConnection.query(
        'SELECT price FROM items WHERE item_id = ?', 
        [item_id]
      );
      
      if (itemResult.length === 0) {
        return res.status(404).json({ error: 'Item not found.' });
      }
      
      const price = itemResult[0].price;
      const subtotal = price * quantity;
      
      // Then insert the transaction item with calculated subtotal
      const [insertResult] = await req.dbConnection.query(
        'INSERT INTO transaction_items (transaction_id, item_id, quantity_purchased, subtotal) VALUES (?, ?, ?, ?)', 
        [transaction_id, item_id, quantity, subtotal]
      );
      
      if (insertResult.affectedRows > 0) {
        res.json({ success: true, message: 'Transaction item added successfully!' });
      } else {
        return res.status(500).json({ error: 'Failed to add transaction item.' });
      }
    } catch (err) {
      console.error('Insert transaction item error:', err);
      return res.status(500).json({ error: 'Database error', message: err.message });
    }
  });

// Finally updates the transaction to fill the missing values
router.patch('/end/transaction', async (req, res) => {
  const { transaction_id, tip_amount } = req.body;
  if (!transaction_id) {
    return res.status(400).json({ error: 'Transaction ID is required.' });
  }
  
  const tipAmount = tip_amount || 0;
  let connection;
  
  try {
    // Get a connection from the pool and start a transaction
    connection = await req.dbConnection.getConnection();
    await connection.beginTransaction();
    
    // First get all subtotals from transaction items sharing same transaction_id
    const [subtotalResults] = await connection.query(
      'SELECT SUM(subtotal) as subtotals FROM transaction_items WHERE transaction_id = ?', 
      [transaction_id]
    );
    
    if (!subtotalResults[0].subtotals) {
      await connection.rollback();
      return res.status(404).json({ error: 'No items found for this transaction.' });
    }
    const status = 'Completed'; // Update status to Completed
    const subtotal = subtotalResults[0].subtotals;
    const [updateResult] = await connection.query(
      'UPDATE transactions SET subtotal = ?, status = ?, tip_amount = ? WHERE transaction_id = ?', 
      [subtotal, status, tipAmount, transaction_id]
    );
    
    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    await connection.commit();
    
    // Send a success response
    res.json({ 
      success: true, 
      message: 'Transaction updated successfully!',
      transaction_id: transaction_id
    });
    
  } catch (err) {
    // Rollback on error
    if (connection) await connection.rollback();
    console.error('Finalize transaction error:', err);
    return res.status(500).json({ 
      error: 'Database update error', 
      message: 'An error occurred while finalizing the transaction.' 
    });
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
});

module.exports = router;
