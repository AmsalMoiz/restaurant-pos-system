const express = require('express');
const connect = require('./db');
const moment = require('moment-timezone');

const router = express.Router();

// GET routes:
router.get("/items/names", async (req, res) => {
    try {
        const connection = await connect(); // Connect to the database
        if (!connection) {
            return res.status(500).json({ error: 'Database connection error' });
        }
        const [rows] = await connection.execute('SELECT name FROM items');
        const itemNames = rows.map(row => row.name);
        res.json(itemNames);
    } catch (error) {
        console.error('Error fetching item names:', error);
        res.status(500).json({ error: 'Failed to fetch item names' });
    }
});

router.get('/transactions/payment-methods', async (req, res) => {
    try {
        const connection = await connect(); // Connect to the database
        if (!connection) {
            return res.status(500).json({ error: 'Database connection error' });
        }
        const [rows] = await connection.execute('SELECT DISTINCT payment_method FROM transactions');
        const paymentMethods = rows.map(row => row.payment_method).filter(Boolean); // Filter out null/empty
        res.json(paymentMethods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
});

router.get('/transactions/statuses', async (req, res) => {
    try {
        const connection = await connect(); // Connect to the database
        if (!connection) {
            return res.status(500).json({ error: 'Database connection error' });
        }
        const [rows] = await connection.execute('SELECT DISTINCT status FROM transactions');
        const statuses = rows.map(row => row.status).filter(Boolean); // Filter out null/empty
        res.json(statuses);
    } catch (error) {
        console.error('Error fetching transaction statuses:', error);
        res.status(500).json({ error: 'Failed to fetch transaction statuses' });
    }
});

router.get('/transactions/order-types', async (req, res) => {
    try {
        const connection = await connect(); // Connect to the database
        if (!connection) {
            return res.status(500).json({ error: 'Database connection error' });
        }
        const [rows] = await connection.execute('SELECT DISTINCT order_type FROM transactions');
        const orderTypes = rows.map(row => row.order_type).filter(Boolean); // Filter out null/empty
        res.json(orderTypes);
    } catch (error) {
        console.error('Error fetching order types:', error);
        res.status(500).json({ error: 'Failed to fetch order types' });
    }
});

// POST route to generate sales report
router.post('/api/generate-sales-report', async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const { startDate, endDate, transactionFilters, customerFilters, discountFilters, selectedItems } = req.body;
        const pool = await connect();
        if (!pool) {
            return res.status(500).json({ error: 'Database connection error' });
        }
        let query = `
            SELECT
            t.transaction_id,
            t.created_at,
            t.subtotal,
            t.sales_tax,
            t.total_amount,
            t.payment_method,
            t.status,
            t.order_type,
            t.tip_amount,
            GROUP_CONCAT(i.name SEPARATOR ', ') AS item_names,
            c.name AS customer_name,
            d.code AS discount_code
            FROM transactions t
            LEFT JOIN transaction_items ti ON t.transaction_id = ti.transaction_id
            LEFT JOIN items i ON ti.item_id = i.item_id
            LEFT JOIN customers c ON t.customer_id = c.customer_id
            LEFT JOIN discounts d ON t.discount_id = d.discount_id
            WHERE 1=1
        `;
        const conditions = [];
        const values = [];

        //date range filter
        if (startDate) {
            conditions.push('t.created_at >= ?');
            values.push(startDate);
        }
        if (endDate) {
            conditions.push('t.created_at <= ?');
            values.push(endDate + '23:59:59');
        }

        //transaction filters
        if (transactionFilters.minAmount) {
            conditions.push('t.total_amount >= ?');
            values.push(parseFloat(transactionFilters.minAmount));
        }
        if (transactionFilters.maxAmount) {
            conditions.push('t.total_amount <= ?');
            values.push(parseFloat(transactionFilters.maxAmount));
        }

        if (transactionFilters.paymentMethod) {
            conditions.push('t.payment_method = ?');
            values.push(transactionFilters.paymentMethod);
        }
        if (transactionFilters.status) {
            conditions.push('t.status = ?');
            values.push(transactionFilters.status);
        }
        if (transactionFilters.orderType) {
            conditions.push('t.order_type = ?');
            values.push(transactionFilters.orderType);
        }

        //item filters (accounts for multiple Items)
        if (selectedItems && selectedItems.length > 0) {
            const itemPlaceholders = selectedItems.map(() => '?').join(',');
            conditions.push(`EXISTS (
              SELECT 1
              FROM transaction_items sub_ti
              JOIN items sub_i ON sub_ti.item_id = sub_i.item_id
              WHERE sub_ti.transaction_id = t.transaction_id AND sub_i.name IN (${itemPlaceholders})
            )`);
            values.push(...selectedItems);
        }

        // customer filters
        if (customerFilters.customerName) {
            conditions.push('c.name LIKE ?');
            values.push(`%${customerFilters.customerName}%`);
        }

        // discount filters
        if (discountFilters.discountName) {
            conditions.push('d.name LIKE ?');
            values.push(`%${discountFilters.discountName}%`);
        }

        if (conditions.length > 0) {
            query += ' AND ' + conditions.join(' AND ');
        }

        query += ' GROUP BY t.transaction_id';
        query += ' ORDER BY t.created_at DESC';

        console.log('Generated SQL Query:', query);
        console.log('Query Values:', values);

        const [rows] = await pool.execute(query, values);

        //console.log('Database created_at:', row.created_at);
        const reportData = rows.map(row => {
            const utcTime = moment.utc(row.created_at);
            const localTime = utcTime.subtract(10, 'hours').format('YYYY-MM-DD HH:mm:ss');
            return {
                ...row,
                created_at: localTime,
            };
        });

        res.json(reportData);
    } catch (error) {
        console.error('Error generating sales report:', error);
        res.status(500).json({ error: 'Failed to generate sales report' });
    }
});


