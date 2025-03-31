import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashAdmin.css";
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

function DashAdmin() {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [inventory, setInventory] = useState([]);
    const [showInventory, setShowInventory] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    // Fetch the inventory
    useEffect(() => {
        const fetchInventory = async () => {
          try {
            const response = await fetch(`${API_URL}/admin-dashboard`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setInventory(data);
          } catch (err) {
            console.error("Error fetching inventory items:", err);
            setError("Failed to load inventory items. Please try again later.");
          } 
        };
    
        fetchInventory();
    }, []);

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

    const handleShowInventory = () => {
        setActiveSection('inventory');
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
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
                    <h1>Dashboard</h1>
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
                                <div className="admin-card">
                                    <h3>Employee Management</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => handleSectionClick('employees')}>View Employees</button>
                                </div>
                                
                                <div className="admin-card">
                                    <h3>Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={handleShowInventory}>View Inventory</button>
                                </div>
                                
                                <div className="admin-card">
                                    <h3>Sales Reports</h3>
                                    <p>View daily, weekly, and monthly sales</p>
                                    <button onClick={() => handleSectionClick('reports')}>View Reports</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Remove Employee</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => handleSectionClick('remove-employee')}>Remove Employee</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Add Employee</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => handleSectionClick('add-employee')}>Add Employee</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Update Employee</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => handleSectionClick('update-employee')}>Update Employee</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inventory Section */}
                    {activeSection === 'inventory' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Inventory Management</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            
                            <div className="inventory-container">
                                {inventory.length === 0 ? (
                                    <p>Loading inventory data...</p>
                                ) : (
                                    <table className="inventory-table">
                                        <thead>
                                            <tr>
                                                <th>Item Name</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Reorder Threshold</th>
                                                <th>Supplier</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inventory.map((item, index) => (
                                                <tr key={index} className={item.quantity <= item.limit ? "low-stock" : ""}>
                                                    <td>{item.dessert}</td>
                                                    <td>${item.price.toFixed(2)}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.limit}</td>
                                                    <td>{item.supplier}</td>
                                                    <td>{item.quantity <= item.limit ? 
                                                        <span className="status-low">Low Stock</span> : 
                                                        <span className="status-ok">In Stock</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Placeholder for other sections */}
                    {activeSection === 'employees' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Employee Management</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            <p>Employee management interface would go here</p>
                        </div>
                    )}

                    {activeSection === 'reports' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Sales Reports</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            <p>Sales reports would go here</p>
                        </div>
                    )}

                    {/* Add other sections for the remaining functionality */}
                </main>
            </div>
        </div>
    );
}

export default DashAdmin;