const express = require("express");
const connect = require("./db"); // database connection file

const router = express.Router();

// Login Route
router.post("/login", async (req, res) => { // POST /api/auth/login
  const { email, password } = req.body; // Get email and password from request body

  if (!email || !password) { // Check if email and password are provided
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const connection = await connect(); // Connect to the database
    if (!connection) {
      return res.status(500).json({ error: 'Database connection error' });
    }
    const [rows] = await connection.execute( // Query the database
      "SELECT customer_id, password FROM customers WHERE email = ?",
      [email]
    );

    if (rows.length === 0) { // Check if customer with email exists
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const customer = rows[0]; // Get customer from the result
    if (password !== customer.password) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
