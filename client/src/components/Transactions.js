import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Transactions.css";
const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

function Transactions() {
    //Back to Dashboard
    const navigate = useNavigate();
    const handleBackToDashboard = () => {
        navigate('/admin-dashboard');
    };
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [inventory, setInventory] = useState([]);
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

    //handling adding items to cart
    const handleAddToCart = () => {
        if (!selectedItem) {
            setCheckoutError('Please select an item to add');
            return;
        }
        
        if (itemQuantity < 1) {
            setCheckoutError('Quantity must be at least 1');
            return;
        }
        
        const item = inventory.find(i => i.dessert === selectedItem);
        if (!item) {
            setCheckoutError('Item not found in inventory');
            return;
        }
        
        // Check if item is already in cart
        const existingCartItem = cart.find(i => i.name === selectedItem);
        
        if (existingCartItem) {
            // Update quantity if item already exists in cart
            const updatedCart = cart.map(i => 
            i.name === selectedItem 
                ? { ...i, quantity: i.quantity + parseInt(itemQuantity) } 
                : i
            );
            setCart(updatedCart);
        } else {
            // Add new item to cart
            setCart([...cart, {
            name: item.dessert,
            price: item.price,
            quantity: parseInt(itemQuantity),
            item_id: item.item_id // You may need to add item_id to your inventory API response
            }]);
        }
        
        // Reset form and error
        setSelectedItem('');
        setItemQuantity(1);
        setCheckoutError('');
        };
    
    
        // removing items from cart
        const handleRemoveFromCart = (index) => {
            const newCart = [...cart];
            newCart.splice(index, 1);
            setCart(newCart);
        };
        
        // Calculate cart totals
        const calculateSubtotal = () => {
            return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        };
              
        const calculateTax = () => {
            return calculateSubtotal() * 0.0825; // 8.25% tax rate
        };
              
        const calculateTotal = () => {
            const subtotal = calculateSubtotal();
            const tax = Math.round(subtotal * 0.0825 * 100) / 100; // Round to 2 decimal places
            return subtotal + tax;
        };
        
        // Start transaction process
        const startCheckout = async () => {
            if (cart.length === 0) {
                setCheckoutError('Your cart is empty');
                return;
            }
            
            setCheckoutLoading(true);
            setCheckoutError('');
            
            try {
                // Get the user ID from adminData
                const userId = adminData.user_id; 
                
                // 1. Create initial transaction
                const createTransactionResponse = await fetch(`${API_URL}/dashboard/initial/transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    payment_method: paymentMethod,
                    order_type: orderType
                }),
                });
                //
                if (!createTransactionResponse.ok) {
                throw new Error('Failed to create transaction');
                }
                
                const transactionData = await createTransactionResponse.json();
                const newTransactionId = transactionData.transaction_id;
                setTransactionId(newTransactionId);
                
                // 2. Add each item to the transaction_items table
                for (const item of cart) {
                const addItemResponse = await fetch(`${API_URL}/dashboard/transaction_items`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                    transaction_id: newTransactionId,
                    item_id: item.item_id,
                    quantity: item.quantity
                    }),
                });
                
                if (!addItemResponse.ok) {
                    throw new Error(`Failed to add item ${item.name} to transaction`);
                }
                }
                
                // 3. Move to review step
                setCheckoutStep('review');
                
            } catch (error) {
                console.error('Checkout error:', error);
                setCheckoutError(error.message || 'An error occurred during checkout');
            } finally {
                setCheckoutLoading(false);
            }
            };
        
            // Complete transaction
            const completeTransaction = async () => {
            if (!transactionId) {
                setCheckoutError('Transaction ID not found');
                return;
            }
            
            setCheckoutLoading(true);
            setCheckoutError('');
            
            try {
                // Finalize the transaction with tip amount
                const finalizeResponse = await fetch(`${API_URL}/dashboard/end/transaction`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    transaction_id: transactionId,
                    tip_amount: parseFloat(tipAmount)
                }),
                });
                
                if (!finalizeResponse.ok) {
                throw new Error('Failed to finalize transaction');
                }
                
                // Show success message and reset checkout
                setCheckoutSuccess('Transaction completed successfully!');
                setCheckoutStep('complete');
                
                // Clear cart after short delay
                setTimeout(() => {
                setCart([]);
                setTipAmount(0);
                setTransactionId(null);
                setCheckoutStep('items');
                setCheckoutSuccess('');
                }, 3000);
                
            } catch (error) {
                console.error('Finalize transaction error:', error);
                setCheckoutError(error.message || 'An error occurred while finalizing the transaction');
            } finally {
                setCheckoutLoading(false);
            }
            };
        
            // Cancel transaction
            const cancelTransaction = () => {
            setCheckoutStep('items');
            setCart([]);
            setTipAmount(0);
            setTransactionId(null);
            setCheckoutError('');
            setCheckoutSuccess('');
            };
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
            if (loading) {
                return <div className="loading">Loading...</div>;
            }
        
            if (error) {
                return <div className="error-container">{error}</div>;
            }
    
    return (
        <div className="admin-section">
                        <div className="section-header">
                        <h2>Checkout</h2>
                        <button className="back-btn" onClick={handleBackToDashboard}>Back to Dashboard</button>
                        </div>
                        
                        <div className="checkout-container">
                        {checkoutStep === 'items' && (
                            <>
                            {/* Order Configuration Section - NEW */}
                            <div className="order-config-section">
                                <h3>Order Configuration</h3>
                                <div className="order-config-form">
                                <div className="form-group">
                                    <label htmlFor="order-type">Order Type</label>
                                    <select
                                    id="order-type"
                                    value={orderType}
                                    onChange={(e) => setOrderType(e.target.value)}
                                    >
                                    <option value="Dine-In">Dine-In</option>
                                    <option value="Takeout">Takeout</option>
                                    <option value="Delivery">Delivery</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="payment-method">Payment Method</label>
                                    <select 
                                    id="payment-method"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    >
                                    <option value="Cash">Cash</option>
                                    <option value="Card">Card</option>
                                    <option value="Digital Wallet">Digital Wallet</option>
                                    </select>
                                </div>
                                
                                {/* Card information fields - only show when Card is selected */}
                                {paymentMethod === 'Card' && (
                                    <div className="card-info-container">
                                    <h4>Card Information</h4>
                                    <div className="form-group">
                                        <label htmlFor="card-number">Card Number</label>
                                        <input
                                        type="text"
                                        id="card-number"
                                        placeholder="**** **** **** ****"
                                        maxLength="19"
                                        />
                                    </div>
                                    <div className="card-details-row">
                                        <div className="form-group half-width">
                                        <label htmlFor="card-expiry">Expiry Date</label>
                                        <input
                                            type="text"
                                            id="card-expiry"
                                            placeholder="MM/YY"
                                            maxLength="5"
                                        />
                                        </div>
                                        <div className="form-group half-width">
                                        <label htmlFor="card-cvv">CVV</label>
                                        <input
                                            type="text"
                                            id="card-cvv"
                                            placeholder="***"
                                            maxLength="3"
                                        />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="card-name">Name on Card</label>
                                        <input
                                        type="text"
                                        id="card-name"
                                        placeholder="Cardholder Name"
                                        />
                                    </div>
                                    </div>
                                )}
                                </div>
                            </div>
                            
                            {/* Item Selection Section - Modified (removed order type and payment method) */}
                            <div className="checkout-form">
                                <h3>Add Items to Order</h3>
                                
                                <div className="form-group">
                                <label htmlFor="item-select">Select Item</label>
                                <select 
                                    id="item-select"
                                    value={selectedItem}
                                    onChange={(e) => setSelectedItem(e.target.value)}
                                >
                                    <option value="">-- Select an item --</option>
                                    {inventory.map((item, index) => (
                                    <option key={index} value={item.dessert}>
                                        {item.dessert} - ${item.price.toFixed(2)}
                                    </option>
                                    ))}
                                </select>
                                </div>
                                
                                <div className="form-group">
                                <label htmlFor="quantity">Quantity</label>
                                <input 
                                    type="number" 
                                    id="quantity"
                                    min="1"
                                    value={itemQuantity}
                                    onChange={(e) => setItemQuantity(e.target.value)}
                                />
                                </div>
                                
                                <button 
                                className="add-to-cart-btn" 
                                onClick={handleAddToCart}
                                >
                                Add to Cart
                                </button>
                                
                                {checkoutError && <div className="form-error">{checkoutError}</div>}
                            </div>
                            
                            {/* Cart Container - Updated to show tax and total more clearly */}
                            <div className="cart-container">
                                <h3>Current Order</h3>
                                
                                {cart.length === 0 ? (
                                <p>No items in cart</p>
                                ) : (
                                <>
                                    <table className="cart-table">
                                    <thead>
                                        <tr>
                                        <th>Item</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                        <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cart.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>${item.price.toFixed(2)}</td>
                                            <td>{item.quantity}</td>
                                            <td>${(item.price * item.quantity).toFixed(2)}</td>
                                            <td>
                                            <button 
                                                className="remove-item-btn"
                                                onClick={() => handleRemoveFromCart(index)}
                                            >
                                                Remove
                                            </button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                        <td colSpan="3" className="subtotal-label">Subtotal:</td>
                                        <td colSpan="2" className="subtotal-value">${calculateSubtotal().toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                        <td colSpan="3" className="subtotal-label">Tax (8.25%):</td>
                                        <td colSpan="2" className="subtotal-value">${calculateTax().toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                        <td colSpan="3" className="total-label"><strong>Total:</strong></td>
                                        <td colSpan="2" className="total-value"><strong>${calculateTotal().toFixed(2)}</strong></td>
                                        </tr>
                                    </tfoot>
                                    </table>
                                    
                                    <div className="checkout-actions">
                                    <button 
                                        className="clear-cart-btn"
                                        onClick={() => setCart([])}
                                    >
                                        Clear Cart
                                    </button>
                                    <button 
                                        className="checkout-btn"
                                        onClick={startCheckout}
                                        disabled={checkoutLoading}
                                    >
                                        {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                                    </button>
                                    </div>
                                </>
                                )}
                            </div>
                            </>
                        )}
                        
                        {/* Review step - updated to display order type and payment method */}
                        {checkoutStep === 'review' && (
                            <div className="checkout-review">
                            <h3>Review Order</h3>
                            
                            <div className="order-summary">
                                <h4>Order Summary</h4>
                                <table className="review-table">
                                <thead>
                                    <tr>
                                    <th>Item</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                    <td colSpan="3" className="total-label">Subtotal:</td>
                                    <td className="total-value">${calculateSubtotal().toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                    <td colSpan="3" className="total-label">Tax (8.25%):</td>
                                    <td className="total-value">${calculateTax().toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                    <td colSpan="3" className="total-label"><strong>Total:</strong></td>
                                    <td className="total-value"><strong>${calculateTotal().toFixed(2)}</strong></td>
                                    </tr>
                                </tfoot>
                                </table>
                            </div>

                            <div className="tip-section">
                                <h4>Add Tip</h4>
                                <div className="form-group">
                                <label htmlFor="tip-amount">Tip Amount ($)</label>
                                <input 
                                    type="number" 
                                    id="tip-amount"
                                    min="0"
                                    step="0.01"
                                    value={tipAmount}
                                    onChange={(e) => setTipAmount(e.target.value)}
                                />
                                </div>
                                
                                <div className="tip-buttons">
                                <button onClick={() => setTipAmount((calculateTotal() * 0.15).toFixed(2))}>15%</button>
                                <button onClick={() => setTipAmount((calculateTotal() * 0.18).toFixed(2))}>18%</button>
                                <button onClick={() => setTipAmount((calculateTotal() * 0.20).toFixed(2))}>20%</button>
                                <button onClick={() => setTipAmount((calculateTotal() * 0.25).toFixed(2))}>25%</button>
                                </div>
                                
                                <div className="total-with-tip">
                                <p><strong>Total with Tip:</strong> ${(calculateTotal() + parseFloat(tipAmount || 0)).toFixed(2)}</p>
                                </div>
                            </div>
                            
                            <div className="payment-info">
                                <h4>Order Information</h4>
                                <p><strong>Order Type:</strong> {orderType}</p>
                                <p><strong>Payment Method:</strong> {paymentMethod}</p>
                                <p><strong>Transaction ID:</strong> {transactionId}</p>
                            </div>
                            
                            {checkoutError && <div className="form-error">{checkoutError}</div>}
                            
                            <div className="checkout-actions">
                                <button 
                                className="cancel-btn"
                                onClick={cancelTransaction}
                                disabled={checkoutLoading}
                                >
                                Cancel Order
                                </button>
                                <button 
                                className="submit-btn"
                                onClick={completeTransaction}
                                disabled={checkoutLoading}
                                >
                                {checkoutLoading ? 'Processing...' : 'Complete Transaction'}
                                </button>
                            </div>
                            </div>
                        )}
                        
                        {checkoutStep === 'complete' && (
                            <div className="checkout-complete">
                            <div className="success-message">
                                <h3>Transaction Complete</h3>
                                {checkoutSuccess && <div className="form-success">{checkoutSuccess}</div>}
                                <p>Transaction ID: {transactionId}</p>
                                <p>Total Amount: ${(calculateTotal() + parseFloat(tipAmount || 0)).toFixed(2)}</p>
                                <button 
                                className="new-order-btn"
                                onClick={() => {
                                    setCart([]);
                                    setTipAmount(0);
                                    setTransactionId(null);
                                    setCheckoutStep('items');
                                }}
                                >
                                Start New Order
                                </button>
                            </div>
                            </div>
                        )}
                        </div>
                    </div>
    );



};
export default Transactions;