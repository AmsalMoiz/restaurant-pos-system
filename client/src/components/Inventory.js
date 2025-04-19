import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

function InventoryPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemData, setEditedItemData] = useState({});
  const [newItem, setNewItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const addRowRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${API_URL}/dashboard/inventory`);
        const data = await response.json();
        setInventory(data);
      } catch (err) {
        console.error("Error fetching inventory items:", err);
      }
    };
    fetchInventory();
  }, []);

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleUpdateItem = async (itemId) => {
    const formData = new FormData();
  
    // Append the text data from editedItemData
    formData.append('dessert', editedItemData.dessert || '');
    formData.append('price', editedItemData.price || '');
    formData.append('quantity', editedItemData.quantity || '');
    formData.append('limit', editedItemData.limit || '');
    formData.append('supplier', editedItemData.supplier || '');
  
    // Append the selected image file (if any)
    if (selectedImage) {
      formData.append('image', selectedImage); // 'image' is the field name your backend will expect
    }

    try {
      const response = await fetch(`${API_URL}/dashboard/items/${itemId}`, {
        method: "PATCH",
        body: formData, // Use FormData for file uploads
        // Remove the Content-Type header, FormData sets it automatically
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed with status:", response.status, "and message:", errorText);
        throw new Error(`Update failed with status ${response.status}`);
      }
      const updatedItem = await response.json();
      console.log("Updated Item Data:", updatedItem);
      setInventory((prev) =>
        prev.map((item) => (item.item_id === itemId ? updatedItem : item))
      );
      setEditingItemId(null);
      setEditedItemData({});
      setSelectedImage(null);
    } catch (err) {
      console.error("Update item error:", err);
      alert("Failed to update item. Image file name may be too long or the image size is too big.");
    }
  };

  const handleAddItem = () => {
    if (!newItem.dessert || !newItem.price || !newItem.quantity || !newItem.limit || !newItem.supplier) {
      alert("All fields must be filled out.");
      return;
    }

    const formData = new FormData();
    formData.append('dessert', newItem.dessert);
    formData.append('price', newItem.price);
    formData.append('quantity', newItem.quantity);
    formData.append('limit', newItem.limit);
    formData.append('supplier', newItem.supplier);

    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    setShowConfirmPopup(true);
  };

  const confirmAddItem = async () => {

    const formDataToSend = new FormData();
    formDataToSend.append('dessert', newItem.dessert);
    formDataToSend.append('price', newItem.price);
    formDataToSend.append('quantity', newItem.quantity);
    formDataToSend.append('limit', newItem.limit);
    formDataToSend.append('supplier', newItem.supplier);
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      const response = await fetch(`${API_URL}/dashboard/items`, {
        method: "POST",
        // headers: { "Content-Type": "application/json" },
        body: formDataToSend,
      });
      if (!response.ok) throw new Error("Add failed");
      const addedItem = await response.json();
      setInventory((prev) => [...prev, addedItem]);
      setNewItem(null);
      setShowConfirmPopup(false);
      setSelectedImage(null);
    } catch (err) {
      console.error("Add item error:", err);
      alert("Failed to add item. Image file name may be too long or the image size is too big.");
    }
  };

  const confirmDeleteItem = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/items/${itemToDelete.item_id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setInventory((prev) => prev.filter((item) => item.item_id !== itemToDelete.item_id));
      setItemToDelete(null);
      setShowDeletePopup(false);
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  return (
    <div className="i-admin-dashboard-body">
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Inventory Management</h1>
          <div className="admin-info">
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>{editMode ? "Done" : "Edit"}</button>
            <button className="back-btn" onClick={() => navigate(-1)}>Back to Dashboard</button>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-section">
            {editMode && (
              <div className="add-item-button-wrapper">
                <button className="add-item-btn" onClick={() => {
                  setNewItem({ dessert: "", price: "", quantity: "", limit: "", supplier: "" });
                  setTimeout(() => {
                    addRowRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}>
                  + Add New Item
                </button>
              </div>
            )}

            <div className="inventory-container">
              {inventory.length === 0 ? (
                <p>Loading inventory data...</p>
              ) : (
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Dessert</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Limit</th>
                      <th>Supplier</th>
                      <th>Image Name</th>
                      {editMode && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((item) => (
                      <tr key={item.item_id}>
                        {editingItemId === item.item_id ? (
                          <>
                            <td><input value={editedItemData.dessert || ''} onChange={(e) => setEditedItemData({ ...editedItemData, dessert: e.target.value })} /></td>
                            <td><input type="number" value={editedItemData.price || ''} onChange={(e) => setEditedItemData({ ...editedItemData, price: e.target.value })} /></td>
                            <td><input type="number" value={editedItemData.quantity || ''} onChange={(e) => setEditedItemData({ ...editedItemData, quantity: e.target.value })} /></td>
                            <td><input type="number" value={editedItemData.limit || ''} onChange={(e) => setEditedItemData({ ...editedItemData, limit: e.target.value })} /></td>
                            <td><input value={editedItemData.supplier || ''} onChange={(e) => setEditedItemData({ ...editedItemData, supplier: e.target.value })} /></td>
                            <td><input type="file" accept="image/*" onChange={handleImageChange} /></td>
                            <td>
                              <button onClick={() => setEditingItemId(null)}>Cancel</button>
                              <button onClick={() => {console.log("Save button clicked for item ID:", item.item_id); handleUpdateItem(item.item_id)}}>Save</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{item.dessert}</td>
                            <td>${item.price}</td>
                            <td>{item.quantity}</td>
                            <td>{item.limit}</td>
                            <td>{item.supplier}</td>
                            <td>{item.image_name}</td> 
                            {editMode && (
                              <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button className="delete-btn" onClick={() => { setItemToDelete(item); setShowDeletePopup(true); }}>
                                  <span className="minus-line"></span>
                                </button>
                                <button onClick={() => { setEditingItemId(item.item_id); setEditedItemData(item); }}>Update</button>
                              </td>
                            )}
                          </>
                        )}
                      </tr>
                    ))}
                    {editMode && newItem && (
                      <tr ref={addRowRef} id="add-item-row">
                        <td><input placeholder="Dessert" value={newItem.dessert} onChange={(e) => setNewItem({ ...newItem, dessert: e.target.value })} /></td>
                        <td><input type="number" placeholder="$" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} /></td>
                        <td><input type="number" placeholder="Qty" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} /></td>
                        <td><input type="number" placeholder="Limit" value={newItem.limit} onChange={(e) => setNewItem({ ...newItem, limit: e.target.value })} /></td>
                        <td><input placeholder="Supplier" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} /></td>
                        <td><input type="file" accept="image/*" onChange={handleImageChange} /></td>
                        <td>
                          <button onClick={() => setNewItem(null)}>Cancel</button>
                          <button onClick={handleAddItem}>Submit</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>

        {showConfirmPopup && (
          <>
            <div className="modal-overlay" onClick={() => setShowConfirmPopup(false)} />
            <div className="confirmation-box">
              <h3>Confirm New Item</h3>
              <p><strong>Dessert:</strong> {newItem.dessert}</p>
              <p><strong>Price:</strong> ${newItem.price}</p>
              <p><strong>Quantity:</strong> {newItem.quantity}</p>
              <p><strong>Limit:</strong> {newItem.limit}</p>
              <p><strong>Supplier:</strong> {newItem.supplier}</p>
              <div className="confirm-buttons">
                <button onClick={() => setShowConfirmPopup(false)}>Cancel</button>
                <button onClick={confirmAddItem}>Confirm</button>
              </div>
            </div>
          </>
        )}

        {showDeletePopup && itemToDelete && (
          <>
            <div className="modal-overlay" onClick={() => setShowDeletePopup(false)} />
            <div className="confirmation-box">
              <h3>Confirm Delete</h3>
              <p><strong>Dessert:</strong> {itemToDelete.dessert}</p>
              <p><strong>Price:</strong> ${itemToDelete.price}</p>
              <p><strong>Quantity:</strong> {itemToDelete.quantity}</p>
              <p><strong>Limit:</strong> {itemToDelete.limit}</p>
              <p><strong>Supplier:</strong> {itemToDelete.supplier}</p>
              <div className="confirm-buttons">
                <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
                <button onClick={confirmDeleteItem}>Delete</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default InventoryPage;