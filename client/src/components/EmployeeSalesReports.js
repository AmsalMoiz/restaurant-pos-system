import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeSalesReports.css";
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

function EmployeeSalesReports() {
    //Back to Dashboard
    const navigate = useNavigate();
    const handleBackToDashboard = () => {
        navigate(-1);
    };
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //Employee Sales Report
    const [employeeMonthlyReport, setEmployeeMonthlyReport] = useState([]);
    const [employeeWeeklyReport, setEmployeeWeeklyReport] = useState([]);
    const [employeeDailyReport, setEmployeeDailyReport] = useState([]);
    const [employeeCustomReport, setEmployeeCustomReport] = useState([]);
    const [activeReportType, setActiveReportType] = useState('monthly');
    const [employeeTransactions, setEmployeeTransactions] = useState([]);
    // Track selected employee
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    // Group transactions by transaction ID
    const [groupedTransactions, setGroupedTransactions] = useState({});
    // Track if transactions are loading
    const [transactionsLoading, setTransactionsLoading] = useState(false);

    // Reset selected employee when changing report type
    useEffect(() => {
        setSelectedEmployee(null);
        setEmployeeTransactions([]);
        setGroupedTransactions({});
    }, [activeReportType]);

    // Group transactions by transaction ID when employee transactions change
    useEffect(() => {
        if (employeeTransactions.length > 0) {
            const grouped = {};
            
            employeeTransactions.forEach(transaction => {
                if (!transaction.transaction_id) return; // Skip if transaction_id is null
                
                const transId = transaction.transaction_id;
                
                if (!grouped[transId]) {
                    grouped[transId] = {
                        transaction_id: transId,
                        subtotal: transaction.subtotal,
                        sales_tax: transaction.sales_tax,
                        tip_amount: transaction.tip_amount,
                        total_amount: transaction.total_amount,
                        items: []
                    };
                }
                
                // Only add item details if item name is not null
                if (transaction.item_name) {
                    grouped[transId].items.push({
                        item_name: transaction.item_name,
                        quantity: transaction.quantity_purchased,
                        price: transaction.price,
                        item_subtotal: transaction.item_subtotal
                    });
                }
            });
            
            setGroupedTransactions(grouped);
        }
    }, [employeeTransactions]);

// #region Employee Sales Report
    // FETCH EMPLOYEE MONTHLY SALES REPORT
    const fetchEmployeeMonthlyReport = async () => {
        try {
            const response = await fetch(`${API_BASE}/dashboard/monthly`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setEmployeeMonthlyReport(data);
        } catch(err){
            console.error("Error fetching employee monthly sales report:", err);
            setError("Failed to load employee monthly sales report. Please try again later.");
        }
    };
    useEffect(() => {
        fetchEmployeeMonthlyReport();
    }, []);
    // FETCH EMPLOYEE WEEKLY SALES REPORT
    const fetchEmployeeWeeklyReport = async () => {
        try {
            const response = await fetch(`${API_BASE}/dashboard/weekly`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setEmployeeWeeklyReport(data);
        } catch(err){
            console.error("Error fetching employee weekly sales report:", err);
            setError("Failed to load employee weekly sales report. Please try again later.");
        }
    };
    useEffect(() => {
        fetchEmployeeWeeklyReport();
    }, []);
    // FETCH EMPLOYEE DAILY SALES REPORT
    const fetchEmployeeDailyReport = async () => {
        try {
            const response = await fetch(`${API_BASE}/dashboard/daily`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setEmployeeDailyReport(data);
        } catch(err){
            console.error("Error fetching employee daily sales report:", err);
            setError("Failed to load employee daily sales report. Please try again later.");
        }
    };
    useEffect(() => {
        fetchEmployeeDailyReport();
    }, []);
    // FETCH EMPLOYEE CUSTOM SALES REPORT
    
    const fetchEmployeeCustomReport = async (e) => {
        e.preventDefault();
        setError("");
        const start_date = document.getElementById('start_date').value;
        const end_date = document.getElementById('end_date').value;
        if (!start_date || !end_date) {
            setError("Please use both start and end dates.");
            return;
        }
        try {
            const response = await fetch(`${API_BASE}/dashboard/custom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ start_date, end_date }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            setEmployeeCustomReport(data);
        } catch(err){
            console.error("Error fetching employee custom sales report:", err);
            setError("Failed to load employee custom sales report. Please try again later.");
        }
    };
    //#region Individual Transactions
    // FETCH INDIVIDUAL TRANSACTIONS MONTHLY
    const fetchEmployeeMonthlyTransactions = async (employeeId, employeeName) => {
        setError("");
        setTransactionsLoading(true);
        
        if (!employeeId) {
            setError("Invalid employee selection.");
            setTransactionsLoading(false);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/dashboard/monthly/individual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: employeeId }),
            });
            
            if (response.status === 404) {
                // Handle case where no transactions are found
                setEmployeeTransactions([]);
                setSelectedEmployee({ id: employeeId, name: employeeName });
                setTransactionsLoading(false);
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setEmployeeTransactions(data);
            setSelectedEmployee({ id: employeeId, name: employeeName });
        } catch(err){
            console.error("Error fetching employee transactions:", err);
            setError("Failed to load employee transactions. Please try again later.");
            setEmployeeTransactions([]);
        } finally {
            setTransactionsLoading(false);
        }
    };
    // FETCH INDIVIDUAL TRANSACTIONS WEEKLY
    const fetchEmployeeWeeklyTransactions = async (employeeId, employeeName) => {
        setError("");
        setTransactionsLoading(true);
        
        if (!employeeId) {
            setError("Invalid employee selection.");
            setTransactionsLoading(false);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/dashboard/weekly/individual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: employeeId }),
            });
            
            if (response.status === 404) {
                // Handle case where no transactions are found
                setEmployeeTransactions([]);
                setSelectedEmployee({ id: employeeId, name: employeeName });
                setTransactionsLoading(false);
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setEmployeeTransactions(data);
            setSelectedEmployee({ id: employeeId, name: employeeName });
        } catch(err){
            console.error("Error fetching employee transactions:", err);
            setError("Failed to load employee transactions. Please try again later.");
            setEmployeeTransactions([]);
        } finally {
            setTransactionsLoading(false);
        }
    };
    // FETCH INDIVIDUAL TRANSACTIONS DAILY
    const fetchEmployeeDailyTransactions = async (employeeId, employeeName) => {
        setError("");
        setTransactionsLoading(true);
        
        if (!employeeId) {
            setError("Invalid employee selection.");
            setTransactionsLoading(false);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/dashboard/daily/individual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: employeeId }),
            });
            
            if (response.status === 404) {
                // Handle case where no transactions are found
                setEmployeeTransactions([]);
                setSelectedEmployee({ id: employeeId, name: employeeName });
                setTransactionsLoading(false);
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setEmployeeTransactions(data);
            setSelectedEmployee({ id: employeeId, name: employeeName });
        } catch(err){
            console.error("Error fetching employee transactions:", err);
            setError("Failed to load employee transactions. Please try again later.");
            setEmployeeTransactions([]);
        } finally {
            setTransactionsLoading(false);
        }
    };
    // FETCH INDIVIDUAL TRANSACTIONS CUSTOM
    const fetchEmployeeCustomTransactions = async (employeeId, employeeName) => {
        setError("");
        setTransactionsLoading(true);
        const start_date = document.getElementById('start_date').value;
        const end_date = document.getElementById('end_date').value;
        
        if (!employeeId || !start_date || !end_date) {
            setError("Invalid employee selection or date range.");
            setTransactionsLoading(false);
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE}/dashboard/custom/individual`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    start_date,
                    end_date, 
                    user_id: employeeId 
                }),
            });
            
            if (response.status === 404) {
                // Handle case where no transactions are found
                setEmployeeTransactions([]);
                setSelectedEmployee({ id: employeeId, name: employeeName });
                setTransactionsLoading(false);
                return;
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setEmployeeTransactions(data);
            setSelectedEmployee({ id: employeeId, name: employeeName });
        } catch(err){
            console.error("Error fetching employee transactions:", err);
            setError("Failed to load employee transactions. Please try again later.");
            setEmployeeTransactions([]);
        } finally {
            setTransactionsLoading(false);
        }
    };

    
    // Handle row click to show employee transactions
    const handleEmployeeRowClickMonthly = (employeeId, employeeName) => {
        // If already selected, deselect
        if (selectedEmployee && selectedEmployee.id === employeeId) {
            setSelectedEmployee(null);
            setEmployeeTransactions([]);
            setGroupedTransactions({});
        } else {
            fetchEmployeeMonthlyTransactions(employeeId, employeeName);
        }
    };
    // Handle row click to show employee transactions
    const handleEmployeeRowClickWeekly = (employeeId, employeeName) => {
        // If already selected, deselect
        if (selectedEmployee && selectedEmployee.id === employeeId) {
            setSelectedEmployee(null);
            setEmployeeTransactions([]);
            setGroupedTransactions({});
        } else {
            fetchEmployeeWeeklyTransactions(employeeId, employeeName);
        }
    };
    // Handle row click to show employee transactions
    const handleEmployeeRowClickDaily = (employeeId, employeeName) => {
        // If already selected, deselect
        if (selectedEmployee && selectedEmployee.id === employeeId) {
            setSelectedEmployee(null);
            setEmployeeTransactions([]);
            setGroupedTransactions({});
        } else {
            fetchEmployeeDailyTransactions(employeeId, employeeName);
        }
    };
    // Handle row click to show employee transactions
    const handleEmployeeRowClickCustom = (employeeId, employeeName) => {
        // If already selected, deselect
        if (selectedEmployee && selectedEmployee.id === employeeId) {
            setSelectedEmployee(null);
            setEmployeeTransactions([]);
            setGroupedTransactions({});
        } else {
            fetchEmployeeCustomTransactions(employeeId, employeeName);
        }
    };
    
    // #region Login
    //Login additional features, returns to login page if not properly logged in
    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('user');
        
        if (!userData) {
            setError("Not logged in");
            navigate('/users/login'); 
            return;
        }

        try {
            const user = JSON.parse(userData);
            
            // Check if user has admin role
            if (user.role !== 'Admin' && user.role !== 'Manager') {
                setError("Unauthorized access");
                navigate('/users/login'); // Redirect to login if not authorized
                return;
            }            
            
            setLoading(false);
        } catch (err) {
            console.error("Error loading admin data:", err);
            setError("Error loading admin data");
            setLoading(false);
        }
    }, [navigate]);

    
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
    <div className="admin-section">
        <header className="section-header">
            <h1>Employee Sales Reports</h1>
            <button className="t-back-btn" onClick={handleBackToDashboard}>Back to Dashboard</button>
        </header>
        
        <div className="report-controls">
            <label htmlFor="report-type">Select Report Type:</label>
            <select 
                value={activeReportType} 
                onChange={(e) => setActiveReportType(e.target.value)}
                className="report-type-selector"
            >
                <option value="monthly">Monthly Report</option>
                <option value="weekly">Weekly Report</option>
                <option value="daily">Daily Report</option>
                <option value="custom">Choose a Date</option>
            </select>
        </div>
        
        <div className="employee-reports-container">
            {activeReportType === 'monthly' && (
                <>
                    <h3>Monthly Sales Report</h3>
                    {employeeMonthlyReport.length === 0 ? (
                        <p>Loading monthly report data...</p>
                    ) : (
                        <table className="employee-reports-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Employee Name</th>
                                    <th>Role</th>
                                    <th>Transactions Processed</th>
                                    <th>Total Tips</th>
                                    <th>Tip Percentage</th>
                                    <th>Average Sale Amount</th>
                                    <th>Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeMonthlyReport.map((report, index) => (
                                    <tr 
                                        key={index} 
                                        onClick={() => handleEmployeeRowClickMonthly(report.employee_id, report.employee_name)}
                                        className={selectedEmployee && selectedEmployee.id === report.employee_id ? "selected-row" : "clickable-row"}
                                    >
                                        <td>{report.sales_rank}</td>
                                        <td>{report.employee_name}</td>
                                        <td>{report.role}</td>
                                        <td>{report.transactions_processed}</td>
                                        <td>${report.total_tips.toFixed(2)}</td>
                                        <td>{report.tip_percentage}%</td>
                                        <td>${report.avg_sale_amount.toFixed(2)}</td>
                                        <td>${report.total_sales.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
            
            {activeReportType === 'weekly' && (
                <>
                    <h3>Weekly Sales Report</h3>
                    {employeeWeeklyReport.length === 0 ? (
                        <p>Loading weekly report data...</p>
                    ) : (
                        <table className="employee-reports-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Employee Name</th>
                                    <th>Role</th>
                                    <th>Transactions Processed</th>
                                    <th>Total Tips</th>
                                    <th>Tip Percentage</th>
                                    <th>Average Sale Amount</th>
                                    <th>Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeWeeklyReport.map((report, index) => (
                                    <tr 
                                        key={index} 
                                        onClick={() => handleEmployeeRowClickWeekly(report.employee_id, report.employee_name)}
                                        className={selectedEmployee && selectedEmployee.id === report.employee_id ? "selected-row" : "clickable-row"}
                                    >
                                        <td>{report.sales_rank}</td>
                                        <td>{report.employee_name}</td>
                                        <td>{report.role}</td>
                                        <td>{report.transactions_processed}</td>
                                        <td>${report.total_tips.toFixed(2)}</td>
                                        <td>{report.tip_percentage}%</td>
                                        <td>${report.avg_sale_amount.toFixed(2)}</td>
                                        <td>${report.total_sales.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
            
            {activeReportType === 'daily' && (
                <>
                    <h3>Daily Sales Report</h3>
                    {employeeDailyReport.length === 0 ? (
                        <p>Loading daily report data...</p>
                    ) : (
                        <table className="employee-reports-table">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Employee Name</th>
                                    <th>Role</th>
                                    <th>Transactions Processed</th>
                                    <th>Total Tips</th>
                                    <th>Tip Percentage</th>
                                    <th>Average Sale Amount</th>
                                    <th>Total Sales</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employeeDailyReport.map((report, index) => (
                                    <tr 
                                        key={index} 
                                        onClick={() => handleEmployeeRowClickDaily(report.employee_id, report.employee_name)}
                                        className={selectedEmployee && selectedEmployee.id === report.employee_id ? "selected-row" : "clickable-row"}
                                    >
                                        <td>{report.sales_rank}</td>
                                        <td>{report.employee_name}</td>
                                        <td>{report.role}</td>
                                        <td>{report.transactions_processed}</td>
                                        <td>${report.total_tips.toFixed(2)}</td>
                                        <td>{report.tip_percentage}%</td>
                                        <td>${report.avg_sale_amount.toFixed(2)}</td>
                                        <td>${report.total_sales.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
            {activeReportType === 'custom' && (
            <> 
                <h3>Custom Date Range Report</h3>
                <div className="custom-report-form">
                    <form onSubmit={fetchEmployeeCustomReport}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="start_date">Start Date:</label>
                                <input 
                                    className="esr-date-input" 
                                    id="start_date" 
                                    type="date" 
                                    required
                                />
                            
                                <label htmlFor="end_date">End Date:</label>
                                <input 
                                    className="esr-date-input" 
                                    id="end_date" 
                                    type="date" 
                                    required
                                />
                                <div>
                                <button type="submit" className="generate-btn">Generate Report</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                
                {error && <div className="report-error">{error}</div>}
                
                {employeeCustomReport.length > 0 && (
                    <table className="employee-reports-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Employee Name</th>
                                <th>Role</th>
                                <th>Transactions Processed</th>
                                <th>Total Tips</th>
                                <th>Tip Percentage</th>
                                <th>Average Sale Amount</th>
                                <th>Total Sales</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employeeCustomReport.map((report, index) => (
                                <tr 
                                    key={index} 
                                    onClick={() => handleEmployeeRowClickCustom(report.employee_id, report.employee_name)}
                                    className={selectedEmployee && selectedEmployee.id === report.employee_id ? "selected-row" : "clickable-row"}
                                >
                                    <td>{report.sales_rank}</td>
                                    <td>{report.employee_name}</td>
                                    <td>{report.role}</td>
                                    <td>{report.transactions_processed}</td>
                                    <td>${report.total_tips.toFixed(2)}</td>
                                    <td>{report.tip_percentage}%</td>
                                    <td>${report.avg_sale_amount.toFixed(2)}</td>
                                    <td>${report.total_sales.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </>
        )}
        </div>

        {/* Display individual transactions when an employee is selected */}
        {selectedEmployee && (
            <div className="employee-transactions-container">
                <h3>Transactions for {selectedEmployee.name}</h3>
                
                {transactionsLoading ? (
                    <p className="transactions-loading">Loading transactions...</p>
                ) : Object.keys(groupedTransactions).length === 0 ? (
                    <p className="no-transactions-message">No transactions found for this employee during this time period.</p>
                ) : (
                    <div className="transactions-list">
                        {Object.values(groupedTransactions).map((transaction) => (
                            <div key={transaction.transaction_id} className="transaction-card">
                                <div className="transaction-header">
                                    <h4>Transaction #{transaction.transaction_id}</h4>
                                    <div className="transaction-summary">
                                        <p><strong>Subtotal:</strong> ${transaction.subtotal.toFixed(2)}</p>
                                        <p><strong>Tax:</strong> ${transaction.sales_tax.toFixed(2)}</p>
                                        <p><strong>Tip:</strong> ${transaction.tip_amount.toFixed(2)}</p>
                                        <p><strong>Total:</strong> ${transaction.total_amount.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="transaction-items">
                                    <h5>Items:</h5>
                                    {transaction.items.length === 0 ? (
                                        <p className="no-items-message">No item details available</p>
                                    ) : (
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transaction.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.item_name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${item.price.toFixed(2)}</td>
                                                        <td>${item.item_subtotal.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <button 
                    className="close-transactions-btn" 
                    onClick={() => {
                        setSelectedEmployee(null);
                        setEmployeeTransactions([]);
                        setGroupedTransactions({});
                    }}
                >
                    Close Transactions
                </button>
            </div>
        )}
    </div>
    );
};

export default EmployeeSalesReports;