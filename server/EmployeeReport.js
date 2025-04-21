const express = require('express');
const router = express.Router();

const monthlyQuery = 
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.user_id AS employee_id,
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
    avg_sale_amount DESC, total_sales DESC, u.role ASC`;
const weeklyQuery =
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.user_id AS employee_id,
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
    avg_sale_amount DESC, total_sales DESC, u.role ASC`;
const dailyQuery =
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.user_id AS employee_id,
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
    avg_sale_amount DESC, total_sales DESC, u.role ASC`;
const customQuery =
`SELECT
    -- Rank employees by total sales
    RANK() OVER (ORDER BY COALESCE(SUM(t.total_amount), 0) DESC,  u.role ASC) AS sales_rank,
    u.user_id AS employee_id,
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
    avg_sale_amount DESC, total_sales DESC, u.role ASC`;

const indidivudalTransactionsMonthlyQuery =
`select 
t.transaction_id, i.name as item_name, ti.quantity_purchased as quantity_purchased, i.price as price, 
ti.quantity_purchased*i.price as item_subtotal, t.subtotal as subtotal, t.sales_tax as sales_tax, 
t.tip_amount as tip_amount, t.total_amount as total_amount
from users u 
left join transactions t ON u.user_id = t.user_id 
AND t.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()-- '2025-04-13 23:59:59' AND '2025-04-14 16:30:00'-- DATE_FORMAT(NOW(), '%-%-01') A
left join transaction_items ti on t.transaction_id = ti.transaction_id
left join items i on ti.item_id = i.item_id
where u.user_id = ?
order by t.transaction_id DESC;`;
const indidivudalTransactionsWeeklyQuery =
`select 
t.transaction_id, i.name as item_name, ti.quantity_purchased as quantity_purchased, i.price as price, 
ti.quantity_purchased*i.price as item_subtotal, t.subtotal as subtotal, t.sales_tax as sales_tax, 
t.tip_amount as tip_amount, t.total_amount as total_amount
from users u 
left join transactions t ON u.user_id = t.user_id 
AND t.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()-- '2025-04-13 23:59:59' AND '2025-04-14 16:30:00'-- DATE_FORMAT(NOW(), '%-%-01') A
left join transaction_items ti on t.transaction_id = ti.transaction_id
left join items i on ti.item_id = i.item_id
where u.user_id = ?
order by t.transaction_id DESC;`;
const indidivudalTransactionsDailyQuery =
`select 
t.transaction_id, i.name as item_name, ti.quantity_purchased as quantity_purchased, i.price as price, 
ti.quantity_purchased*i.price as item_subtotal, t.subtotal as subtotal, t.sales_tax as sales_tax, 
t.tip_amount as tip_amount, t.total_amount as total_amount
from users u 
left join transactions t ON u.user_id = t.user_id 
AND t.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW()-- '2025-04-13 23:59:59' AND '2025-04-14 16:30:00'-- DATE_FORMAT(NOW(), '%-%-01') A
left join transaction_items ti on t.transaction_id = ti.transaction_id
left join items i on ti.item_id = i.item_id
where u.user_id = ?
order by t.transaction_id DESC;`;
const indidivudalTransactionsCustomQuery =
`select 
t.transaction_id, i.name as item_name, ti.quantity_purchased as quantity_purchased, i.price as price, 
ti.quantity_purchased*i.price as item_subtotal, t.subtotal as subtotal, t.sales_tax as sales_tax, 
t.tip_amount as tip_amount, t.total_amount as total_amount
from users u 
left join transactions t ON u.user_id = t.user_id
AND t.created_at BETWEEN ? AND ? 
left join transaction_items ti on t.transaction_id = ti.transaction_id
left join items i on ti.item_id = i.item_id
where u.user_id = ?
order by t.transaction_id DESC;`;


//Toal & AVG Sales Made by Employee Monthly
const overallMonthlyQuery =
`SELECT 
COALESCE(SUM(transactions.total_amount - transactions.tip_amount), 0) as total_overall_sales,
COALESCE(AVG(transactions.total_amount),0) as avg_overall_sales
FROM transactions, users
WHERE transactions.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()
AND transactions.user_id = users.user_id`;
//Toal & AVG Sales Made by Employee Weekly
const overallWeeklyQuery =
`SELECT
COALESCE(SUM(transactions.total_amount - transactions.tip_amount), 0) as total_overall_sales,
COALESCE(AVG(transactions.total_amount),0) as avg_overall_sales
FROM transactions, users
WHERE transactions.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
AND transactions.user_id = users.user_id`;
//Toal & AVG Sales Made by Employee Monthly
const overallDailyQuery =
`SELECT
COALESCE(SUM(transactions.total_amount - transactions.tip_amount), 0) as total_overall_sales,
COALESCE(AVG(transactions.total_amount),0) as avg_overall_sales
FROM transactions, users
WHERE transactions.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 1 DAY) AND NOW()
AND transactions.user_id = users.user_id`;
//Toal & AVG Sales Made by Employee Monthly
const overallCustomQuery =
`SELECT
COALESCE(SUM(transactions.total_amount - transactions.tip_amount), 0) as total_overall_sales,
COALESCE(AVG(transactions.total_amount),0) as avg_overall_sales
FROM transactions, users
WHERE transactions.created_at BETWEEN ? AND ?
AND transactions.user_id = users.user_id`;


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
            employee_id: row.employee_id,
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
            employee_id: row.employee_id,
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
            employee_id: row.employee_id,
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
router.post('/custom', async (req, res) => {
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
            employee_id: row.employee_id,
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

//Monthly Individual Transactions
router.post('/monthly/individual', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id){
        return res.status(400).json({ error: 'User ID is required.' });
    }
    let connection;
    try{
        connection = await req.dbConnection.getConnection();
        // Query to get individual transactions
        const [result] = await connection.query(indidivudalTransactionsMonthlyQuery, [user_id]);
        // Check if rows are empty
        if (result.length === 0) {
            return res.status(404).json({ error: 'No data found for the individual transactions.' });
        }
        // Send the result as JSON
        const transactions = result.map(row => ({
            transaction_id: row.transaction_id,
            item_name: row.item_name,
            quantity_purchased: row.quantity_purchased,
            price: parseFloat(row.price),
            item_subtotal: parseFloat(row.item_subtotal),
            subtotal: parseFloat(row.subtotal),
            sales_tax: parseFloat(row.sales_tax),
            tip_amount: parseFloat(row.tip_amount),
            total_amount: parseFloat(row.total_amount)
        }));
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching individual transactions:', err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) connection.release();
    }
});
//Weekly Individual Transactions
router.post('/weekly/individual', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id){
        return res.status(400).json({ error: 'User ID is required.' });
    }
    let connection;
    try{
        connection = await req.dbConnection.getConnection();
        // Query to get individual transactions
        const [result] = await connection.query(indidivudalTransactionsWeeklyQuery, [user_id]);
        // Check if rows are empty
        if (result.length === 0) {
            return res.status(404).json({ error: 'No data found for the individual transactions.' });
        }
        // Send the result as JSON
        const transactions = result.map(row => ({
            transaction_id: row.transaction_id,
            item_name: row.item_name,
            quantity_purchased: row.quantity_purchased,
            price: parseFloat(row.price),
            item_subtotal: parseFloat(row.item_subtotal),
            subtotal: parseFloat(row.subtotal),
            sales_tax: parseFloat(row.sales_tax),
            tip_amount: parseFloat(row.tip_amount),
            total_amount: parseFloat(row.total_amount)
        }));
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching individual transactions:', err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) connection.release();
    }
});
//Daily Individual Transactions
router.post('/daily/individual', async (req, res) => {
    const { user_id } = req.body;
    if (!user_id){
        return res.status(400).json({ error: 'User ID is required.' });
    }
    let connection;
    try{
        connection = await req.dbConnection.getConnection();
        // Query to get individual transactions
        const [result] = await connection.query(indidivudalTransactionsDailyQuery, [user_id]);
        // Check if rows are empty
        if (result.length === 0) {
            return res.status(404).json({ error: 'No data found for the individual transactions.' });
        }
        // Send the result as JSON
        const transactions = result.map(row => ({
            transaction_id: row.transaction_id,
            item_name: row.item_name,
            quantity_purchased: row.quantity_purchased,
            price: parseFloat(row.price),
            item_subtotal: parseFloat(row.item_subtotal),
            subtotal: parseFloat(row.subtotal),
            sales_tax: parseFloat(row.sales_tax),
            tip_amount: parseFloat(row.tip_amount),
            total_amount: parseFloat(row.total_amount)
        }));
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching individual transactions:', err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) connection.release();
    }
});
//Daily Individual Transactions
router.post('/custom/individual', async (req, res) => {
    const { start_date, end_date, user_id } = req.body;
    if (!user_id || !start_date || !end_date){
        return res.status(400).json({ error: 'Fill out all requirements' });
    }
    let connection;
    try{
        connection = await req.dbConnection.getConnection();
        // Query to get individual transactions
        const [result] = await connection.query(indidivudalTransactionsCustomQuery, [start_date, end_date, user_id]);
        // Check if rows are empty
        if (result.length === 0) {
            return res.status(404).json({ error: 'No data found for the individual transactions.' });
        }
        // Send the result as JSON
        const transactions = result.map(row => ({
            transaction_id: row.transaction_id,
            item_name: row.item_name,
            quantity_purchased: row.quantity_purchased,
            price: parseFloat(row.price),
            item_subtotal: parseFloat(row.item_subtotal),
            subtotal: parseFloat(row.subtotal),
            sales_tax: parseFloat(row.sales_tax),
            tip_amount: parseFloat(row.tip_amount),
            total_amount: parseFloat(row.total_amount)
        }));
        res.json(transactions);
    } catch (err) {
        console.error('Error fetching individual transactions:', err);
        res.status(500).json({ error: 'Database error' });
    }
    finally {
        if (connection) connection.release();
    }
});
//Overall Monthly Report
router.get('/monthly/overall', async (req, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get overall monthly report
        const [rows] = await connection.query(overallMonthlyQuery);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the overall monthly report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            total_overall_sales: parseFloat(row.total_overall_sales),
            avg_overall_sales: parseFloat(row.avg_overall_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching overall monthly report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});
//Overall Weekly Report
router.get('/weekly/overall', async (req, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get overall weekly report
        const [rows] = await connection.query(overallWeeklyQuery);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the overall weekly report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            total_overall_sales: parseFloat(row.total_overall_sales),
            avg_overall_sales: parseFloat(row.avg_overall_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching overall weekly report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});
//Overall Daily Report
router.get('/daily/overall', async (req, res) => {
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get overall daily report
        const [rows] = await connection.query(overallDailyQuery);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the overall daily report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            total_overall_sales: parseFloat(row.total_overall_sales),
            avg_overall_sales: parseFloat(row.avg_overall_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching overall daily report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});
//Ovearall Custom Report
router.post('/custom/overall', async (req, res) => {
    const { start_date, end_date } = req.body;
    if (!start_date || !end_date) {
        return res.status(400).json({ error: 'Start date and end date are required.' });
    }
    let connection;
    try {
        // Get a connection from the pool
        connection = await req.dbConnection.getConnection();
        
        // Query to get overall custom report
        const [rows] = await connection.query(overallCustomQuery, [start_date, end_date]);
        // Check if rows are empty
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No data found for the overall custom report.' });
        }
        // Send the result as JSON
        const reports = rows.map(row => ({
            total_overall_sales: parseFloat(row.total_overall_sales),
            avg_overall_sales: parseFloat(row.avg_overall_sales)
        }));
        res.json(reports);
    } catch (err) {
        console.error('Error fetching overall custom report:', err);
        res.status(500).json({ error: 'Database error' });
    } finally {
        if (connection) connection.release();
    }
});


module.exports = router;