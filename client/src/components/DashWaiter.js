import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashAdmin.css";


function DashWaiter() {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    //const [inventory, setInventory] = useState([]);
    //const [showInventory, setShowInventory] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    //const [users, setUsers] = useState([]);
    //const [showUsers, setShowUsers] = useState(false);
    // Add these state variables at the top of your component with the other state declarations
    
    

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
            if (user.role !== 'Waiter') {
                setError("Unauthorized access");
                navigate('/users/login'); // Redirect to regular dashboard
                return;
            }
            
            setAdminData(user);
            setLoading(false);
        } catch (err) {
            console.error("Error loading admin data:", err);
            setError("Error loading admin data");
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
                    <h1>Waiter Dashboard</h1>
                    <div className="admin-info">
                        <p>Welcome, <span className="admin-name">{adminData.name}</span></p>
                        <p className="admin-role">Role: {adminData.role}</p>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </header>

                <main className="admin-content">
                    {/* Admin menu cards */}
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
                                
                                {/* Log hours */}
                                <div className="admin-card">
                                    <h3>Log Hours</h3>
                                    <p>Log hours worked and their date</p>
                                    <button onClick={() => navigate('/log-hours')}>Log</button>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* Add other sections for the remaining functionality */}
                    {/* Employee Sales Reports */}
                    
                </main>
            </div>
        </div>
    );
}

export default DashWaiter;