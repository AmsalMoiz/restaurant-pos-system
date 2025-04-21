import React, { useState, useEffect } from 'react';
import './ItemSalesReport.css';
import { useNavigate } from 'react-router-dom';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

/*
dev notes:
- cleaned up code, removed comments and test prints, not used variables, no warnings or errors etc.
- keep in clean state
- The report is generated based on the selected filters and date range.
- The report data is fetched from the server and displayed in a table format.
- The user can switch between list view and chart view.(chart view is a placeholder for now)
- The user can filter the report data based on various criteria.
- The user can select multiple items for the report but the selected items are not a "must contain all items" search.
- ie. if you select "item1" and "item2", the report will show all transactions that contain either "item1" or "item2".
- not necessarily only both.
- above can be changed to "must contain all items" in future, gonna probably not do this
- chart mode needs to be implemented
- option to download as CSV or PDF?
*/

const ItemSalesReport = () => {
  const navigate = useNavigate();
  const handleBackToDashboard = () => {
    navigate('/admin-dashboard');
  };

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // const headerMapping = {
  //   //add mappings to rename headers
  //   transaction_id: 'Transaction ID',
  //   created_at: 'Creation Date & Time',
  //   subtotal: 'Subtotal',
  //   sales_tax: 'Sales Tax',
  //   total_amount: 'Total Amount',
  //   payment_method: 'Payment Method',
  //   status: 'Status',
  //   order_type: 'Order Type',
  //   tip_amount: 'Tip Amount',
  //   item_names: 'Items',
  //   customer_name: 'Customer Name',
  //   discount_code: 'Discount Code',
  // };


  const [transactionFilters, setTransactionFilters] = useState({
    minAmount: '',
    maxAmount: '',
    paymentMethod: '',
    status: '',
    orderType: '',
    // Add more transaction filters 
  });

  const [customerFilters, setCustomerFilters] = useState({
    customerName: '',
    // Add more customer filters
  });

  const [discountFilters, setDiscountFilters] = useState({
    discountName: '',
    // Add more discount filters
  });

  const handleFilterChange = (category, field, value) => {
    switch (category) {
      case 'transactions':
        setTransactionFilters({ ...transactionFilters, [field]: value });
        break;
      case 'customers':
        setCustomerFilters({ ...customerFilters, [field]: value });
        break;
      case 'discounts':
        setDiscountFilters({ ...discountFilters, [field]: value });
        break;
      default:
        break;
    }
  };

  //const [filteredReportData, setFilteredReportData] = useState([]);
  const [detailedListReportData, setDetailedListReportData] = useState([]);
  const [viewMode, setViewMode] = useState('list');

  const [paymentMethodsOptions, setPaymentMethodsOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [orderTypeOptions, setOrderTypeOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async (endpoint, setter) => {
      try {
        const response = await fetch(`${API_BASE}/api/sales-report/${endpoint}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
      }
    };

    fetchOptions('transactions/payment-methods', setPaymentMethodsOptions);
    fetchOptions('transactions/statuses', setStatusOptions);
    fetchOptions('transactions/order-types', setOrderTypeOptions);
  }, []);


  // Fetch item names for autocomplete suggestions
  const [selectedItems, setSelectedItems] = useState([]);
  const [itemNameInput, setItemNameInput] = useState('');
  const [itemSuggestions, setItemSuggestions] = useState([]); // Suggestions for item names
  const [showItemSuggestions, setShowItemSuggestions] = useState(false);
  const [allItemNames, setAllItemNames] = useState([]);

  useEffect(() => {
    const fetchItemNames = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/sales-report/items/names`); // Adjust the path if needed
        if (!response.ok) {
          console.error('Error fetching item names:', response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAllItemNames(data);
      } catch (error) {
        console.error('Error fetching item names:', error);
        // set an error state to display a message...if time
      }
    };

    fetchItemNames();
  }, []);

  const handleItemNameInputChange = (event) => {
    const value = event?.target?.value;
    setItemNameInput(value);
    if (value && value.length > 0) {
      const filteredSuggestions = allItemNames.filter(name =>
        name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedItems.map(item => item.toLowerCase()).includes(name.toLowerCase()) // Don't show already selected items
      );
      setItemSuggestions(filteredSuggestions);
      setShowItemSuggestions(filteredSuggestions.length > 0);
    } else {
      setItemSuggestions([]);
      setShowItemSuggestions(false);
    }
  };

  const handleAddItem = (itemName) => {
    if (!selectedItems.map(item => item.toLowerCase()).includes(itemName.toLowerCase())) {
      setSelectedItems([...selectedItems, itemName]);
    }
    setItemNameInput('');
    setItemSuggestions([]);
    setShowItemSuggestions(false);
  };

  const handleRemoveItem = (itemNameToRemove) => {
    setSelectedItems(selectedItems.filter(item => item !== itemNameToRemove));
  };

  const handleDateChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') setStartDate(value);
    if (name === 'endDate') setEndDate(value);
  };

  // Chart code:
  const [chartData, setChartData] = useState(null);

  const processChartData = (data) => {
    if (!data || data.length === 0) {
      return null;
    }

    const labels = data.map(item => item.item_name);
    const salesValues = data.map(item => parseFloat(item.total_sales));
    // Create the chart data object
    const chart = {
      labels,
      datasets: [
        {
          label: 'Total Sales per Item',
          backgroundColor: 'rgba(75,192,192,0.6)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          data: salesValues,
        },
      ],
    };
    return chart;
  };

  // generateReport function to fetch the report data
  const generateReport = async () => {
    try {
      const responseFullList = await fetch(`${API_BASE}/api/sales-report/api/generate-sales-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ startDate, endDate, transactionFilters, customerFilters, discountFilters, selectedItems }),
      });
      if (!responseFullList.ok) {
        throw new Error(`HTTP error! status: ${responseFullList.status}`);
      }
      const fullListData = await responseFullList.json();
      //setFilteredReportData(fullListData);

      // step 2
      const transactionIds = fullListData.map(transaction => transaction.transaction_id);

      const responseDetailedList = await fetch(`${API_BASE}/api/sales-report/api/generate-sales-report/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionIds, selectedItems }),
      });

      if (!responseDetailedList.ok) throw new Error(`HTTP error! status: ${responseDetailedList.status}`);

      const detailedListData = await responseDetailedList.json();
      setDetailedListReportData(detailedListData);

      //chart data
      const responseChartData = await fetch(`${API_BASE}/api/sales-report/api/generate-sales-report/chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionIds, selectedItems }),
      });

      if (!responseChartData.ok) throw new Error(`HTTP error! status: ${responseChartData.status}`);

      const chartData = await responseChartData.json();
      setChartData(processChartData(chartData));

    } catch (error) {
      console.error('Error generating report:', error);
      //setFilteredReportData([]);
      setDetailedListReportData([]);
      setChartData(null);
    }
    setViewMode('list'); // Default to list view after generation
  };

  const switchViewMode = (mode) => {
    setViewMode(mode);
  };

  return (
    <div className="admin-section">
      <header className="section-header">
        <h1>Items Sales Reports</h1>
        <button className="t-back-btn" onClick={handleBackToDashboard}>Back to Dashboard</button>
      </header>
      
      <div className="filters-container">
        {/* Transaction Filters */}
        <div className="filter-card">
          <h4 className="filter-title">Transactions</h4>
          <div className="filter-fields">
            <div className="filter-field">
              <label>Start Date:</label>
              <input type="date" name="startDate" value={startDate} onChange={handleDateChange} />
            </div>
            <div className="filter-field">
              <label>End Date:</label>
              <input type="date" name="endDate" value={endDate} onChange={handleDateChange} />
            </div>
            <div className="filter-field">
              <label>Min Amount:</label>
              <input 
                type="number" 
                name="minAmount" 
                value={transactionFilters.minAmount} 
                onChange={(e) => handleFilterChange('transactions', 'minAmount', e.target.value)} 
                placeholder="Min" 
              />
            </div>
            <div className="filter-field">
              <label>Max Amount:</label>
              <input 
                type="number" 
                name="maxAmount" 
                value={transactionFilters.maxAmount} 
                onChange={(e) => handleFilterChange('transactions', 'maxAmount', e.target.value)} 
                placeholder="Max" 
              />
            </div>
            <div className="filter-field">
              <label>Payment Method:</label>
              <select
                name="paymentMethod"
                value={transactionFilters.paymentMethod}
                onChange={(e) => handleFilterChange('transactions', 'paymentMethod', e.target.value)}
              >
                <option value="">--Select Payment Method--</option>
                {paymentMethodsOptions.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Status:</label>
              <select
                name="status"
                value={transactionFilters.status}
                onChange={(e) => handleFilterChange('transactions', 'status', e.target.value)}
              >
                <option value="">-- Select Status --</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="filter-field">
              <label>Order Type:</label>
              <select
                name="orderType"
                value={transactionFilters.orderType}
                onChange={(e) => handleFilterChange('transactions', 'orderType', e.target.value)}
              >
                <option value="">-- Select Order Type --</option>
                {orderTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
  
        {/* Items Filters */}
        <div className="filter-card">
          <h4 className="filter-title">Items</h4>
          <div className="filter-fields">
            <div className="filter-field autocomplete-container">
              <label>Item Name:</label>
              <input
                type="text"
                name="name"
                value={itemNameInput}
                onChange={handleItemNameInputChange}
                placeholder="e.g., Nuage au Caramel"
                onFocus={() => setShowItemSuggestions(itemSuggestions.length > 0 && itemNameInput.length > 0)}
                onBlur={() => setTimeout(() => setShowItemSuggestions(false), 200)}
                className="input-full-width"
              />
              {showItemSuggestions && (
                <ul className="suggestions-list">
                  {itemSuggestions.map((suggestion) => (
                    <li key={suggestion} onClick={() => handleAddItem(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedItems.length > 0 && (
              <div className="selected-items-container">
                {selectedItems.map((item) => (
                  <span key={item} className="selected-item-pill">
                    {item}
                    <button type="button" className="item-select-remove-item-btn" onClick={() => handleRemoveItem(item)}>
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
  
        {/* Customers Filters */}
        <div className="filter-card">
          <h4 className="filter-title">Customers</h4>
          <div className="filter-fields">
            <div className="filter-field">
              <label>Customer Name:</label>
              <input 
                type="text" 
                name="customerName" 
                value={customerFilters.customerName} 
                onChange={(e) => handleFilterChange('customers', 'customerName', e.target.value)} 
                placeholder="e.g., John Doe"
                className="input-full-width" 
              />
            </div>
          </div>
        </div>
  
        {/* Discounts Filters */}
        <div className="filter-card">
          <h4 className="filter-title">Discounts</h4>
          <div className="filter-fields">
            <div className="filter-field">
              <label>Discount Code:</label>
              <input 
                type="text" 
                name="discountName" 
                value={discountFilters.discountName} 
                onChange={(e) => handleFilterChange('discounts', 'discountName', e.target.value)} 
                placeholder="e.g., Summer Sale" 
                className='input-full-width'
              />
            </div>
          </div>
        </div>
      </div>

      <div className="report-controls">
      <button onClick={generateReport} className="generate-report-btn">Generate Report</button>
      
      <div className="view-mode-buttons">
        <button onClick={() => switchViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>List View</button>
        <button onClick={() => switchViewMode('chart')} className={viewMode === 'chart' ? 'active' : ''}>Chart View</button>
      </div>
    </div>
    
    {viewMode === 'list' && (
      <>
        <div className="report-view">
          <h3>Detailed Items Sold Report (List View)</h3>
          {detailedListReportData.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Item Name</th>
                    <th>Quantity Purchased</th> {/* did headers manually no mapping here */}
                    <th>Subtotal</th>
                    <th>Discount Code</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedListReportData.map((row, index) => (
                    <tr key={index}>
                      {Object.keys(row).map((key, innerIndex) => (
                        <td key={innerIndex}>
                          {key === 'item_names' ? row[key] : row[key]} {/* should display multiple item names separated */}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No data available for the detailed list.</p>
          )}
        </div>
      </>
    )}
    {viewMode === 'chart' && (
      <div className="report-view chart-container">
        <h3>Total Sales per Item (Chart View)</h3>
        {chartData ? (
          <Bar data={chartData} />
        ) : (
          <p>No data available for the chart</p>
        )}
      </div>
    )}
    </div>
  );
};

export default ItemSalesReport;