router.post('/api/generate-sales-report/list', async (req, res) => {
    try {   
        const { transactionIds } = req.body;
        const pool = await connect();
        if (!pool) {
            return res.status(500).json({ error: 'Database connection error' });
        }

        if (!transactionIds || transactionIds.length === 0) {
            return res.json([]); // Return empty if no transaction IDs
        }

        const placeholders = transactionIds.map(() => '?').join(',');
        let query = `
            SELECT
                t.transaction_id,
                i.name AS item_name,
                ti.quantity_purchased
            FROM transactions t
            JOIN transaction_items ti ON t.transaction_id = ti.transaction_id
            JOIN items i ON ti.item_id = i.item_id
            WHERE t.transaction_id IN (${placeholders})
            ORDER BY t.transaction_id, i.name
        `;
        console.log('Generated SQL Query:', query);
        console.log('Transaction IDs:', transactionIds);

        const [rows] = await pool.execute(query, transactionIds);
        console.log('Query executed successfully:', rows);
        const reportData = rows.map(row => ({
            transaction_id: row.transaction_id,
            item_name: row.item_name,
            quantity_purchased: row.quantity_purchased,
        }));

        res.json(reportData);
    } catch (error) {
        console.error('Error generating 2nd sales report:', error);
        res.status(500).json({ error: 'Failed to generate sales report' });
    }
});

router.post('/api/generate-sales-report/chart', async (req, res) => {
    try {   
        const { transactionIds } = req.body;
        const pool = await connect();
        if (!pool) {
            return res.status(500).json({ error: 'Database connection error' });
        }

        if (!transactionIds || transactionIds.length === 0) {
            return res.json([]); // Return empty if no transaction IDs
        }

        const placeholders = transactionIds.map(() => '?').join(',');
        let query = `
            SELECT
                i.name AS item_name,
                SUM(ti.subtotal) AS total_sales
            FROM transactions t
            JOIN transaction_items ti ON t.transaction_id = ti.transaction_id
            JOIN items i ON ti.item_id = i.item_id
            WHERE t.transaction_id IN (${placeholders})
            GROUP BY i.name
            ORDER BY total_sales DESC;
        `;

        const [rows] = await pool.execute(query, transactionIds);

        const reportData = rows.map(row => ({
            item_name: row.item_name,
            total_sales: parseFloat(row.total_sales),
        }));

        res.json(reportData);
    } catch (error) {
        console.error('Error generating chart report:', error);
        res.status(500).json({ error: 'Failed to generate sales report' });
    }
});

module.exports = router;