import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './CustomerPages.css';
import LoginPage from './components/LoginPage';
import CustomerAuth from './components/CustomerAuth';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import apiService from './components/apiService';
function App() {
  const [cartItems, setCartItems] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  // Load cart and auth state from localStorage when the component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    
    // Check if customer is logged in
    const customerData = localStorage.getItem('customer');
    if (customerData) {
      setCustomer(JSON.parse(customerData));
    }
    
    // Check if employee is logged in
    const isEmpLoggedIn = localStorage.getItem('employeeLoggedIn') === 'true';
    setIsEmployeeLoggedIn(isEmpLoggedIn);
    
    // Fetch menu items
    fetchMenuItems();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchMenuItems = async () => {
    try {
      const items = await apiService.getMenuItems();
      setMenuItems(items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleCustomerLogin = (customerData) => {
    setCustomer(customerData);
    localStorage.setItem('customer', JSON.stringify(customerData));
  };

  const handleEmployeeLogin = () => {
    setIsEmployeeLoggedIn(true);
    localStorage.setItem('employeeLoggedIn', 'true');
  };

  const handleLogout = () => {
    setCustomer(null);
    setIsEmployeeLoggedIn(false);
    localStorage.removeItem('customer');
    localStorage.removeItem('employeeLoggedIn');
  };

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevItems.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const placeOrder = (orderData) => {
    setCurrentOrder(orderData);
    // Clear the cart after successful order
    setCartItems([]);
  };

  const returnToMenu = () => {
    setCurrentOrder(null);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Router>
      <div className="app">
        <Navbar 
          cartItems={cartItems} 
          isLoggedIn={customer !== null} 
          handleLogout={handleLogout} 
        />
        
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Customer routes */}
          <Route path="/auth" element={
            customer 
              ? <Navigate to="/menu" /> 
              : <CustomerAuth onLogin={handleCustomerLogin} />
          } />
          
          <Route path="/menu" element={<Menu addToCart={addToCart} />} />
          
          <Route path="/cart" element={
            <Cart 
              cartItems={cartItems} 
              updateQuantity={updateQuantity} 
              removeFromCart={removeFromCart} 
              proceedToCheckout={() => {}} 
            />
          } />
          
          <Route path="/checkout" element={
            cartItems.length === 0 
              ? <Navigate to="/cart" /> 
              : <Checkout 
                  cartItems={cartItems} 
                  total={calculateTotal()} 
                  placeOrder={placeOrder} 
                  goBack={() => window.history.back()} 
                />
          } />
          
          <Route path="/order-confirmation" element={
            currentOrder 
              ? <OrderConfirmation order={currentOrder} returnToMenu={returnToMenu} /> 
              : <Navigate to="/" />
          } />
          
          <Route path="/orders" element={<OrderHistory />} />
          
          {/* Employee routes */}
          <Route path="/employee-login" element={
            isEmployeeLoggedIn 
              ? <Navigate to="/employee-dashboard" /> 
              : <LoginPage onLogin={handleEmployeeLogin} />
          } />
          
          <Route path="/employee-dashboard" element={
            isEmployeeLoggedIn 
              ? <div>Employee Dashboard (to be implemented)</div> 
              : <Navigate to="/employee-login" />
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;