const express = require('express');
const router = express.Router();

const monthlyQuery = 
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.name AS employee_name,
    u.role AS employee_role,
    COUNT(t.transaction_id) AS transactions_processed,
    COALESCE(SUM(t.tip_amount), 0) AS total_tips,
    -- Calculate tip percentage (avoid division by zero)
    CASE 
        WHEN SUM(t.subtotal) > 0 THEN ROUND((SUM(t.tip_amount) / SUM(t.subtotal)) * 100, 2)
        ELSE 0 
    END AS tip_percentage,
    -- Calculate average sale amount (handle NULL case)
    COALESCE(ROUND(AVG(t.total_amount), 2), 0) AS avg_sale_amount,
    COALESCE(SUM(t.total_amount-t.tip_amount), 0) AS total_sales
    
FROM 
    users u
LEFT JOIN 
    transactions t ON u.user_id = t.user_id
    AND t.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()-- '2025-04-13 23:59:59' AND '2025-04-14 16:30:00'-- DATE_FORMAT(NOW(), '%-%-01') AND NOW()
WHERE 
    u.role IN ('Waiter', 'Manager', 'Admin')
    
GROUP BY 
    u.user_id, u.name, u.role
ORDER BY 
    total_sales DESC, u.role ASC`;
const weeklyQuery =
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.name AS employee_name,
    u.role AS employee_role,
    COUNT(t.transaction_id) AS transactions_processed,
    COALESCE(SUM(t.tip_amount), 0) AS total_tips,
    -- Calculate tip percentage (avoid division by zero)
    CASE 
        WHEN SUM(t.subtotal) > 0 THEN ROUND((SUM(t.tip_amount) / SUM(t.subtotal)) * 100, 2)
        ELSE 0 
    END AS tip_percentage,
    -- Calculate average sale amount (handle NULL case)
    COALESCE(ROUND(AVG(t.total_amount), 2), 0) AS avg_sale_amount,
    COALESCE(SUM(t.total_amount-t.tip_amount), 0) AS total_sales
    
FROM 
    users u
LEFT JOIN 
    transactions t ON u.user_id = t.user_id
    AND t.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()-- '2025-04-13 23:59:59' AND '2025-04-14 16:30:00'-- DATE_FORMAT(NOW(), '%-%-01') AND NOW()
WHERE 
    u.role IN ('Waiter', 'Manager', 'Admin')
    
GROUP BY 
    u.user_id, u.name, u.role
ORDER BY 
    total_sales DESC, u.role ASC`;
const dailyQuery =
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.name AS employee_name,
    u.role AS employee_role,
    COUNT(t.transaction_id) AS transactions_processed,
    COALESCE(SUM(t.tip_amount), 0) AS total_tips,
    -- Calculate tip percentage (avoid division by zero)
    CASE 
        WHEN SUM(t.subtotal) > 0 THEN ROUND((SUM(t.tip_amount) / SUM(t.subtotal)) * 100, 2)
        ELSE 0 
    END AS tip_percentage,
    -- Calculate average sale amount (handle NULL case)
    COALESCE(ROUND(AVG(t.total_amount), 2), 0) AS avg_sale_amount,
    COALESCE(SUM(t.total_amount-t.tip_amount), 0) AS total_sales
    
FROM 
    users u
LEFT JOIN 
    transactions t ON u.user_id = t.user_id
    AND t.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW()-- '2025-04-13 23:59:59' AND '2025-04-14 16:30:00'-- DATE_FORMAT(NOW(), '%-%-01') AND NOW()
WHERE 
    u.role IN ('Waiter', 'Manager', 'Admin')
    
GROUP BY 
    u.user_id, u.name, u.role
ORDER BY 
    total_sales DESC, u.role ASC`;
const customQuery =
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.name AS employee_name,
    u.role AS employee_role,
    COUNT(t.transaction_id) AS transactions_processed,
    COALESCE(SUM(t.tip_amount), 0) AS total_tips,
    -- Calculate tip percentage (avoid division by zero)
    CASE 
        WHEN SUM(t.subtotal) > 0 THEN ROUND((SUM(t.tip_amount) / SUM(t.subtotal)) * 100, 2)
        ELSE 0 
    END AS tip_percentage,
    -- Calculate average sale amount (handle NULL case)
    COALESCE(ROUND(AVG(t.total_amount), 2), 0) AS avg_sale_amount,
    COALESCE(SUM(t.total_amount-t.tip_amount), 0) AS total_sales
    
FROM 
    users u
LEFT JOIN 
    transactions t ON u.user_id = t.user_id
    AND t.created_at BETWEEN ? AND ?
WHERE 
    u.role IN ('Waiter', 'Manager', 'Admin')
    
GROUP BY 
    u.user_id, u.name, u.role
ORDER BY 
    total_sales DESC, u.role ASC`;


//Montly Report
router.get('/monthly', async (req, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get monthly report
        const [rows] = await req.dbConnection.query(monthlyQuery);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the monthly report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            sales_rank: row.sales_rank,
            employee_name: row.employee_name,
            role: row.employee_role,
            transactions_processed: row.transactions_processed,
            total_tips: parseFloat(row.total_tips),
            tip_percentage: row.tip_percentage,
            avg_sale_amount: parseFloat(row.avg_sale_amount),
            total_sales: parseFloat(row.total_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching monthly report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});
//Weekly Report
router.get('/weekly', async (req, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get weekly report
        const [rows] = await connection.query(weeklyQuery);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the weekly report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            sales_rank: row.sales_rank,
            employee_name: row.employee_name,
            role: row.employee_role,
            transactions_processed: row.transactions_processed,
            total_tips: parseFloat(row.total_tips),
            tip_percentage: row.tip_percentage,
            avg_sale_amount: parseFloat(row.avg_sale_amount),
            total_sales: parseFloat(row.total_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching weekly report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});
//Daily Report
router.get('/daily', async (req, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get daily report
        const [rows] = await connection.query(dailyQuery);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the daily report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            sales_rank: row.sales_rank,
            employee_name: row.employee_name,
            role: row.employee_role,
            transactions_processed: row.transactions_processed,
            total_tips: parseFloat(row.total_tips),
            tip_percentage: row.tip_percentage,
            avg_sale_amount: parseFloat(row.avg_sale_amount),
            total_sales: parseFloat(row.total_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching daily report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});
//Custom Report
router.get('/custom', async (req, res) => {
    const { start_date, end_date } = req.body;
    if (!start_date || !end_date) {
        return res.status(400).json({ error: 'Start date and end date are required.' });
    }
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get custom report
        const [rows] = await connection.query(customQuery, [start_date, end_date]);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the custom report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            sales_rank: row.sales_rank,
            employee_name: row.employee_name,
            role: row.employee_role,
            transactions_processed: row.transactions_processed,
            total_tips: parseFloat(row.total_tips),
            tip_percentage: row.tip_percentage,
            avg_sale_amount: parseFloat(row.avg_sale_amount),
            total_sales: parseFloat(row.total_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching custom report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});


module.exports = router;