import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashWaiter.css";

function DashWaiter() {
    const [waiterData, setWaiterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
    const [hoursWorked, setHoursWorked] = useState("");
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
            setLoading(false); // Ensure loading is set to false in all cases
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/users/login");
    };

    const handleLogHours = async () => {
        if (!hoursWorked || isNaN(hoursWorked) || hoursWorked <= 0) {
            alert("Please enter a valid number of hours worked.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/api/log-hours", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: waiterData.user_id,
                    date_worked : date,
                    hours_worked: hoursWorked,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Log hours failed with response:", data);
                alert(data.message || "Failed to log hours.");
                return;
            }

            alert(data.message || "Hours logged successfully!");
            setHoursWorked(""); // Reset hours worked input
        } catch (err) {
            console.error("Log hours failed:", err);
            alert("Failed to log hours.");
        }
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
                        </div>
                    </div>
                    <div className="waiter-section">
                        <h2>Log Hours Worked</h2>
                        <div className="log-hours-form">
                            <label htmlFor="date">Date:</label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />

                            <label htmlFor="hoursWorked">Hours Worked:</label>
                            <input
                                type="number"
                                id="hoursWorked"
                                value={hoursWorked}
                                onChange={(e) => setHoursWorked(e.target.value)}
                                placeholder="Enter hours worked"
                            />

                            <button onClick={handleLogHours} className="log-hours-btn">
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