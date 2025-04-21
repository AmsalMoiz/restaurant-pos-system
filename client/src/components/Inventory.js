import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

function InventoryPage() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [orderMode, setOrderMode] = useState(false);
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editedItemData, setEditedItemData] = useState({});
  const [newItem, setNewItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const addRowRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageInputRef = useRef(null);
  const [orderConfirmation, setOrderConfirmation] = useState(null);


  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch(`${API_BASE}/dashboard/inventory`);
        const data = await response.json();
        setInventory(data);
      } catch (err) {
        console.error("Error fetching inventory items:", err);
      }
    };
    fetchInventory();
  }, []);

  const selectedItem = inventory.find(item => item.item_id === parseInt(selectedOrderItem));

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const clearImageInput = () => {
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  const handleUpdateItem = async (itemId) => {
    const formData = new FormData();
    formData.append('dessert', editedItemData.dessert || '');
    formData.append('price', editedItemData.price || '');
    formData.append('supplier_price', editedItemData.supplier_price || '');
    formData.append('quantity', editedItemData.quantity || '');
    formData.append('limit', editedItemData.limit || '');
    formData.append('supplier', editedItemData.supplier || '');
    formData.append('description', editedItemData.description || '');
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await fetch(`${API_BASE}/dashboard/items/${itemId}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Update failed with status:", response.status, "and message:", errorText);
        throw new Error(`Update failed with status ${response.status}`);
      }

      const updatedItem = await response.json();
      setInventory((prev) =>
        prev.map((item) => (item.item_id === itemId ? updatedItem : item))
      );
      setEditingItemId(null);
      setEditedItemData({});
      clearImageInput();
    } catch (err) {
      console.error("Update item error:", err);
      alert("Failed to update item. Image file name may be too long or the image size is too big.");
    }
  };

  const handleAddItem = () => {
    if (!newItem.dessert || !newItem.price || !newItem.quantity || !newItem.limit || !newItem.supplier || !newItem.description ) {
      alert("All fields must be filled out.");
      return;
    }
    setShowConfirmPopup(true);
  };

  const confirmAddItem = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append('dessert', newItem.dessert);
    formDataToSend.append('price', newItem.price);
    formDataToSend.append('supplier_price', newItem.supplier_price || '');
    formDataToSend.append('quantity', newItem.quantity);
    formDataToSend.append('limit', newItem.limit);
    formDataToSend.append('supplier', newItem.supplier);
    formDataToSend.append('description', newItem.description || '');
    if (selectedImage) {
      formDataToSend.append('image', selectedImage);
    }

    try {
      const response = await fetch(`${API_BASE}/dashboard/items`, {
        method: "POST",
        body: formDataToSend,
      });
      if (!response.ok) throw new Error("Add failed");
      const addedItem = await response.json();
      setInventory((prev) => [...prev, addedItem]);
      setNewItem(null);
      setShowConfirmPopup(false);
      clearImageInput();
    } catch (err) {
      console.error("Add item error:", err);
      alert("Failed to add item. Image file name may be too long or the image size is too big.");
    }
  };

  const confirmDeleteItem = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/items/${itemToDelete.item_id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setInventory((prev) => prev.filter((item) => item.item_id !== itemToDelete.item_id));
      setItemToDelete(null);
      setShowDeletePopup(false);
    } catch (err) {
      alert("Failed to delete item.");
    }
  };

  const handleOrderInventory = () => {
    setOrderMode(true);
    setEditMode(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedItem || !orderQuantity || orderQuantity < 1) {
      alert("Please select an item and enter a valid quantity.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/supplier-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          item_id: selectedItem.item_id,
          quantity_ordered: parseInt(orderQuantity),
        }),
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(`Failed to place order: ${errMsg}`);
      }

      const result = await response.json();
      setOrderConfirmation({
        orderId: result.order_id,
        itemName: selectedItem.dessert,
        quantity: orderQuantity,
        date: new Date().toLocaleDateString()
      });

      const refreshed = await fetch(`${API_BASE}/dashboard/inventory`);
      const data = await refreshed.json();
      setInventory(data);

      setSelectedOrderItem(null);
      setOrderQuantity(1);
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  const closeOrderConfirmation = () => {
    setOrderMode(false);
    setOrderConfirmation(null);
  };

  // const handleEditClick = (item) => {
  //   setEditingItemId(item.item_id);
  //   setEditedItemData({
  //     dessert: item.dessert,
  //     price: item.price,
  //     supplier_price: item.supplier_price,
  //     quantity: item.quantity,
  //     limit: item.limit,
  //     supplier: item.supplier,
  //   });
  // };

  return (
    <div className="i-admin-dashboard-body">
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Inventory Management</h1>
          <div className="admin-info">
            {orderMode ? (
              <button className="edit-btn" onClick={() => navigate(-1)}>Back</button>
            ) : (
              <button className="edit-btn" onClick={() => { setEditMode(!editMode); setOrderMode(false); }}>{editMode ? "Done" : "Edit"}</button>
            )}
            <button className="back-btn" onClick={() => navigate(-1)}>Back to Dashboard</button>
          </div>
        </header>

        <main className="admin-content">
          <div className="admin-section">
            {(editMode || orderMode) && (
              <div className="add-item-button-wrapper" style={{ display: 'flex', gap: '10px' }}>
                {editMode && (
                  <button className="add-item-btn" onClick={() => {
                    setNewItem({ dessert: "", price: "", supplier_price: "", quantity: "", limit: "", supplier: "", description: "" });
                    setTimeout(() => {
                      addRowRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}>+ Add New Item</button>
                )}
                {!orderMode && (
                  <button className="order-inventory-btn" onClick={handleOrderInventory}>Order Inventory</button>
                )}
              </div>
            )}

            {!orderMode && (
              <div className="inventory-container">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Dessert</th>
                      <th>Price</th>
                      <th>Supplier Price</th>
                      <th>Quantity</th>
                      <th>Limit</th>
                      <th>Supplier</th>
                      <th>Description</th>
                      <th>Image Name</th>
                      {editMode && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                  {inventory.map((item) => (

                    <tr key={item.item_id}>
                      {editingItemId === item.item_id ? (
                        <>
                          <td><input type="text" value={editedItemData.dessert || ''} onChange={(e) => setEditedItemData({ ...editedItemData, dessert: e.target.value })} /></td>
                          <td><input type="number" value={editedItemData.price || ''} onChange={(e) => setEditedItemData({ ...editedItemData, price: e.target.value })} /></td>
                          <td><input type="number" value={editedItemData.supplier_price || ''} onChange={(e) => setEditedItemData({ ...editedItemData, supplier_price: e.target.value })} /></td>
                          <td><input type="number" value={editedItemData.quantity || ''} onChange={(e) => setEditedItemData({ ...editedItemData, quantity: e.target.value })} /></td>
                          <td><input type="number" value={editedItemData.limit || ''} onChange={(e) => setEditedItemData({ ...editedItemData, limit: e.target.value })} /></td>
                          <td><input type="text" value={editedItemData.supplier || ''} onChange={(e) => setEditedItemData({ ...editedItemData, supplier: e.target.value })} /></td>
                          <td><textarea value={editedItemData.description || ''} onChange={(e) => setEditedItemData({ ...editedItemData, description: e.target.value })} /></td>
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
                          <td>${item.supplier_price}</td>
                          <td>{item.quantity}</td>
                          <td>{item.limit}</td>
                          <td>{item.supplier}</td>
                          <td>{item.description}</td>
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
                        <td><input type="number" placeholder="$ Supplier" value={newItem.supplier_price} onChange={(e) => setNewItem({ ...newItem, supplier_price: e.target.value })} /></td>
                        <td><input type="number" placeholder="Qty" value={newItem.quantity} onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} /></td>
                        <td><input type="number" placeholder="Limit" value={newItem.limit} onChange={(e) => setNewItem({ ...newItem, limit: e.target.value })} /></td>
                        <td><input placeholder="Supplier" value={newItem.supplier} onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })} /></td>
                        <td><textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} /></td>
                        <td><input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} /></td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => { setNewItem(null); clearImageInput(); }}>Cancel</button>
                          <button onClick={handleAddItem}>Submit</button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {orderMode && (
              <div className="order-form">
                <table className="inventory-table">
                  <thead>
                    <tr>
                      <th>Select Item</th>
                      <th>Price</th>
                      <th>In Stock</th>
                      <th>Quantity to Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select value={selectedOrderItem || ""} onChange={(e) => setSelectedOrderItem(e.target.value)}>
                          <option value="" disabled>Select an item</option>
                          {inventory.map(item => (
                            <option key={item.item_id} value={item.item_id}>{item.dessert}</option>
                          ))}
                        </select>
                      </td>
                      <td>{selectedItem ? `$${selectedItem.price}` : '-'}</td>
                      <td>{selectedItem ? selectedItem.quantity : '-'}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={orderQuantity}
                          onChange={(e) => setOrderQuantity(e.target.value)}
                          disabled={!selectedItem}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="order-inventory-btn" onClick={handlePlaceOrder}>Place Order</button>
                </div>
              </div>
            )}
            
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
              <p><strong>Description:</strong> {newItem.description}</p>
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
              <p><strong>Description:</strong> {itemToDelete.description}</p>
              <div className="confirm-buttons">
                <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
                <button onClick={confirmDeleteItem}>Delete</button>
              </div>
            </div>
          </>
        )}

        {orderConfirmation && (
                  <>
                    <div className="modal-overlay" onClick={closeOrderConfirmation} />
                    <div className="confirmation-box">
                      <h3>Order Placed!</h3>
                      <p><strong>Order ID:</strong> {orderConfirmation.orderId}</p>
                      <p><strong>Item:</strong> {orderConfirmation.itemName}</p>
                      <p><strong>Quantity:</strong> {orderConfirmation.quantity}</p>
                      <p><strong>Date:</strong> {orderConfirmation.date}</p>
                      <div className="confirm-buttons">
                        <button onClick={closeOrderConfirmation}>OK</button>
                      </div>
                    </div>
                  </>
                )}

          </div>
        </main>
      </div>
    </div>
  );
}

export default InventoryPage;
