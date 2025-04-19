import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import ScrollToTop from './components/ScrollToTop';
import Home from './components/Home';
import Login from './components/Login';
import Menu from './components/MenuTest';
import Cart from './components/Cart';
import UserLogin from './components/UserLogin';
import DashAdmin from './components/DashAdmin';
import DashManager from './components/DashManager';
import DashWaiter from './components/DashWaiter';
import DashCook from './components/DashCook';
import BookTable from './components/BookTable';
import Checkout from './components/Checkout';
import InventoryPage from './components/Inventory';
import EmployeesPage from './components/Employees';
import LogHoursPage from './components/LogHoursPage';
import ItemSalesReport from './components/ItemSalesReport';
import CustomerDashboard from './components/CustomerDashboard';
import Transactions from './components/Transactions';
import CustomerReport from './components/CustomerReport'; // Import the CustomerReport component
import Suppliers from './components/Suppliers';
import EmployeeSalesReports from './components/EmployeeSalesReports';
import ReorderAlerts from './components/ReorderAlerts';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const handleUserLogin = (userData) => {
    console.log('User logged in:', userData);
  };

  return (
    <Router>
      <ScrollToTop /> 

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route
          path="/menu"
          element={<Menu cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route
          path="/cart"
          element={<Cart cartItems={cartItems} setCartItems={setCartItems} />}
        />
        <Route
          path="/users/login"
          element={<UserLogin onLogin={handleUserLogin} />}
        />
        <Route path="/admin-dashboard" element={<DashAdmin />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports/items-sales" element={<ItemSalesReport />} />
        <Route path="/manager-dashboard" element={<DashManager />} />
        <Route path="/waiter-dashboard" element={<DashWaiter />} />
        <Route path="/cook-dashboard" element={<DashCook />} />
        <Route path="/log-hours" element={<LogHoursPage />} />
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/customer-report" element={<CustomerReport />} /> {/* Add the route for Customer Reports */}
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/reports/employee-sales" element={<EmployeeSalesReports />} />
        <Route path="/reorder_alerts" element={<ReorderAlerts />} />

        {/* catch all and redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
