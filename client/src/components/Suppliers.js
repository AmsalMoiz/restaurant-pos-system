import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Suppliers.css";
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

function Suppliers() {
    //Back to Dashboard
        const navigate = useNavigate();
        const handleBackToDashboard = () => {
            navigate('/admin-dashboard');
        };
    
    //const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
    
    // #region Suppliers Management
        // FETCH SUPPLIERS
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${API_BASE}/dashboard/suppliers`);
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
            const response = await fetch(`${API_BASE}/dashboard/suppliers/insert`, {
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
            const response = await fetch(`${API_BASE}/dashboard/suppliers/delete`, {
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
            const response = await fetch(`${API_BASE}/dashboard/suppliers/update`, {
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
                                <header className="section-header">
                                <h1>Supplier Management</h1>
                                <button className="t-back-btn" onClick={handleBackToDashboard}>Back to Dashboard</button>
                                </header>
        
                                <div className="suppliers-management-container">
                                <div className="suppliers-controls">
                                    
                                    <button 
                                    className={`add-supplier-btn ${showAddSupplierForm ? 'cancel-mode' : ''}`}
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
    );
};

export default Suppliers;