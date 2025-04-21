const express = require("express");
const router = express.Router();
const connect = require("./db"); // Your DB connection

router.post("/supplier-orders", async (req, res) => {
    const { item_id, quantity_ordered } = req.body;

    if (!item_id || !quantity_ordered || isNaN(item_id) || isNaN(quantity_ordered) || quantity_ordered <= 0) {
        return res.status(400).json({ message: "Invalid item_id or quantity_ordered." });
    }

    try {
        const pool = await connect();

        // 1. Insert into supplier_orders table
        const insertQuery = `
            INSERT INTO supplier_orders (item_id, quantity_ordered, date_ordered)
            VALUES (?, ?, NOW())
        `;
        const [insertResult] = await pool.execute(insertQuery, [item_id, quantity_ordered]);

        // 2. Update items table by adding the ordered quantity
        const updateQuery = `
            UPDATE items
            SET quantity = quantity + ?
            WHERE item_id = ?
        `;
        await pool.execute(updateQuery, [quantity_ordered, item_id]);

        res.status(201).json({
            message: "Supplier order placed and item quantity updated successfully.",
            order_id: insertResult.insertId
        });
    } catch (error) {
        console.error("Error placing supplier order:", error.message);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
