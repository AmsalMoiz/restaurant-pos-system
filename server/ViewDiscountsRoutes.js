const express = require("express");
const connect = require("./db"); // database connection file

const router = express.Router();

router.get('/discounts', async (req, res) => {

  try {
    const connection = await connect();

    if (!connection) {
      return res.status(500).json({ error: 'Database connection error' });
    }
    const [rows] = await connection.execute('SELECT * FROM discounts');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ error: 'Failed to fetch discounts' });
  }
});


//get a single discount
router.get('/discounts/:id', async (req, res) => {
  try {
    const connection = await connect();
    
    if (!connection) {
      return res.status(500).json({ error: 'Database connection error' });
    }
    const [rows] = await connection.execute(
      'SELECT * FROM discounts WHERE discount_id = ?',
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching discount:', error);
    res.status(500).json({ error: 'Failed to fetch discount' });
  }
});

router.post('/discounts', async (req, res) => {
  try {
    const { 
      code, 
      discount_type, 
      value, 
      start_date, 
      end_date, 
      is_active 
    } = req.body;
    
    const connection = await connect();
    
    if (!connection) {
      return res.status(500).json({ error: 'Database connection error' });
    }
    console.log(req.body);
    // Validate required fields
    if (!code || !discount_type || !value || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const [result] = await connection.execute(
      'INSERT INTO discounts (code, discount_type, value, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [code, discount_type, value, start_date, end_date, is_active ? 1 : 0]
    );
    
    res.status(201).json({ 
      message: 'Discount created successfully',
      discount_id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating discount:', error);
    res.status(500).json({ error: 'Failed to create discount' });
  }
});

// Update a discount
router.put('/discounts/:id', async (req, res) => {
  try {
    const { 
      code, 
      discount_type, 
      value, 
      start_date, 
      end_date, 
      is_active 
    } = req.body;
    
    const connection = await connect();
    
    if (!connection) {
      return res.status(500).json({ error: 'Database connection error' });
    }
    
    // Check if discount exists
    const [existingDiscount] = await connection.execute(
      'SELECT * FROM discounts WHERE discount_id = ?',
      [req.params.id]
    );
    
    if (existingDiscount.length === 0) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    
    // Build update query dynamically based on provided fields
    let updateFields = [];
    let queryParams = [];
    
    if (code !== undefined) {
      updateFields.push('code = ?');
      queryParams.push(code);
    }
    
    if (discount_type !== undefined) {
      updateFields.push('discount_type = ?');
      queryParams.push(discount_type);
    }
    
    if (value !== undefined) {
      updateFields.push('value = ?');
      queryParams.push(value);
    }
    
    if (start_date !== undefined) {
      updateFields.push('start_date = ?');
      queryParams.push(start_date);
    }
    
    if (end_date !== undefined) {
      updateFields.push('end_date = ?');
      queryParams.push(end_date);
    }
    
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      queryParams.push(is_active ? 1 : 0);
    }
    
    // If nothing to update
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    // Add discount_id to params
    queryParams.push(req.params.id);
    
    await connection.execute(
      `UPDATE discounts SET ${updateFields.join(', ')} WHERE discount_id = ?`,
      queryParams
    );
    
    res.json({ message: 'Discount updated successfully' });
  } catch (error) {
    console.error('Error updating discount:', error);
    res.status(500).json({ error: 'Failed to update discount' });
  }
});

// Delete a discount
router.delete('/discounts/:id', async (req, res) => {
  try {
    const connection = await connect();
    
    if (!connection) {
      return res.status(500).json({ error: 'Database connection error' });
    }
    
    // Check if discount exists
    const [existingDiscount] = await connection.execute(
      'SELECT * FROM discounts WHERE discount_id = ?',
      [req.params.id]
    );
    
    if (existingDiscount.length === 0) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    
    await connection.execute(
      'DELETE FROM discounts WHERE discount_id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'Discount deleted successfully' });
  } catch (error) {
    console.error('Error deleting discount:', error);
    res.status(500).json({ error: 'Failed to delete discount' });
  }
});

module.exports = router;