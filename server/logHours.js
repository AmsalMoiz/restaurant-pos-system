const express = require("express");
const router = express.Router();
const db = require("./db"); // Ensure this is the correct path to your db.js file

// Route to log hours worked
router.post("/log-hours", async (req, res) => {
    const { hours_worked, date_worked } = req.body;

    // Get user_id from the session
    const user_id = global.logged_in_user_id; // Assuming this is set when the user logs in

    if (!user_id) {
        return res.status(401).json({ message: "Unauthorized. User not logged in." });
    }

    // Validate input
    if (!hours_worked || hours_worked <= 0 || !date_worked) {
        return res.status(400).json({ message: "Invalid input. Please provide hours_worked and date_worked." });
    }

    const sql = `
        INSERT INTO time_logs (user_id, hours_worked, date_worked, date_submitted)
        VALUES (?, ?, ?, NOW())
    `;

    try {
        const connection = await db(); // Get the database connection
        const [results] = await connection.query(sql, [user_id, hours_worked, date_worked]);
        res.json({ message: "Hours logged successfully!", log_id: results.insertId });
    } catch (err) {
        console.error("Log hours error:", err);
        res.status(500).json({ message: "Failed to log hours.", error: err.message });
    }
});

// Route to fetch logged hours for a specific user
router.get("/log-hours", async (req, res) => {
    // Get user_id from the session
    const user_id = req.session?.user?.id;

    if (!user_id) {
        return res.status(401).json({ message: "Unauthorized. User not logged in." });
    }

    const sql = `
        SELECT log_id, hours_worked, date_worked, date_submitted
        FROM time_logs
        WHERE user_id = ?
        ORDER BY date_worked DESC
    `;

    try {
        const connection = await db(); // Get the database connection
        const [results] = await connection.query(sql, [user_id]);

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ message: "No logged hours found for this user." });
        }
    } catch (err) {
        console.error("Fetch logged hours error:", err);
        res.status(500).json({ message: "Failed to fetch logged hours.", error: err.message });
    }
});

module.exports = router;