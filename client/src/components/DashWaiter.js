import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashWaiter.css";

function DashWaiter() {
    const [waiterData, setWaiterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");

        if (!userData) {
            setError("Not logged in");
            navigate("/users/login");
            return;
        }

        try {
            const user = JSON.parse(userData);

            if (user.role !== "Waiter") {
                setError("Unauthorized access");
                navigate("/users/login");
                return;
            }

            setWaiterData(user);
        } catch (err) {
            console.error("Error loading waiter data:", err);
            setError("Error loading waiter data");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/users/login");
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="waiter-dashboard-body">
            <div className="waiter-dashboard">
                <header className="waiter-header">
                    <h1>Waiter Dashboard</h1>
                    <div className="waiter-info">
                        <p>
                            Welcome, <span className="waiter-name">{waiterData.name}</span>
                        </p>
                        <p className="waiter-role">Title: {waiterData.role}</p>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="waiter-content">
                    <div className="waiter-section">
                        <h2>Actions</h2>
                        <div className="waiter-buttons">
                            <button className="waiter-btn">Make Transaction</button>
                            <button
                                className="waiter-btn"
                                onClick={() => navigate("/log-hours")}
                            >
                                Log Hours
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashWaiter;
