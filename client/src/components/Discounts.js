import React, { useState, useEffect } from 'react';
import './Discounts.css';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function Discounts() {
  const navigate = useNavigate();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(true);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
 
  const [newDiscount, setNewDiscount] = useState({
    code: '',
    discount_type: 'percentage',
    value: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/discounts`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDiscounts(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (editingDiscount) {
      setEditingDiscount({
        ...editingDiscount,
        [name]: type === 'checkbox' ? checked : value
      });
    } else {
      setNewDiscount({
        ...newDiscount,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleAddDiscount = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/discounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDiscount),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Reset form and refresh discounts
      setNewDiscount({
        code: '',
        discount_type: '',
        value: '',
        start_date: '',
        end_date: '',
        is_active: true
      });
      fetchDiscounts();
    } catch (error) {
      setError(error);
    }
  };

  const handleUpdateDiscount = async (id, updatedData) => {
    try {
      const response = await fetch(`${API_BASE}/api/discounts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchDiscounts();
      setEditingDiscount(null);
    } catch (error) {
      setError(error);
    }
  };

  const handleDeleteDiscount = async (id) => { // confirmDeleteItem = async (
      try {
        const response = await fetch(`${API_BASE}/api/discounts/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setItemToDelete(null);
        setShowDeletePopup(false);
        fetchDiscounts();
      } catch (error) {
        setError(error);
      }
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    await handleUpdateDiscount(id, { is_active: !currentStatus });
  };

  const startEditing = (discount) => {
    // Format dates for input fields
    const formattedDiscount = {
      ...discount,
      start_date: formatDateForInput(discount.start_date),
      end_date: formatDateForInput(discount.end_date)
    };
    setEditingDiscount(formattedDiscount);
  };

  const cancelEditing = () => {
    setEditingDiscount(null);
  };

  const saveEditing = (e) => {
    e.preventDefault();
    handleUpdateDiscount(editingDiscount.discount_id, editingDiscount);
  };

  // Helper function to format date for input field
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Helper function to format value based on discount type
  const formatValue = (value, type) => {
    // Normalize discount type for consistent handling
    const normalizedType = type.toLowerCase();
    
    if (normalizedType.includes('percentage')) {
      return `${value}%`;
    } else if (normalizedType.includes('fixed')) {
      return `$${value}`;
    } else {
      // Default case for any other type that might be added in the future
      return value;
    }
  };

  if (loading) {
    return <div>Loading discounts...</div>;
  }

  if (error) {
    return <div>Error loading discounts: {error.message}</div>;
  }

  return (
    <div className="inventory-management-container">
      <h2 className="inventory-management-title">Discount Management</h2>
      <div className="header-buttons">
        <button className="button back-button" onClick={() => navigate(-1)}>
          Back to Dashboard
        </button>
        <button 
          className="button done-button" 
          onClick={() => {
            setEditMode(!editMode);
            setEditingDiscount(null);
          }}
        >
          {editMode ? "Done" : "Edit Mode"} 
        </button>
      </div>
      
      {editingDiscount ? (
        <div className="add-form edit-form">
          <h3>Edit Discount</h3>
          <form onSubmit={saveEditing}>
            <div className="form-row">
              <div className="form--group">
                <label>Code:</label>
                <input
                  type="text"
                  name="code"
                  value={editingDiscount.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form--group">
                <label>Type:</label>
                <select
                  name="discount_type"
                  value={editingDiscount.discount_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                  <option value="Seasonal Percentage">Seasonal Percentage</option>
                  <option value="Seasonal Fixed Amount">Seasonal Fixed Amount</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form--group">
                <label>Value:</label>
                <input
                  type="number"
                  name="value"
                  value={editingDiscount.value}
                  onChange={handleInputChange}
                  step={editingDiscount.discount_type.toLowerCase().includes('percentage') ? '1' : '0.01'}
                  min="0"
                  required
                />
              </div>
              <div className="form--group">
                <label>Active:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={editingDiscount.is_active}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form--group">
                <label>Start Date:</label>
                <input
                  type="date"
                  name="start_date"
                  value={editingDiscount.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form--group">
                <label>End Date:</label>
                <input
                  type="date"
                  name="end_date"
                  value={editingDiscount.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="edit-buttons">
              <button type="submit" className="submit-button">Save Changes</button>
              <button type="button" className="cancel-button" onClick={cancelEditing}>Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="add-form">
          <h3>Add New Discount</h3>
          <form onSubmit={handleAddDiscount}>
            <div className="form-row">
              <div className="form--group">
                <label>Code:</label>
                <input
                  type="text"
                  name="code"
                  value={newDiscount.code}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form--group">
                <label>Type:</label>
                <select
                  name="discount_type"
                  value={newDiscount.discount_type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Percentage">Percentage</option>
                  <option value="Fixed Amount">Fixed Amount</option>
                  <option value="Seasonal Percentage">Seasonal Percentage</option>
                  <option value="Seasonal Fixed Amount">Seasonal Fixed Amount</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form--group">
                <label>Value:</label>
                <input
                  type="number"
                  name="value"
                  value={newDiscount.value}
                  onChange={handleInputChange}
                  step={newDiscount.discount_type.toLowerCase().includes('percentage') ? '1' : '0.01'}
                  min="0"
                  required
                />
              </div>
              <div className="form--group">
                <label>Active:</label>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={newDiscount.is_active}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form--group">
                <label>Start Date:</label>
                <input
                  type="date"
                  name="start_date"
                  value={newDiscount.start_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form--group">
                <label>End Date:</label>
                <input
                  type="date"
                  name="end_date"
                  value={newDiscount.end_date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="submit-button">Add Discount</button>
          </form>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Discount ID</th>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((discount) => (
              <tr key={discount.discount_id} className={editingDiscount && editingDiscount.discount_id === discount.discount_id ? 'editing-row' : ''}>
                <td>{discount.discount_id}</td>
                <td>{discount.code}</td>
                <td>{discount.discount_type}</td>
                <td>{formatValue(discount.value, discount.discount_type)}</td>
                <td>{new Date(discount.start_date).toLocaleDateString()}</td>
                <td>{new Date(discount.end_date).toLocaleDateString()}</td>
                <td>{discount.is_active ? 'Yes' : 'No'}</td>
                <td className="action-buttons">
                  {editMode && !editingDiscount && (
                    <button 
                      onClick={() => startEditing(discount)}
                      className="edit-button"
                    >
                      Edit
                    </button>
                  )}
                  <button 
                    onClick={() => toggleActiveStatus(discount.discount_id, discount.is_active)}
                    className={discount.is_active ? "deactivate-button" : "activate-button"}
                  >
                    {discount.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  {editMode && (
                    <button 
                      onClick={() => { setItemToDelete(discount); 
                        setShowDeletePopup(true); 
                      }} 
                      className="delete-button"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showDeletePopup && itemToDelete && (
          <>
            <div
              className="modal-overlay"
              onClick={() => setShowDeletePopup(false)}
            />
            <div className="confirmation-box">
              <h3>Confirm Delete</h3>
              <p>
                <strong>Code:</strong> {itemToDelete.code}
              </p>
              <p>
                <strong>Type:</strong> {itemToDelete.discount_type}
              </p>
              <p>
                <strong>Value:</strong> {formatValue(itemToDelete.value, itemToDelete.discount_type)}
              </p>
              <p>
                <strong>Start Date:</strong> {formatDateForInput(itemToDelete.start_date) ? new Date(itemToDelete.start_date).toLocaleDateString() : "Invalid Date"}
              </p>
              <p>
                <strong>End Date:</strong>  {formatDateForInput(itemToDelete.end_date) ? new Date(itemToDelete.end_date).toLocaleDateString() : "Invalid Date"}
              </p>
              <div className="confirm-buttons">
                <button onClick={() => setShowDeletePopup(false)}>
                Cancel
                </button>
                <button onClick={() => handleDeleteDiscount(itemToDelete.discount_id)}>
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Discounts;