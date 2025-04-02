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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        hourly_pay_rate: ''
        });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [removeEmail, setRemoveEmail] = useState('');
    const [updateFormData, setUpdateFormData] = useState({
        name: '',
        email: '',
        role: '',
        hourly_pay_rate: ''
    });
    const [updateFormError, setUpdateFormError] = useState('');
    const [updateFormSuccess, setUpdateFormSuccess] = useState('');
    const [updateSubmitLoading, setUpdateSubmitLoading] = useState(false);

    // FETCH INVENTORY
    useEffect(() => {
        const fetchInventory = async () => {
          try {
            const response = await fetch(`${API_URL}/dashboard/inventory`);
            
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
    // FETCH USERS
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard/users`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load employee data. Please try again later.");
        } 
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    // ADD USER
    // Add this function to handle form submission
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setSubmitLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/dashboard/users/insert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to add employee');
            }
            
            // Success! Clear form and show success message
            setFormSuccess('Employee added successfully!');
            setFormData({
                name: '',
                email: '',
                password: '',
                role: '',
                hourly_pay_rate: ''
            });
            
            // Refresh the users list
            fetchUsers();
            
        } catch (error) {
            console.error('Error adding employee:', error);
            setFormError(error.message || 'Failed to add employee. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };
        
    // Handler for selecting an employee to update
    const handleEmployeeSelect = (e) => {
        const selectedEmail = e.target.value;
        if (!selectedEmail) {
            setUpdateFormData({
                name: '',
                email: '',
                role: '',
                hourly_pay_rate: ''
            });
            return;
        }
        
        const selectedUser = users.find(user => user.email === selectedEmail);
        if (selectedUser) {
            setUpdateFormData({
                name: selectedUser.name,
                email: selectedUser.email,
                role: selectedUser.role,
                hourly_pay_rate: selectedUser.pay.toString()
            });
        }
    };

    // Handler for removing an employee
    const handleRemoveEmployee = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setSubmitLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/dashboard/users/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: removeEmail }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to remove employee');
            }
            
            // Success! Clear form and show success message
            setFormSuccess('Employee removed successfully!');
            setRemoveEmail('');
            
            // Refresh the users list
            fetchUsers();
            
        } catch (error) {
            console.error('Error removing employee:', error);
            setFormError(error.message || 'Failed to remove employee. Please try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    // Handler for updating an employee
    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        setUpdateFormError('');
        setUpdateFormSuccess('');
        setUpdateSubmitLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/dashboard/users/update`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateFormData),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update employee');
            }
            
            // Success! Show success message
            setUpdateFormSuccess('Employee updated successfully!');
            
            // Refresh the users list
            fetchUsers();
            
        } catch (error) {
            console.error('Error updating employee:', error);
            setUpdateFormError(error.message || 'Failed to update employee. Please try again.');
        } finally {
            setUpdateSubmitLoading(false);
        }
    };

    
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
                                
                                {/* Inventory side */}
                                <div className="admin-card">
                                    <h3>Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={handleShowInventory}>View Inventory</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Remove Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={() => handleSectionClick('remove-inventory')}>Remove Inventory</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Add Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={() => handleSectionClick('add-inventory')}>Add Inventory</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Update Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={() => handleSectionClick('update-inventory')}>Update Inventory</button>
                                </div>

                                {/* Users side */}
                                <div className="admin-card">
                                    <h3>Employee Management</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => handleSectionClick('employees')}>View Employees</button>
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

                                {/* Suppliers side */}
                                <div className="admin-card">
                                    <h3>Suppliers</h3>
                                    <p>Manage restaurant suppliers</p>
                                    <button onClick={() => handleSectionClick('suppliers')}>View Suppliers</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Remove Supplier</h3>
                                    <p>Manage restaurant suppliers</p>
                                    <button onClick={() => handleSectionClick('remove-suppliers')}>Remove Supplier</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Add Supplier</h3>
                                    <p>Manage restaurant suppliers</p>
                                    <button onClick={() => handleSectionClick('add-supplier')}>Add Supplier</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Update Supplier</h3>
                                    <p>Manage restaurant supplier</p>
                                    <button onClick={() => handleSectionClick('update-supplier')}>Update Supplier</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Sales Reports</h3>
                                    <p>View daily, weekly, and monthly sales</p>
                                    <button onClick={() => handleSectionClick('reports')}>View Reports</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Show Inventory */}
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

                    {/* Show users/employees */}
                    {activeSection === 'employees' && (
                    <div className="admin-section">
                    <div className="section-header">
                    <h2>Employee Management</h2>
                    <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                    </div>
        
                    <div className="employees-container">
                        {users.length === 0 ? (
                        <p>Loading employee data...</p>
                        ) : (
                        <table className="employees-table">
                        <thead>
                            <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Hours Worked</th>
                            <th>Hourly Rate</th>
                            <th>Email</th>
                            
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.name}</td>
                                <td>
                                    <span className={`role-badge role-${user.role.toLowerCase()}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td>{user.hours.toFixed(1)}</td>
                                <td>${user.pay.toFixed(2)}</td>
                                <td>{user.email}</td>
                                
                                
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        )}
                    </div>
                    </div>
                    )}

                    {/* Add user */}
                    {activeSection === 'add-employee' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Add New Employee</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            
                            <div className="employee-form-container">
                                <form className="employee-form" onSubmit={handleAddEmployee}>
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="email">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            required 
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">Password</label>
                                        <input 
                                            type="password" 
                                            id="password" 
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="role">Role</label>
                                        <select 
                                            id="role" 
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                                            required
                                        >
                                            <option value="">Select a role</option>
                                            <option value="DBA">DBA</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Waiter">Waiter</option>
                                            <option value="Cook">Cook</option>
                                            
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="hourly_pay_rate">Hourly Pay Rate ($)</label>
                                        <input 
                                            type="number" 
                                            id="hourly_pay_rate" 
                                            min="10" 
                                            step="0.10"
                                            value={formData.hourly_pay_rate}
                                            onChange={(e) => setFormData({...formData, hourly_pay_rate: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="form-buttons">
                                        <button type="button" className="cancel-btn" onClick={() => setActiveSection(null)}>Cancel</button>
                                        <button type="submit" className="submit-btn" disabled={submitLoading}>
                                            {submitLoading ? 'Adding...' : 'Add Employee'}
                                        </button>
                                    </div>
                                </form>
                                
                                {formError && <div className="form-error">{formError}</div>}
                                {formSuccess && <div className="form-success">{formSuccess}</div>}
                            </div>
                        </div>
                    )}
                    {/* Remove user */}
                    {activeSection === 'remove-employee' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Remove Employee</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            
                            <div className="employee-form-container">
                                <form className="employee-form" onSubmit={handleRemoveEmployee}>
                                    <div className="form-group">
                                        <label htmlFor="remove-email">Employee Email</label>
                                        <select 
                                            id="remove-email" 
                                            value={removeEmail}
                                            onChange={(e) => setRemoveEmail(e.target.value)}
                                            required
                                        >
                                            <option value="">Select an employee</option>
                                            {users.map((user, index) => (
                                                <option key={index} value={user.email}>
                                                    {user.name} ({user.email}) - {user.role}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {removeEmail && (
                                        <div className="confirmation-box">
                                            <p className="warning-text">Are you sure you want to remove this employee?</p>
                                            <p>This action cannot be undone.</p>
                                            
                                            <div className="selected-employee">
                                                <p><strong>Name:</strong> {users.find(u => u.email === removeEmail)?.name}</p>
                                                <p><strong>Email:</strong> {removeEmail}</p>
                                                <p><strong>Role:</strong> {users.find(u => u.email === removeEmail)?.role}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="form-buttons">
                                        <button type="button" className="cancel-btn" onClick={() => setActiveSection(null)}>Cancel</button>
                                        <button type="submit" className="delete-confirm-btn" disabled={!removeEmail || submitLoading}>
                                            {submitLoading ? 'Removing...' : 'Confirm Removal'}
                                        </button>
                                    </div>
                                </form>
                                
                                {formError && <div className="form-error">{formError}</div>}
                                {formSuccess && <div className="form-success">{formSuccess}</div>}
                            </div>
                        </div>
                    )}
                    {/* Update user */}
                    {activeSection === 'update-employee' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Update Employee</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            
                            <div className="employee-form-container">
                                <div className="employee-selection">
                                    <label htmlFor="update-email">Select Employee to Update:</label>
                                    <select 
                                        id="update-email" 
                                        value={updateFormData.email}
                                        onChange={handleEmployeeSelect}
                                        required
                                    >
                                        <option value="">Select an employee</option>
                                        {users.map((user, index) => (
                                            <option key={index} value={user.email}>
                                                {user.name} ({user.email}) - {user.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {updateFormData.email && (
                                    <form className="employee-form" onSubmit={handleUpdateEmployee}>
                                        <div className="form-group">
                                            <label htmlFor="update-name">Full Name</label>
                                            <input 
                                                type="text" 
                                                id="update-name" 
                                                value={updateFormData.name} 
                                                onChange={(e) => setUpdateFormData({...updateFormData, name: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="update-role">Role</label>
                                            <select 
                                                id="update-role" 
                                                value={updateFormData.role}
                                                onChange={(e) => setUpdateFormData({...updateFormData, role: e.target.value})}
                                                required
                                            >
                                                <option value="">Select a role</option>
                                                <option value="DBA">DBA</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Waiter">Waiter</option>
                                                <option value="Cook">Cook</option>
                                            </select>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="update-hourly_pay_rate">Hourly Pay Rate ($)</label>
                                            <input 
                                                type="number" 
                                                id="update-hourly_pay_rate" 
                                                min="10" 
                                                step="0.10"
                                                value={updateFormData.hourly_pay_rate}
                                                onChange={(e) => setUpdateFormData({...updateFormData, hourly_pay_rate: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <p className="email-note"><strong>Note:</strong> Email cannot be updated as it is used as the unique identifier.</p>
                                            <p className="email-display">{updateFormData.email}</p>
                                        </div>
                                        
                                        <div className="form-buttons">
                                            <button type="button" className="cancel-btn" onClick={() => setActiveSection(null)}>Cancel</button>
                                            <button type="submit" className="submit-btn" disabled={updateSubmitLoading}>
                                                {updateSubmitLoading ? 'Updating...' : 'Update Employee'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                
                                {updateFormError && <div className="form-error">{updateFormError}</div>}
                                {updateFormSuccess && <div className="form-success">{updateFormSuccess}</div>}
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
                </main>
            </div>
        </div>
    );
}

export default DashAdmin;