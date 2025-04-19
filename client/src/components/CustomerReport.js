import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerReport.css";

const API_BASE = process.env.REACT_APP_API_BASE || '';

function CustomerReportPage() {
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [filter, setFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // Initially false
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check user role on page load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || (storedUser.role !== "Admin" && storedUser.role !== "Manager")) {
            navigate("/users/login");
        } else {
            setUser(storedUser);
        }
    }, [navigate]);
    
    // Fetch filtered report when Generate button is clicked
    const fetchFilteredReport = async () => {
        try {
            setLoading(true); // Start loading state
            const queryParams = new URLSearchParams({
                filter,
                ...(startDate && { start: startDate }),
                ...(endDate && { end: endDate }),
                sortField,
                sortOrder,
            });

            const res = await fetch(`${API_BASE}/api/customer-report?${queryParams.toString()}`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to fetch filtered report.");
            }

            setFilteredCustomers(data);
            setError("");
        } catch (err) {
            console.error(err);
            setError(err.message || "Error fetching filtered report.");
        } finally {
            setLoading(false); // End loading state
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/users/login");
    };

    const handleGenerateClick = () => {
        fetchFilteredReport(); // Trigger data fetch on button click
    };

    return (
        <div className="admin-dashboard-body">
            <div className="admin-dashboard">
                <header className="admin-header">
                    <h1>Customer Report</h1>
                    <div className="admin-info">
                        <p>
                            Welcome, <span className="admin-name">{user?.name || "User"}</span>
                        </p>
                        <p className="admin-role">Role: {user?.role || "Unknown"}</p>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="admin-content">
                    <div className="filter-section">
                        <div className="filter-header">
                            <div></div>
                            <h2>Filter Report</h2>
                            <button onClick={() => navigate(-1)} className="back-btn">
                                Back
                            </button>
                        </div>

                        <div className="filter-inputs">
                            {/* Start Date */}
                            <div className="input-group">
                                <label className="dropdown-label">From:</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="date-picker"
                                />
                            </div>

                            {/* End Date */}
                            <div className="input-group">
                                <label className="dropdown-label">To:</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="date-picker"
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="input-group">
                                <label className="dropdown-label">Filter by</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)} // No API request triggered here
                                    className="filter-dropdown"
                                >
                                    <option value="all">All</option>
                                    <option value="reservations">Reservations</option>
                                    <option value="total_spent">Total Spent</option>
                                </select>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="input-group">
                                <label className="dropdown-label">Sort by</label>
                                <select
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)} // No API request triggered here
                                    className="sort-dropdown"
                                >
                                    <option value="name">Last Name</option>
                                    <option value="reservations">Reservations</option>
                                    <option value="transactions">Transactions</option>
                                    <option value="total_spent">Total Spent</option>
                                </select>
                            </div>

                            {/* Sort Order Dropdown */}
                            <div className="input-group">
                                <label className="dropdown-label">Order</label>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)} // No API request triggered here
                                    className="sort-order-dropdown"
                                >
                                    <option value="asc">Ascending</option>
                                    <option value="desc">Descending</option>
                                </select>
                            </div>

                            {/* Generate Button */}
                            <div className="input-group">
                                <label className="dropdown-label invisible">.</label>
                                <button onClick={handleGenerateClick} className="generate-btn">
                                    Generate
                                </button>
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : error ? (
                        <div className="error-container">{error}</div>
                    ) : (
                        <div className="report-table-container">
                            <table className="report-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        {filter === "reservations" || filter === "all" ? (
                                            <th>Reservations</th>
                                        ) : null}
                                        {filter === "total_spent" || filter === "all" ? (
                                            <>
                                                <th>Transactions</th>
                                                <th>Total Spent ($)</th>
                                            </>
                                        ) : null}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.customer_id}>
                                            <td>{customer.name}</td>
                                            <td>{customer.phone_number}</td>
                                            <td>{customer.email}</td>
                                            {filter === "reservations" || filter === "all" ? (
                                                <td>{customer.reservations || 0}</td>
                                            ) : null}
                                            {filter === "total_spent" || filter === "all" ? (
                                                <>
                                                    <td>{customer.transactions || 0}</td>
                                                    <td>
                                                        {(parseFloat(customer.total_spent) || 0).toFixed(2)}
                                                    </td>
                                                </>
                                            ) : null}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default CustomerReportPage;
