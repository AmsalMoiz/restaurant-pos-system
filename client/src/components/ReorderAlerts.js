import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReorderAlerts.css";
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

function ReorderAlerts() {
    //Back to Dashboard
    const navigate = useNavigate();
    const handleBackToDashboard = () => {
        navigate('/admin-dashboard');
    };
    //const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    //Reorder Alerts
    const [reorderAlerts, setReorderAlerts] = useState([]);

    
    
    
    // FETCH REORDER ALERTS
    const fetchReorderAlerts = async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard/reorder_alerts`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setReorderAlerts(data);
        } catch(err){
            console.error("Error fetching reorder alerts:", err);
            setError("Failed to load reorder alerts. Please try again later.");
        }
    };
    useEffect(() => {
        fetchReorderAlerts();
    }, []);

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
                    <header className="t-section-header">
                    <h1>Reorder Alerts</h1>
                    <button className="t-back-btn" onClick={handleBackToDashboard}>Back to Dashboard</button>
                    </header>
        
                    <div className="employees-container">
                        {reorderAlerts.length === 0 ? (
                        <p>Loading alerts data...</p>
                        ) : (
                        <table className="employees-table">
                        <thead>
                            <tr>
                            <th>Item Name</th>
                            <th>timestamp</th>
                            <th>Resolved Status</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                        {reorderAlerts.map((alert, index) => (
                            <tr key={index}>
                                <td>{alert.item}</td>
                                <td>{alert.timestamp}</td>
                                <td>
                                    <span className={alert.resolved === 0 ? "status-not-resolved" : "status-resolved"}>
                                            {alert.resolved === 0 ? 'Not Resolved' : 'Resolved'}
                                    </span>
                                </td>

                            </tr>
                            ))}
                        </tbody>
                        </table>
                        )}
                    </div>
        </div>
    );
    

};

export default ReorderAlerts;