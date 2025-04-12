import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashAdmin.css"; // You'll need to create this CSS file
//const API_BASE = process.env.REACT_APP_API_BASE || '';

function DashManager() {
    const [adminData, setManagerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
            
            // Check if user has manager role
            if (user.role !== 'Manager') {
                setError("Unauthorized access");
                navigate('/users/login'); // Redirect to regular dashboard
                return;
            }
            
            setManagerData(user);
            setLoading(false);
            
            // You can also fetch additional manager-specific data here if needed
            // fetchManagerData(user.id);
            
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

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="admin-dashboard-body">
        <div className="admin-dashboard">
            <header className="admin-header">
                <h1>Manager Dashboard</h1>
                <div className="admin-info">
                    <p>Welcome, <span className="admin-name">{adminData.name}</span></p>
                    <p className="admin-role">Title: {adminData.role}</p>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>
            
            <main className="admin-content">
                <div className="admin-section">
                    <h2>Restaurant Management</h2>
                    {/* Add your admin-specific content here */}
                    <div className="admin-card">
                        <h3>Employee Management</h3>
                        <p>Manage restaurant staff</p>
                        <button>View Employees</button>
                    </div>
                    
                    <div className="admin-card">
                        <h3>Inventory</h3>
                        <p>Manage restaurant inventory</p>
                        <button>View Inventory</button>
                    </div>
                    
                    <div className="admin-card">
                        <h3>Sales Reports</h3>
                        <p>View daily, weekly, and monthly sales</p>
                        <button>View Reports</button>
                    </div>

                    <div className="admin-card">
                        <h3>Remove Employee</h3>
                        <p>Manage restaurant staff</p>
                        <button>Remove Employee</button>
                    </div>

                    <div className="admin-card">
                        <h3>Add Employee</h3>
                        <p>Manage restaurant staff</p>
                        <button>Add Employee</button>
                    </div>

                    <div className="admin-card">
                        <h3>Update Employee</h3>
                        <p>Manage restaurant staff</p>
                        <button>Update Employee</button>
                    </div>

                    

                </div>
            </main>
        </div>
        </div>
    );
}

export default DashManager;