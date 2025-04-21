import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SupplierReport.css";

const API_BASE = process.env.REACT_APP_API_BASE || '';

function SupplierReportPage() {
    const [view, setView] = useState("all_suppliers");
    const [supplierData, setSupplierData] = useState([]);
    const [user, setUser] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortField, setSortField] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));



        const fetchData = async () => {
            try {
                const params = new URLSearchParams({
                    view,
                    startDate,
                    endDate,
                    sortField,
                    sortOrder
                });
                const response = await fetch(`${API_BASE}/api/supplier-report?${params.toString()}`);
                const data = await response.json();
                setSupplierData(data);
            } catch (err) {
                console.error("Error fetching supplier report:", err);
            }
        };
        fetchData();
    }, [view, startDate, endDate, sortField, sortOrder]);

    // const handleLogout = () => {
    //     localStorage.removeItem("user");
    //     window.location.href = "/users/login";
    // };

    const getSortOptions = () => {
        return view === "all_suppliers"
            ? ["supplier_name", "total_orders", "total_items", "total_spent", "last_order_date"]
            : ["order_date", "supplier_name", "items_ordered", "amount_spent"];
    };

    return (
        <div className="admin-dashboard-body">
            <div className="admin-dashboard">
                <header className="admin-header">
                    <h1>Suppliers Report</h1>
                    <div className="admin-info">
                        <p>
                            Welcome, <span className="admin-name">{user?.name || "User"}</span>
                        </p>
                        <p className="admin-role">Role: {user?.role || "Unknown"}</p>
                        <button onClick={() => navigate(-1)} className="logout-btn">
                            Back
                        </button>
                    </div>
                </header>

                <main className="admin-content">
                    <div className="filter-sort-bar">
                        <div className="date-range" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <label>Start Date:</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ width: '480px' }}
                            />
                            <label>End Date:</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ width: '480px' }}
                            />
                        </div>

                        <div className="view-sort-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
                            <label htmlFor="view">View:</label>
                            <select
                                id="view"
                                value={view}
                                onChange={(e) => setView(e.target.value)}
                                style={{ width: '320px' }}
                            >
                                <option value="all_suppliers">All Suppliers</option>
                                <option value="all_orders">All Orders</option>
                            </select>

                            <label htmlFor="sortField">Sort by:</label>
                            <select
                                id="sortField"
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                                style={{ width: '320px' }}
                            >
                                <option value="">None</option>
                                {getSortOptions().map((field) => (
                                    <option key={field} value={field}>
                                        {field.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="sortOrder">Order:</label>
                            <select
                                id="sortOrder"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                style={{ width: '320px' }}
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>


                    {view === "all_suppliers" ? (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Supplier Name</th>
                                    <th>Total Orders</th>
                                    <th>Total Items Ordered</th>
                                    <th>Total Spending</th>
                                    <th>Last Order Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplierData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{row.supplier_name}</td>
                                        <td>{row.total_orders}</td>
                                        <td>{row.total_items}</td>
                                        <td>${Number(row.total_spent).toFixed(2)}</td>
                                        <td>{new Date(row.last_order_date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Order Date</th>
                                    <th>Supplier Name</th>
                                    <th>Number of Items</th>
                                    <th>Amount Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {supplierData.map((row, idx) => (
                                    <tr key={idx}>
                                        <td>{new Date(row.order_date).toLocaleDateString()}</td>
                                        <td>{row.supplier_name}</td>
                                        <td>{row.items_ordered}</td>
                                        <td>${Number(row.amount_spent).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
        </div>
    );
}

export default SupplierReportPage;
