const express = require("express");
const router = express.Router();
const connect = require("./db");

router.get("/customer-report", async (req, res) => {
    const { filter, start, end, sortField = "name", sortOrder = "asc" } = req.query;

    try {
        const pool = await connect();

        let query = "";
        let params = [];

        // Format date condition if both start and end are given
        let hasDateRange = start && end;

        // Validate sortField and sortOrder
        const validSortFields = ["name", "reservations", "transactions", "total_spent"];
        const validSortOrders = ["asc", "desc"];
        const sortFieldValidated = validSortFields.includes(sortField) ? sortField : "name";
        const sortOrderValidated = validSortOrders.includes(sortOrder) ? sortOrder : "asc";

        if (filter === "reservations") {
            query = `
                SELECT 
                    customers.customer_id, 
                    customers.name, 
                    customers.phone_number, 
                    customers.email, 
                    COUNT(reservations.reservation_id) AS reservations
                FROM customers
                LEFT JOIN reservations ON customers.email = reservations.email
                ${hasDateRange ? "WHERE reservations.date BETWEEN ? AND ?" : ""}
                GROUP BY customers.customer_id
                HAVING reservations > 0
                ORDER BY ${sortFieldValidated} ${sortOrderValidated};
            `;
            if (hasDateRange) params.push(start, end);

        } else if (filter === "total_spent") {
            query = `
                SELECT 
                    customers.customer_id, 
                    customers.name, 
                    customers.phone_number, 
                    customers.email, 
                    COALESCE(transactions_summary.transactions, 0) AS transactions, 
                    COALESCE(transactions_summary.total_spent, 0.00) AS total_spent
                FROM customers
                LEFT JOIN (
                    SELECT 
                        customer_id, 
                        COUNT(transaction_id) AS transactions, 
                        SUM(total_amount) AS total_spent
                    FROM transactions
                    ${hasDateRange ? "WHERE DATE(created_at) BETWEEN ? AND ?" : ""}
                    GROUP BY customer_id
                ) AS transactions_summary ON customers.customer_id = transactions_summary.customer_id
                ORDER BY ${sortFieldValidated} ${sortOrderValidated};
            `;
            if (hasDateRange) {
                params.push(start, end); // Add start and end dates for filtering
            }

        } else {
            query = `
                SELECT 
                    customers.customer_id, 
                    customers.name, 
                    customers.phone_number, 
                    customers.email, 
                    COALESCE(reservations_summary.reservations, 0) AS reservations, 
                    COALESCE(transactions_summary.transactions, 0) AS transactions, 
                    COALESCE(transactions_summary.total_spent, 0.00) AS total_spent
                FROM customers
                LEFT JOIN (
                    SELECT 
                        email, 
                        COUNT(reservation_id) AS reservations
                    FROM reservations
                    ${hasDateRange ? "WHERE reservation_date BETWEEN ? AND ?" : ""}
                    GROUP BY email
                ) AS reservations_summary ON customers.email = reservations_summary.email
                LEFT JOIN (
                    SELECT 
                        customer_id, 
                        COUNT(transaction_id) AS transactions, 
                        SUM(total_amount) AS total_spent
                    FROM transactions
                    ${hasDateRange ? "WHERE DATE(created_at) BETWEEN ? AND ?" : ""}
                    GROUP BY customer_id
                ) AS transactions_summary ON customers.customer_id = transactions_summary.customer_id
                ORDER BY ${sortFieldValidated} ${sortOrderValidated};
            `;
            if (hasDateRange) {
                params.push(start, end, start, end); // Add start and end dates for filtering
            }
        }

        console.log("Executing query:", query);
        console.log("With parameters:", params);

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error("Error generating customer report:", error.message);
        console.error(error.stack);
        res.status(500).json({ message: "Internal server error." });
    }
});

module.exports = router;
