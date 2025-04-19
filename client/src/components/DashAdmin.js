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
    //const [showInventory, setShowInventory] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [users, setUsers] = useState([]);
    //const [showUsers, setShowUsers] = useState(false);
    // Add these state variables at the top of your component with the other state declarations
    
    //Supplier variables
    const [showAddSupplierForm, setShowAddSupplierForm] = useState(false);
    const [editingSupplierIndex, setEditingSupplierIndex] = useState(null);
    const [deletingSupplierIndex, setDeletingSupplierIndex] = useState(null);
    //Supplier Data Query
    const [suppliers, setSuppliers] = useState([]);
    //Supplier Insert
    const [supplierFormData, setSupplierFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        rating: ''
    });
    const [supplierFormError, setSupplierFormError] = useState('');
    const [supplierFormSuccess, setSupplierFormSuccess] = useState('');
    const [supplierSubmitLoading, setSupplierSubmitLoading] = useState(false);
    //Supplier Remove
    const [removeSupplierEmail, setRemoveSupplierEmail] = useState('');
    //Supplier Update
    const [updateSupplierFormData, setUpdateSupplierFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        rating: ''
    });
    const [updateSupplierFormError, setUpdateSupplierFormError] = useState('');
    const [updateSupplierFormSuccess, setUpdateSupplierFormSuccess] = useState('');
    const [updateSupplierSubmitLoading, setUpdateSupplierSubmitLoading] = useState(false);
    //Reorder Alerts
    const [reorderAlerts, setReorderAlerts] = useState([]);

    //Process Transactions
    const [cart, setCart] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [itemQuantity, setItemQuantity] = useState(1);
    const [tipAmount, setTipAmount] = useState(0);
    const [checkoutStep, setCheckoutStep] = useState('items'); // 'items', 'review', 'complete'
    const [transactionId, setTransactionId] = useState(null);
    const [checkoutError, setCheckoutError] = useState('');
    const [checkoutSuccess, setCheckoutSuccess] = useState('');
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [orderType, setOrderType] = useState('Dine-in');
    //Employee Sales Report
    const [employeeMonthlyReport, setEmployeeMonthlyReport] = useState([]);
    const [employeeWeeklyReport, setEmployeeWeeklyReport] = useState([]);
    const [employeeDailyReport, setEmployeeDailyReport] = useState([]);
    const [employeeCustomReport, setEmployeeCustomReport] = useState([]);
    const [activeReportType, setActiveReportType] = useState('monthly');

    // #region Suppliers Management
    // FETCH SUPPLIERS
    const fetchSuppliers = async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard/suppliers`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setSuppliers(data);
        } catch(err){
            console.error("Error fetching suppliers:", err);
            setError("Failed to load suppliers. Please try again later.");
        }
    };
    useEffect(() => {
        fetchSuppliers();
    }, []);
    // INSERT SUPPLIER
    // Updated handleAddSupplier function (now doesn't need the event parameter)

    const handleAddSupplier = async () => {
        setSupplierFormError('');
        setSupplierFormSuccess('');
        setSupplierSubmitLoading(true);
        
        try {
        const response = await fetch(`${API_URL}/dashboard/suppliers/insert`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplierFormData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to add supplier');
        }
        
        // Success! Clear form and show success message
        setSupplierFormSuccess('Supplier added successfully!');
        setSupplierFormData({
            name: '',
            email: '',
            phone_number: '',
            rating: ''
        });
        
        // Hide the form after successful addition
        setTimeout(() => {
            setShowAddSupplierForm(false);
            setSupplierFormSuccess('');
        }, 2000);
        
        // Refresh the suppliers list
        fetchSuppliers();
        
        } catch (error) {
        console.error('Error adding supplier:', error);
        setSupplierFormError(error.message || 'Failed to add supplier. Please try again.');
        } finally {
        setSupplierSubmitLoading(false);
        }
    };
    // REMOVE SUPPLIER
    // Updated handleRemoveSupplier function
    const handleRemoveSupplier = async () => {
        setSupplierFormError('');
        setSupplierFormSuccess('');
        setSupplierSubmitLoading(true);
        
        try {
        const response = await fetch(`${API_URL}/dashboard/suppliers/delete`, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: removeSupplierEmail }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to remove supplier');
        }
        
        // Success! Clear form and show success message
        setSupplierFormSuccess('Supplier removed successfully!');
        
        // Close the delete confirmation after successful deletion
        setTimeout(() => {
            setDeletingSupplierIndex(null);
            setRemoveSupplierEmail('');
            setSupplierFormSuccess('');
        }, 2000);
        
        // Refresh the suppliers list
        fetchSuppliers();
        
        } catch (error) {
        console.error('Error removing supplier:', error);
        setSupplierFormError(error.message || 'Failed to remove supplier. Please try again.');
        } finally {
        setSupplierSubmitLoading(false);
        }
    };
    // UPDATE SUPPLIER
    // Updated handleUpdateSupplier function (now doesn't need the event parameter)
    const handleUpdateSupplier = async () => {
        setUpdateSupplierFormError('');
        setUpdateSupplierFormSuccess('');
        setUpdateSupplierSubmitLoading(true);
        
        try {
        const response = await fetch(`${API_URL}/dashboard/suppliers/update`, {
            method: 'PATCH',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateSupplierFormData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to update supplier');
        }
        
        // Success! Show success message
        setUpdateSupplierFormSuccess('Supplier updated successfully!');
        
        // Close the edit form after successful update
        setTimeout(() => {
            setEditingSupplierIndex(null);
            setUpdateSupplierFormSuccess('');
        }, 2000);
        
        // Refresh the suppliers list
        fetchSuppliers();
        
        } catch (error) {
        console.error('Error updating supplier:', error);
        setUpdateSupplierFormError(error.message || 'Failed to update supplier. Please try again.');
        } finally {
        setUpdateSupplierSubmitLoading(false);
        }
    };
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
                                {/* Process Transaction */}
                                <div className="admin-card">
                                    <h3>Process Transactions</h3>
                                    
                                    <button onClick={() => navigate('/transactions')}>Checkout</button>
                                </div>
                                
                                {/* Reorder Alerts side */}
                                <div className="admin-card">
                                    <h3>Reoder Alert</h3>
                                    
                                    <button onClick={() => handleSectionClick('reorder_alerts')}>View Reorder Alerts</button>
                                </div>

                                {/* Inventory side */}
                                <div className="admin-card">
                                    <h3>Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={() => navigate('/inventory')}>View Inventory</button>
                                </div>

                                {/* Users side */}
                                <div className="admin-card">
                                    <h3>Employee Management</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => navigate('/employees')}>View Employees</button>
                                </div>

                                {/* Suppliers side */}
                                <div className="admin-card">
                                    <h3>Suppliers</h3>
                                    <p>Manage restaurant suppliers</p>
                                    <button onClick={() => handleSectionClick('suppliers')}>View Suppliers</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Items Sales Report</h3>
                                    <p>View daily, weekly, and monthly sales</p>
                                    <button onClick={() => navigate('/reports/items-sales')}>View Reports</button>
                                </div>
                                {/* Employee Sales Report side */}
                                <div className="admin-card">
                                    <h3>Employee Sales Report</h3>
                                    <p>View daily, weekly, and monthly employee sales</p>
                                    <button onClick={() => handleSectionClick('employee-reports')}>View Reports</button>
                                </div>

                                {/* Customer Reports */}
                                <div className="admin-card">
                                    <h3>Customer Reports</h3>
                                    <p>Analyze customer behavior and trends</p>
                                    <button onClick={() => navigate('/customer-report')}>View Reports</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show reorder alerts */}
                    {activeSection === 'reorder_alerts' && (
                    <div className="admin-section">
                    <div className="section-header">
                    <h2>Reorder Alerts</h2>
                    <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                    </div>
        
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
                                <td>{alert.resolved}</td>

                            </tr>
                            ))}
                        </tbody>
                        </table>
                        )}
                    </div>
                    </div>
                    )}
                    {/* Show suppliers */}
                    {activeSection === 'suppliers' && (
                    <div className="admin-section">
                        <div className="section-header">
                        <h2>Supplier Management</h2>
                        <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                        </div>

                        <div className="suppliers-management-container">
                        <div className="suppliers-controls">
                            <h3>Suppliers</h3>
                            <button 
                            className="add-supplier-btn"
                            onClick={() => {
                                setShowAddSupplierForm(!showAddSupplierForm);
                                setSupplierFormData({
                                name: '',
                                email: '',
                                phone_number: '',
                                rating: ''
                                });
                                setSupplierFormError('');
                                setSupplierFormSuccess('');
                            }}
                            >
                            {showAddSupplierForm ? 'Cancel' : 'Add New Supplier'}
                            </button>
                        </div>

                        {/* Add Supplier Form - Only shown when the Add button is clicked */}
                        {showAddSupplierForm && (
                            <div className="supplier-form-container">
                            <form className="supplier-form" onSubmit={(e) => {
                                e.preventDefault();
                                handleAddSupplier();
                            }}>
                                <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Supplier Name</label>
                                    <input 
                                    type="text" 
                                    id="name" 
                                    value={supplierFormData.name} 
                                    onChange={(e) => setSupplierFormData({...supplierFormData, name: e.target.value})}
                                    required 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input 
                                    type="email" 
                                    id="email" 
                                    value={supplierFormData.email}
                                    onChange={(e) => setSupplierFormData({...supplierFormData, email: e.target.value})}
                                    required 
                                    />
                                </div>
                                </div>

                                <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input 
                                    type="tel" 
                                    id="phone" 
                                    pattern="[0-9]{7,15}" 
                                    minLength="7"
                                    maxLength="15"
                                    placeholder="1234567890"
                                    value={supplierFormData.phone_number}
                                    onChange={(e) => setSupplierFormData({...supplierFormData, phone_number: e.target.value})}
                                    required 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="rating">Rating</label>
                                    <select 
                                    id="rating" 
                                    value={supplierFormData.rating}
                                    onChange={(e) => setSupplierFormData({...supplierFormData, rating: e.target.value})}
                                    required
                                    >
                                    <option value="">Select Rating</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    </select>
                                </div>
                                </div>
                                
                                <div className="form-buttons">
                                <button 
                                    type="submit" 
                                    className="submit-btn" 
                                    disabled={supplierSubmitLoading}
                                >
                                    {supplierSubmitLoading ? 'Adding...' : 'Add Supplier'}
                                </button>
                                </div>
                            </form>
                            
                            {supplierFormError && <div className="form-error">{supplierFormError}</div>}
                            {supplierFormSuccess && <div className="form-success">{supplierFormSuccess}</div>}
                            </div>
                        )}

                        {/* Suppliers Table with Inline Edit/Delete */}
                        <div className="suppliers-table-container">
                            {suppliers.length === 0 ? (
                            <p>Loading supplier data...</p>
                            ) : (
                            <table className="suppliers-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Rating</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {suppliers.map((supplier, index) => (
                                    <React.Fragment key={index}>
                                    <tr className={editingSupplierIndex === index ? 'editing-row' : ''}>
                                        <td>{supplier.name}</td>
                                        <td>{supplier.email}</td>
                                        <td>{supplier.phone_number}</td>
                                        <td>{supplier.rating}</td>
                                        <td className="action-buttons">
                                        {editingSupplierIndex !== index && deletingSupplierIndex !== index && (
                                            <>
                                            <button 
                                                className="edit-btn"
                                                onClick={() => {
                                                setEditingSupplierIndex(index);
                                                setUpdateSupplierFormData({
                                                    name: supplier.name,
                                                    email: supplier.email,
                                                    phone_number: supplier.phone_number,
                                                    rating: supplier.rating.toString()
                                                });
                                                setUpdateSupplierFormError('');
                                                setUpdateSupplierFormSuccess('');
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                className="delete-btn"
                                                onClick={() => {
                                                setDeletingSupplierIndex(index);
                                                setRemoveSupplierEmail(supplier.email);
                                                setSupplierFormError('');
                                                setSupplierFormSuccess('');
                                                }}
                                            >
                                                Delete
                                            </button>
                                            </>
                                        )}
                                        {(editingSupplierIndex === index || deletingSupplierIndex === index) && (
                                            <button 
                                            className="cancel-inline-btn"
                                            onClick={() => {
                                                setEditingSupplierIndex(null);
                                                setDeletingSupplierIndex(null);
                                            }}
                                            >
                                            Cancel
                                            </button>
                                        )}
                                        </td>
                                    </tr>
                                    
                                    {/* Inline Edit Form */}
                                    {editingSupplierIndex === index && (
                                        <tr className="edit-form-row">
                                        <td colSpan="5">
                                            <form className="inline-edit-form" onSubmit={(e) => {
                                            e.preventDefault();
                                            handleUpdateSupplier();
                                            }}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                <label>Name</label>
                                                <input
                                                    className="name-form-input" 
                                                    type="text" 
                                                    value={updateSupplierFormData.name} 
                                                    onChange={(e) => setUpdateSupplierFormData({
                                                    ...updateSupplierFormData, 
                                                    name: e.target.value
                                                    })}
                                                    required 
                                                />
                                                </div>
                                                
                                                <div className="form-group">
                                                <label>Phone</label>
                                                <input 
                                                    type="tel"
                                                    pattern="[0-9]{7,15}"
                                                    value={updateSupplierFormData.phone_number}
                                                    onChange={(e) => setUpdateSupplierFormData({
                                                    ...updateSupplierFormData, 
                                                    phone_number: e.target.value
                                                    })}
                                                    required
                                                />
                                                </div>
                                                
                                                <div className="form-group">
                                                <label>Rating</label>
                                                
                                                <select 
                                                    className ="rating-form-select"
                                                    value={updateSupplierFormData.rating}
                                                    onChange={(e) => setUpdateSupplierFormData({
                                                    ...updateSupplierFormData, 
                                                    rating: e.target.value
                                                    })}
                                                    required
                                                >
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                </select>
                                                </div>
                                                
                                                <div className="form-group button-group">
                                                <button 
                                                    type="submit" 
                                                    className="save-btn" 
                                                    disabled={updateSupplierSubmitLoading}
                                                >
                                                    {updateSupplierSubmitLoading ? 'Saving...' : 'Save'}
                                                </button>
                                                </div>
                                            </div>
                                            {updateSupplierFormError && (
                                                <div className="inline-form-error">{updateSupplierFormError}</div>
                                            )}
                                            {updateSupplierFormSuccess && (
                                                <div className="inline-form-success">{updateSupplierFormSuccess}</div>
                                            )}
                                            </form>
                                        </td>
                                        </tr>
                                    )}
                                    
                                    {/* Inline Delete Confirmation */}
                                    {deletingSupplierIndex === index && (
                                        <tr className="delete-confirm-row">
                                        <td colSpan="5">
                                            <div className="inline-delete-confirm">
                                            <p className="warning-text">
                                                Are you sure you want to delete supplier <strong>{supplier.name}</strong>?
                                            </p>
                                            <div className="confirm-buttons">
                                                <button 
                                                className="confirm-delete-btn" 
                                                onClick={() => {
                                                    handleRemoveSupplier();
                                                    // The deleting index will be reset in the success callback
                                                }}
                                                disabled={supplierSubmitLoading}
                                                >
                                                {supplierSubmitLoading ? 'Deleting...' : 'Confirm Delete'}
                                                </button>
                                            </div>
                                            {supplierFormError && (
                                                <div className="inline-form-error">{supplierFormError}</div>
                                            )}
                                            {supplierFormSuccess && (
                                                <div className="inline-form-success">{supplierFormSuccess}</div>
                                            )}
                                            </div>
                                        </td>
                                        </tr>
                                    )}
                                    </React.Fragment>
                                ))}
                                </tbody>
                            </table>
                            )}
                        </div>
                        </div>
                    </div>
                    )}
                    
                    {/* Sales Reports */}
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
                    {/* Employee Sales Reports */}
                    {activeSection === 'employee-reports' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Employee Sales Reports</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
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
                    )}
                </main>
            </div>
        </div>
    );
}

export default DashAdmin;