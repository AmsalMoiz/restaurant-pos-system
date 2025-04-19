import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashCook.css"; // Reuse same styling for consistency

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:3001';

function LogHoursPage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [hoursWorked, setHoursWorked] = useState("");
    const navigate = useNavigate();
    const timeoutId = useRef(null);

    const displayMessage = (newMessage, newMessageType, duration = 2500) => {
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
        // Handle toast message here if implemented
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");

        if (!userData) {
            setError("Not logged in");
            navigate("/users/login");
            return;
        }

        try {
            const user = JSON.parse(userData);

            if (!["Cook", "Waiter"].includes(user.role)) {
                setError("Unauthorized access");
                navigate("/users/login");
                return;
            }

            setUserData(user);
        } catch (err) {
            console.error("Error loading user data:", err);
            setError("Error loading user data");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        if (userData) {
            localStorage.removeItem(`isClockedIn_${userData.email}`);
        }
        localStorage.removeItem("user");
        navigate("/users/login");
    };

    const handleLogHours = async () => {
        if (!hoursWorked || isNaN(hoursWorked) || hoursWorked <= 0) {
            alert("Please enter a valid number of hours worked.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/log-hours`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: userData.user_id,
                    date_worked: date,
                    hours_worked: hoursWorked,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Log hours failed:", data);
                alert(data.message || "Failed to log hours.");
                return;
            }

            alert(data.message || "Hours logged successfully!");
            setHoursWorked("");
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
        <div className="cook-dashboard-body">
            <div className="cook-dashboard">
                <header className="cook-header">
                    <h1>Log Hours</h1>
                    <div className="cook-info">
                        <p>
                            Welcome, <span className="cook-name">{userData.name}</span>
                        </p>
                        <p className="cook-role">Title: {userData.role}</p>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </header>

                <main className="cook-content">
                    <div className="cook-section">
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
                    {/* Back Button */}
                    <button onClick={() => navigate(-1)} className="back-btn">
                        Back
                    </button>
                </main>
            </div>
        </div>
    );
}

export default LogHoursPage;
