import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeSalesReports.css";
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

function EmployeeSalesReports() {
    //Back to Dashboard
    const navigate = useNavigate();
    const handleBackToDashboard = () => {
        navigate('/admin-dashboard');
    };
    
    //const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //Employee Sales Report
    const [employeeMonthlyReport, setEmployeeMonthlyReport] = useState([]);
    const [employeeWeeklyReport, setEmployeeWeeklyReport] = useState([]);
    const [employeeDailyReport, setEmployeeDailyReport] = useState([]);
    const [employeeCustomReport, setEmployeeCustomReport] = useState([]);
    const [activeReportType, setActiveReportType] = useState('monthly');

// #region Employee Sales Report
    // FETCH EMPLOYEE MONTHLY SALES REPORT
    const fetchEmployeeMonthlyReport = async () => {
        try {
            const reponse = await fetch(`${API_URL}/dashboard/monthly`);
            if (!reponse.ok) {
                throw new Error(`HTTP error! Status: ${reponse.status}`);
            }
            const data = await reponse.json();
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
            const reponse = await fetch(`${API_URL}/dashboard/weekly`);
            if (!reponse.ok) {
                throw new Error(`HTTP error! Status: ${reponse.status}`);
            }
            const data = await reponse.json();
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
            const reponse = await fetch(`${API_URL}/dashboard/daily`);
            if (!reponse.ok) {
                throw new Error(`HTTP error! Status: ${reponse.status}`);
            }
            const data = await reponse.json();
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
            const reponse = await fetch(`${API_URL}/dashboard/custom`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ start_date, end_date }),
            });

            const data = await reponse.json();

            if (!reponse.ok) {
                throw new Error(`HTTP error! Status: ${reponse.status}`);
            }
            
            setEmployeeCustomReport(data);
        } catch(err){
            console.error("Error fetching employee custom sales report:", err);
            setError("Failed to load employee custom sales report. Please try again later.");
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
            if (user.role !== 'Admin') {
                setError("Unauthorized access");
                navigate('/users/login'); // Redirect to regular dashboard
                return;
            }
            
            //setAdminData(user);
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
        <div className="section-header">
            <h2>Employee Sales Reports</h2>
            <button className="back-btn" onClick={handleBackToDashboard}>Back to Dashboard</button>
        </div>
        
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
                                    <tr key={index}>
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
                                    <tr key={index}>
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
                                    <tr key={index}>
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
                                    className="date-input" 
                                    id="start_date" 
                                    type="date" 
                                    required
                                />
                            
                                <label htmlFor="end_date">End Date:</label>
                                <input 
                                    className="date-input" 
                                    id="end_date" 
                                    type="date" 
                                    required
                                />
                            
                                <button type="submit" className="generate-btn">Generate Report</button>
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
                                <tr key={index}>
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
    </div>

    );

};

export default EmployeeSalesReports;