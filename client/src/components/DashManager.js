import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashAdmin.css";

function DashManager() {
    const [managerData, setManagerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        
        if (!userData) {
            console.log("Redirecting because role is not Manager:", userData.role);
            setError("Not logged in");
            navigate('/users/login'); 
            return;
        }

        try {
            const user = JSON.parse(userData);
            
            if (user.role !== 'Manager') {
                setError("Unauthorized access");
                navigate('/users/login');
                return;
            }
            
            setManagerData(user);
            setLoading(false);
        } catch (err) {
            console.error("Error loading manager data:", err);
            setError("Error loading manager data");
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/users/login');
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="admin-dashboard-body">
            <div className="admin-dashboard">
                <header className="admin-header">
                    <h1>Manager Dashboard</h1>
                    <div className="admin-info">
                        <p>Welcome, <span className="admin-name">{managerData.name}</span></p>
                        <p className="admin-role">Role: {managerData.role}</p>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </header>

                <main className="admin-content">
                    {!activeSection && (
                        <div className="admin-section">
                            <h2>Restaurant Management</h2>
                            <div className="admin-cards">
                                {/* Process Transaction */}
                                <div className="admin-card">
                                    <h3>Process Transactions</h3>
                                    <p>Create and Complete Transactions</p>
                                    <button onClick={() => navigate('/transactions')}>Checkout</button>
                                </div>
                                
                                {/* Reorder Alerts side */}
                                <div className="admin-card">
                                    <h3>Reorder Alerts</h3>
                                    <p>View all reorder alerts</p>
                                    <button onClick={() => navigate('/reorder_alerts')}>View</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={() => navigate('/inventory')}>View Inventory</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Employee Management</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => navigate('/employees')}>View Employees</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Employee Sales Report</h3>
                                    <p>View daily, weekly, and monthly employee sales</p>
                                    <button onClick={() => navigate('/reports/employee-sales')}>View Reports</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Customer Reports</h3>
                                    <p>Analyze customer behavior and trends</p>
                                    <button onClick={() => navigate('/customer-report')}>View Reports</button>
                                </div>

                                 {/* Log hours */}
                                 <div className="admin-card">
                                    <h3>Log Hours</h3>
                                    <p>Log hours worked and their date</p>
                                    <button onClick={() => navigate('/log-hours')}>Log</button>
                                </div>
                                
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

export default DashManager;
