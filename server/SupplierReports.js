const express = require("express");
const router = express.Router();
const connect = require("./db");

router.get("/supplier-report", async (req, res) => {
    const { view, startDate, endDate, sortField, sortOrder } = req.query;
    const allowedViews = ["all_suppliers", "all_orders"];

    if (!allowedViews.includes(view)) {
        return res.status(400).json({ error: "Invalid view type" });
    }

    try {
        const pool = await connect();
        let query = "";
        let params = [];

        if (view === "all_suppliers") {
            query = `
                SELECT s.name AS supplier_name,
                       COUNT(DISTINCT o.order_id) AS total_orders,
                       SUM(o.quantity_ordered) AS total_items,
                       CAST(SUM(o.quantity_ordered * i.supplier_price) AS DECIMAL(10,2)) AS total_spent,
                       MAX(o.date_ordered) AS last_order_date
                FROM suppliers s
                JOIN items i ON s.supplier_id = i.supplier_id
                JOIN supplier_orders o ON i.item_id = o.item_id
                WHERE 1=1
            `;

            if (startDate) {
                query += ` AND o.date_ordered >= ?`;
                params.push(startDate);
            }
            if (endDate) {
                query += ` AND o.date_ordered <= ?`;
                params.push(endDate);
            }

            query += ` GROUP BY s.supplier_id`;

            const validSorts = ["supplier_name", "total_orders", "total_items", "total_spent", "last_order_date"];
            if (sortField && validSorts.includes(sortField)) {
                query += ` ORDER BY ${sortField} ${sortOrder === "desc" ? "DESC" : "ASC"}`;
            }

        } else if (view === "all_orders") {
            query = `
                SELECT o.date_ordered AS order_date,
                       s.name AS supplier_name,
                       SUM(o.quantity_ordered) AS items_ordered,
                       CAST(SUM(o.quantity_ordered * i.supplier_price) AS DECIMAL(10,2)) AS amount_spent
                FROM supplier_orders o
                JOIN items i ON o.item_id = i.item_id
                JOIN suppliers s ON i.supplier_id = s.supplier_id
                WHERE 1=1
            `;

            if (startDate) {
                query += ` AND o.date_ordered >= ?`;
                params.push(startDate);
            }
            if (endDate) {
                query += ` AND o.date_ordered <= ?`;
                params.push(endDate);
            }

            query += ` GROUP BY o.order_id`;

            const validSorts = ["order_date", "supplier_name", "items_ordered", "amount_spent"];
            if (sortField && validSorts.includes(sortField)) {
                query += ` ORDER BY ${sortField} ${sortOrder === "desc" ? "DESC" : "ASC"}`;
            }
        }

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Supplier report error:", error);
        res.status(500).json({ error: "Failed to fetch report" });
    }
});

module.exports = router;
