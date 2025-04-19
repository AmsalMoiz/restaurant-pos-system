import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerReport.css";

function CustomerReportPage() {
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [filter, setFilter] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || storedUser.role !== "Admin") {
            navigate("/users/login");
        } else {
            setUser(storedUser);
            fetchFilteredReport();
        }
    }, [navigate, filter]);

    const fetchFilteredReport = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                filter,
                ...(startDate && { start: startDate }),
                ...(endDate && { end: endDate }),
                sortField,
                sortOrder,
            });

            const res = await fetch(`http://localhost:3001/api/customer-report?${queryParams.toString()}`);
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
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/users/login");
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
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="date-picker"
                            />

                            {/* End Date */}
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="date-picker"
                            />

                            {/* Filter Label + Dropdown */}
                            <div className="input-group">
                                <label className="dropdown-label">Filter by</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="filter-dropdown"
                                >
                                    <option value="all">All</option>
                                    <option value="reservations">Reservations</option>
                                    <option value="total_spent">Total Spent</option>
                                </select>
                            </div>

                            {/* Sort Label + Dropdown */}
                            <div className="input-group">
                                <label className="dropdown-label">Sort by</label>
                                <select
                                    value={sortField}
                                    onChange={(e) => setSortField(e.target.value)}
                                    className="sort-dropdown"
                                >
                                    <option value="name">Last Name</option>
                                    <option value="reservations">Reservations</option>
                                    <option value="transactions">Transactions</option>
                                    <option value="total_spent">Total Spent</option>
                                </select>
                            </div>

                            {/* Asc/Desc Dropdown */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="sort-order-dropdown"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>

                            {/* Generate Button */}
                            <button onClick={fetchFilteredReport} className="generate-btn">
                                Generate
                            </button>
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
