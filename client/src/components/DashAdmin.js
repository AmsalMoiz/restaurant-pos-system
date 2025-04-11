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
    //Supplier variables
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

    //INVENTORY update, insert, remove
    const [editMode, setEditMode] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [newItem, setNewItem] = useState(null);
    const [editingItemId, setEditingItemId] = useState(null);
    const [editedItemData, setEditedItemData] = useState({});

    //EMPLOYEE update, insert, remove
    const [editModeEmployee, setEditModeEmployee] = useState(false);
    const [newEmployeeEntry, setNewEmployeeEntry] = useState(null);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);
    const [editedEmployeeData, setEditedEmployeeData] = useState({});
    const [employeeToDelete, setEmployeeToDelete] = useState(null);


    
    // #region Inventory Management

    // FETCH INVENTORY
    useEffect(() => {
        const fetchInventory = async () => {
          try {
            const response = await fetch(`${API_URL}/dashboard/inventory`);
            
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("Fetched inventory:", data);
            setInventory(data);
          } catch (err) {
            console.error("Error fetching inventory items:", err);
            setError("Failed to load inventory items. Please try again later.");
          } 
        };
    
        fetchInventory();
    }, []);

    //DELETE INVENTORY ITEM
    const handleDeleteItem = async (id) => {
        console.log("Attempting to delete item ID:", id);
        try {
          const response = await fetch(`${API_URL}/dashboard/items/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) throw new Error("Delete failed");
          setInventory(prev => prev.filter(item => item.item_id !== id));
          setItemToDelete(null);
        } catch (err) {
          alert("Failed to delete item.");
        }
    };

    //ADD INVENTORY ITEM
    const handleAddItem = async () => {
        const { dessert, price, quantity, limit, supplier } = newItem;
      
        if (!dessert || !price || !quantity || !limit || !supplier) {
          alert("All fields must be filled out.");
          return;
        }
      
        if (!window.confirm(`Please review item details before submission:\n${JSON.stringify(newItem, null, 2)}`)) return;
      
        try {
          const response = await fetch(`${API_URL}/dashboard/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newItem)
          });
      
          if (!response.ok) throw new Error("Failed to add item.");
      
          const addedItem = await response.json();
          setInventory(prev => [...prev, addedItem]);
          setNewItem(null);
        } catch (err) {
          alert("Error adding item.");
          console.error("Add item error:", err);
        }
    };

    //UPDATE INVENTORY ITEM
    const handleUpdateItem = async (itemId) => {
        try {
          const response = await fetch(`${API_URL}/dashboard/items/${itemId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editedItemData)
          });
      
          if (!response.ok) throw new Error("Update failed");

      
          setInventory(prev =>
            prev.map(item =>
              item.item_id === itemId
                ? {
                    ...item,
                    ...editedItemData,
                    price: parseFloat(editedItemData.price)
                  }
                : item
            )
          );
          
      
          setEditingItemId(null);
          setEditedItemData({});
        } catch (err) {
          console.error("Update item error:", err);
          alert("Failed to update item.");
        }
      };

      // #endregion

    
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
    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/dashboard/users`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            console.log("Fetched employees:", data); // ✅ log employee array
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load employee data. Please try again later.");
        }
    };

    fetchUsers();
    }, []);

    const handleAddEmployeeEntry = async () => {
        const { name, email, password, role, hourly_pay_rate } = newEmployeeEntry;
    
        if (!name || !email || !password || !role || !hourly_pay_rate) {
            alert("All fields must be filled out.");
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}/dashboard/users/insert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployeeEntry)
            });
    
            if (!response.ok) throw new Error("Failed to add employee.");
    
            const added = await response.json();
            setUsers(prev => [...prev, added]);
            setNewEmployeeEntry(null);
        } catch (err) {
            alert("Error adding employee.");
        }
    };

    const handleUpdateEmployeeEntry = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/dashboard/users/update/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editedEmployeeData)
            });
    
            if (!response.ok) throw new Error("Update failed");
    
            setUsers(prev =>
                prev.map(user =>
                    user.user_id === userId ? { ...user, ...editedEmployeeData } : user
                )
            );
            setEditingEmployeeId(null);
            setEditedEmployeeData({});
        } catch (err) {
            alert("Failed to update employee.");
        }
    };
    
    const handleDeleteEmployee = async (userId) => {
        try {
            const response = await fetch(`${API_URL}/dashboard/users/delete/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error("Delete failed");
            setUsers(prev => prev.filter(user => user.user_id !== userId));
            setEmployeeToDelete(null);
        } catch (err) {
            alert("Failed to delete employee.");
        }
    };


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
    const handleAddSupplier = async (e) => {
        e.preventDefault();
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
            
            // Refresh the users list
            fetchSuppliers();
            
        } catch (error) {
            console.error('Error adding supplier:', error);
            setSupplierFormError(error.message || 'Failed to add supplier. Please try again.');
        } finally {
            setSupplierSubmitLoading(false);
        }
    };
    // REMOVE SUPPLIER
    // Handler for removing a supplier
    const handleRemoveSupplier = async (e) => {
        e.preventDefault();
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
            setRemoveSupplierEmail('');
            
            // Refresh the users list
            fetchSuppliers();
            
        } catch (error) {
            console.error('Error removing supplier:', error);
            setSupplierFormError(error.message || 'Failed to remove supplier. Please try again.');
        } finally {
            setSupplierSubmitLoading(false);
        }
    };
    // UPDATE SUPPLIER
    // Handler for selecting an employee to update
    const handleSupplierSelect = (e) => {
        const selectedEmail = e.target.value;
        if (!selectedEmail) {
            setUpdateSupplierFormData({
                name: '',
                email: '',
                phone_number: '',
                rating: ''
            });
            return;
        }
        
        const selectedSupplier = suppliers.find(supplier => supplier.email === selectedEmail);
        if (selectedSupplier) {
            setUpdateSupplierFormData({
                name: selectedSupplier.name,
                email: selectedSupplier.email,
                phone_number: selectedSupplier.phone_number,
                rating: selectedSupplier.rating
            });
        }
    };
    // Handler for updating an employee
    const handleUpdateSupplier = async (e) => {
        e.preventDefault();
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
      

    // HTML
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
                                
                                {/* Reorder Alerts side */}
                                <div className="admin-card">
                                    <h3>Reoder Alert</h3>
                                    
                                    <button onClick={() => handleSectionClick('reorder_alerts')}>View Reorder Alerts</button>
                                </div>
                                {/* Inventory side */}
                                <div className="admin-card">
                                    <h3>Inventory</h3>
                                    <p>Manage restaurant inventory</p>
                                    <button onClick={handleShowInventory}>View Inventory</button>
                                </div>

                                {/* Users side */}
                                <div className="admin-card">
                                    <h3>Employee Management</h3>
                                    <p>Manage restaurant staff</p>
                                    <button onClick={() => handleSectionClick('employees')}>View Employees</button>
                                </div>

                                {/* Suppliers side */}
                                <div className="admin-card">
                                    <h3>Suppliers</h3>
                                    <p>Manage restaurant suppliers</p>
                                    <button onClick={() => handleSectionClick('suppliers')}>View Suppliers</button>
                                </div>

                                <div className="admin-card">
                                    <h3>Sales Reports</h3>
                                    <p>View daily, weekly, and monthly sales</p>
                                    <button onClick={() => handleSectionClick('reports')}>View Reports</button>
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
                    {/* Show Inventory */}
                    {activeSection === 'inventory' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Inventory Management</h2>
                                <div className="inventory-controls">
                                <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
                                    {editMode ? 'Done' : 'Edit'}
                                </button>
                                {editMode && (
                                    <button
                                    className="add-item-btn"
                                    onClick={() => {
                                        setNewItem({
                                        dessert: '',
                                        price: '',
                                        quantity: '',
                                        limit: '',
                                        supplier: ''
                                        });
                                        setTimeout(() => {
                                        document.getElementById('add-item-row')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}
                                    >
                                    + Add New Item
                                    </button>
                                )}
                                </div>
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
                                                    {editingItemId === item.item_id ? (
                                                    <>
                                                        <td><input value={editedItemData.dessert || ''} onChange={(e) => setEditedItemData({ ...editedItemData, dessert: e.target.value })} /></td>
                                                        <td><input type="number" value={editedItemData.price || ''} onChange={(e) => setEditedItemData({ ...editedItemData, price: e.target.value })} /></td>
                                                        <td><input type="number" value={editedItemData.quantity || ''} onChange={(e) => setEditedItemData({ ...editedItemData, quantity: e.target.value })} /></td>
                                                        <td><input type="number" value={editedItemData.limit || ''} onChange={(e) => setEditedItemData({ ...editedItemData, limit: e.target.value })} /></td>
                                                        <td><input value={editedItemData.supplier || ''} onChange={(e) => setEditedItemData({ ...editedItemData, supplier: e.target.value })} /></td>
                                                    </>
                                                    ) : (
                                                    <>
                                                        <td>{item.dessert}</td>
                                                        <td>${item.price.toFixed(2)}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.limit}</td>
                                                        <td>{item.supplier}</td>
                                                    </>
                                                    )}
                                                    <td>{item.quantity <= item.limit ? 
                                                        <span className="status-low">Low Stock</span> : 
                                                        <span className="status-ok">In Stock</span>}
                                                    </td>
                                                    {editMode && (
                                                    <>
                                                        <td>
                                                        <button className="delete-btn" onClick={() => setItemToDelete(item)}>
                                                        <span className="minus-line"></span>
                                                        </button>
                                                        </td>
                                                        <td>
                                                        {editingItemId === item.item_id ? (
                                                            <>
                                                            <button onClick={() => setEditingItemId(null)}>Cancel</button>
                                                            <button onClick={() => handleUpdateItem(item.item_id)}>Save</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => {
                                                            setEditingItemId(item.item_id);
                                                            setEditedItemData(item);
                                                            }}>Update</button>
                                                        )}
                                                        </td>
                                                    </>
                                                    )}
                                                </tr>
                                            ))}
                                            {editMode && !newItem && (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: "center" }}>
                                                <button onClick={() => setNewItem({
                                                    dessert: '',
                                                    price: '',
                                                    quantity: '',
                                                    limit: '',
                                                    supplier: ''
                                                })}>+ Add New Item</button>
                                                </td>
                                            </tr>
                                            )}
                                            {editMode && newItem && (
                                            <tr id="add-item-row">
                                                <td><input placeholder="Item" value={newItem.dessert} onChange={(e) => setNewItem({ ...newItem, dessert: e.target.value })} /></td>
                                                <td><input type="number" placeholder="$" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} /></td>
                                                <td><input type="number" placeholder="Qty" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} /></td>
                                                <td><input type="number" placeholder="Limit" value={newItem.limit} onChange={(e) => setNewItem({ ...newItem, limit: e.target.value })} /></td>
                                                <td><input placeholder="Supplier" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} /></td>
                                                <td colSpan="2">
                                                <button onClick={() => setNewItem(null)}>Cancel</button>
                                                <button onClick={handleAddItem}>Submit</button>
                                                </td>
                                            </tr>
                                            )}
                                            
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            {itemToDelete && (
                            <>
                                <div className="modal-overlay" onClick={() => setItemToDelete(null)} />
                                <div className="confirmation-box">
                                <p>Are you sure you want to delete this item?</p>
                                <div className="delete-item-details">
                                    <p><strong>Item:</strong> {itemToDelete.dessert}</p>
                                    <p><strong>Price:</strong> ${itemToDelete.price}</p>
                                    <p><strong>Quantity:</strong> {itemToDelete.quantity}</p>
                                    <p><strong>Reorder Threshold:</strong> {itemToDelete.limit}</p>
                                    <p><strong>Supplier:</strong> {itemToDelete.supplier}</p>
                                </div>
                                <button onClick={() => setItemToDelete(null)}>Cancel</button>
                                <button className="delete-confirm-btn" onClick={() => handleDeleteItem(itemToDelete.item_id)}>Delete</button>
                                </div>
                            </>
                            )}
                        </div>
                    )}

                    {/* Show users/employees */}
                    {activeSection === 'employees' && (
                    <div className="admin-section">
                        <div className="section-header">
                            <h2>Employee Management</h2>
                            <div className="inventory-controls">
                                <button className="edit-btn" onClick={() => setEditModeEmployee(!editModeEmployee)}>
                                    {editModeEmployee ? 'Done' : 'Edit'}
                                </button>
                                {editModeEmployee && (
                                    <button className="add-item-btn" onClick={() => {
                                        setNewEmployeeEntry({ name: '', email: '', password: '', role: '', hourly_pay_rate: '' });
                                        setTimeout(() => {
                                            document.getElementById('add-employee-row')?.scrollIntoView({ behavior: 'smooth' });
                                        }, 100);
                                    }}>
                                        + Add New Employee
                                    </button>
                                )}
                            </div>
                            <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                        </div>

                        <div className="employees-container">
                            <table className="employees-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Role</th>
                                        <th>Hourly Rate</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index) => (
                                        <tr key={index}>
                                            {editingEmployeeId === user.user_id ? (
                                                <>
                                                    <td><input value={editedEmployeeData.name || ''} onChange={(e) => setEditedEmployeeData({ ...editedEmployeeData, name: e.target.value })} /></td>
                                                    <td><input value={editedEmployeeData.role || ''} onChange={(e) => setEditedEmployeeData({ ...editedEmployeeData, role: e.target.value })} /></td>
                                                    <td><input type="number" value={editedEmployeeData.hourly_pay_rate || ''} onChange={(e) => setEditedEmployeeData({ ...editedEmployeeData, hourly_pay_rate: e.target.value })} /></td>
                                                    <td>{user.email}</td>
                                                    <td><input type="password" placeholder="Enter new password" value={editedEmployeeData.password || ''} onChange={(e) => setEditedEmployeeData({ ...editedEmployeeData, password: e.target.value })}/></td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{user.name}</td>
                                                    <td>{user.role}</td>
                                                    <td>{user.pay !== undefined ? `$${user.pay.toFixed(2)}` : 'N/A'}</td>
                                                    <td>{user.email}</td>
                                                </>
                                            )}
                                            {editModeEmployee && (
                                                <>
                                                    <td>
                                                        <button className="delete-btn" onClick={() => setEmployeeToDelete(user)}>
                                                            <span className="minus-line"></span>
                                                        </button>
                                                    </td>
                                                    <td>
                                                        {editingEmployeeId === user.user_id ? (
                                                            <>
                                                                <button onClick={() => setEditingEmployeeId(null)}>Cancel</button>
                                                                <button onClick={() => handleUpdateEmployeeEntry(user.user_id)}>Save</button>
                                                            </>
                                                        ) : (
                                                            <button onClick={() => {
                                                                setEditingEmployeeId(user.user_id);
                                                                setEditedEmployeeData(user);
                                                            }}>Update</button>
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                    {editModeEmployee && newEmployeeEntry && (
                                        <tr id="add-employee-row">
                                        <td><input placeholder="Name" value={newEmployeeEntry.name} onChange={(e) => setNewEmployeeEntry({ ...newEmployeeEntry, name: e.target.value })} /></td>
                                        <td><input placeholder="Role" value={newEmployeeEntry.role} onChange={(e) => setNewEmployeeEntry({ ...newEmployeeEntry, role: e.target.value })} /></td>
                                        <td><input type="number" placeholder="Hourly Rate" value={newEmployeeEntry.hourly_pay_rate} onChange={(e) => setNewEmployeeEntry({ ...newEmployeeEntry, hourly_pay_rate: e.target.value })} /></td>
                                        <td><input placeholder="Email" value={newEmployeeEntry.email} onChange={(e) => setNewEmployeeEntry({ ...newEmployeeEntry, email: e.target.value })} /></td>
                                        <td><input placeholder="Password" type="password" value={newEmployeeEntry.password} onChange={(e) => setNewEmployeeEntry({ ...newEmployeeEntry, password: e.target.value })} /></td>
                                        <td colSpan="2">
                                            <button onClick={() => setNewEmployeeEntry(null)}>Cancel</button>
                                            <button onClick={handleAddEmployeeEntry}>Submit</button>
                                        </td>
                                    </tr>                                    
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {employeeToDelete && (
                            <>
                                <div className="modal-overlay" onClick={() => setEmployeeToDelete(null)} />
                                <div className="confirmation-box">
                                    <p>Are you sure you want to delete this employee?</p>
                                    <div className="delete-item-details">
                                        <p><strong>Name:</strong> {employeeToDelete.name}</p>
                                        <p><strong>Email:</strong> {employeeToDelete.email}</p>
                                        <p><strong>Role:</strong> {employeeToDelete.role}</p>
                                    </div>
                                    <button onClick={() => setEmployeeToDelete(null)}>Cancel</button>
                                    <button className="delete-confirm-btn" onClick={() => handleDeleteEmployee(employeeToDelete.user_id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                    )}

                    {/* Show suppliers */}
                    {activeSection === 'suppliers' && (
                    <div className="admin-section">
                    <div className="section-header">
                    <h2>Suppliers</h2>
                    <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                    </div>
        
                    <div className="suppliers-container">
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
                            
                        </tr>
                        </thead>
                        <tbody>
                        {suppliers.map((supplier, index) => (
                            <tr key={index}>
                                <td>{supplier.name}</td>
                                <td>{supplier.email}</td>
                                <td>{supplier.phone_number}</td>
                                <td>{supplier.rating}</td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        )}
                    </div>
                    </div>
                    )}
                    {/* Add Supplier */}
                    {activeSection === 'add-supplier' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Add New Supplier</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            
                            <div className="employee-form-container">
                                <form className="employee-form" onSubmit={handleAddSupplier}>
                                    <div className="form-group">
                                        <label htmlFor="name">Full Name</label>
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
                                            <option value="">Set Supplier Rating</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="3">4</option>
                                            <option value="5">5</option>
                                            
                                        </select>
                                    </div>
                                    
                                    
                                    <div className="form-buttons">
                                        <button type="button" className="cancel-btn" onClick={() => setActiveSection(null)}>Cancel</button>
                                        <button type="submit" className="submit-btn" disabled={supplierSubmitLoading}>
                                            {supplierSubmitLoading ? 'Adding...' : 'Add Supplier'}
                                        </button>
                                    </div>
                                </form>
                                
                                {supplierFormError && <div className="form-error">{supplierFormError}</div>}
                                {supplierFormSuccess && <div className="form-success">{supplierFormSuccess}</div>}
                            </div>
                        </div>
                    )}
                    {/* Remove user */}
                    {activeSection === 'remove-supplier' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Remove Supplier</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            
                            <div className="employee-form-container">
                                <form className="employee-form" onSubmit={handleRemoveSupplier}>
                                    <div className="form-group">
                                        <label htmlFor="remove-email">Supplier Email</label>
                                        <select 
                                            id="remove-email" 
                                            value={removeSupplierEmail}
                                            onChange={(e) => setRemoveSupplierEmail(e.target.value)}
                                            required
                                        >
                                            <option value="">Select a supplier</option>
                                            {suppliers.map((supplier, index) => (
                                                <option key={index} value={supplier.email}>
                                                    {supplier.name} ({supplier.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    {removeSupplierEmail && (
                                        <div className="confirmation-box">
                                            <p className="warning-text">Are you sure you want to remove this supplier?</p>
                                            <p>This action cannot be undone.</p>
                                            
                                            <div className="selected-employee">
                                                <p><strong>Name:</strong> {suppliers.find(u => u.email === removeSupplierEmail)?.name}</p>
                                                <p><strong>Email:</strong> {removeSupplierEmail}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="form-buttons">
                                        <button type="button" className="cancel-btn" onClick={() => setActiveSection(null)}>Cancel</button>
                                        <button type="submit" className="delete-confirm-btn" disabled={!removeSupplierEmail || supplierSubmitLoading}>
                                            {supplierSubmitLoading ? 'Removing...' : 'Confirm Removal'}
                                        </button>
                                    </div>
                                </form>
                                
                                {supplierFormError && <div className="form-error">{supplierFormError}</div>}
                                {supplierFormSuccess && <div className="form-success">{supplierFormSuccess}</div>}
                            </div>
                        </div>
                    )}
                    {/* Update user */}
                    {activeSection === 'update-supplier' && (
                        <div className="admin-section">
                            <div className="section-header">
                                <h2>Update Supplier</h2>
                                <button className="back-btn" onClick={() => setActiveSection(null)}>Back to Dashboard</button>
                            </div>
                            
                            <div className="employee-form-container">
                                <div className="employee-selection">
                                    <label htmlFor="update-email">Select Supplier to Update:</label>
                                    <select 
                                        id="update-email" 
                                        value={updateSupplierFormData.email}
                                        onChange={handleSupplierSelect}
                                        required
                                    >
                                        <option value="">Select a suppplier</option>
                                        {suppliers.map((supplier, index) => (
                                            <option key={index} value={supplier.email}>
                                                {supplier.name} ({supplier.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {updateSupplierFormData.email && (
                                    <form className="employee-form" onSubmit={handleUpdateSupplier}>
                                        <div className="form-group">
                                            <label htmlFor="update-name">Full Name</label>
                                            <input 
                                                type="text" 
                                                id="update-name" 
                                                value={updateSupplierFormData.name} 
                                                onChange={(e) => setUpdateFormData({...updateSupplierFormData, name: e.target.value})}
                                                required 
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="update-phone">Phone Number</label>
                                            <input 
                                                id="update-phone" 
                                                type="tel"
                                                pattern="[0-9]{7,15}"
                                                minLength="7"
                                                maxLength="15"
                                                placeholder="1234567890"
                                                value={updateSupplierFormData.phone_number}
                                                onChange={(e) => setUpdateSupplierFormData({...updateSupplierFormData, phone_number: e.target.value})}
                                                required
                                            />
                                           
                                        </div>
                                        
                                        <div className="form-group">
                                            <label htmlFor="update-rating">Rating</label>
                                            <select 
                                                id="update-rating" 
                                                value={updateSupplierFormData.rating}
                                                onChange={(e) => setUpdateSupplierFormData({...updateSupplierFormData, rating: e.target.value})}
                                                required
                                            >
                                                <option value="">Select a rating</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                                <option value="5">5</option>
                                            </select>
                                        </div>
                                        
                                        <div className="form-group">
                                            <p className="email-note"><strong>Note:</strong> Email cannot be updated as it is used as the unique identifier.</p>
                                            <p className="email-display">{updateSupplierFormData.email}</p>
                                        </div>
                                        
                                        <div className="form-buttons">
                                            <button type="button" className="cancel-btn" onClick={() => setActiveSection(null)}>Cancel</button>
                                            <button type="submit" className="submit-btn" disabled={updateSupplierSubmitLoading}>
                                                {updateSubmitLoading ? 'Updating...' : 'Update Employee'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                
                                {updateSupplierFormError && <div className="form-error">{updateSupplierFormError}</div>}
                                {updateSupplierFormSuccess && <div className="form-success">{updateSupplierFormSuccess}</div>}
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