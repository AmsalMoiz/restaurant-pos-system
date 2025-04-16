import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashCook.css";

function DashCook() {
    const [cookData, setCookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date
    const [hoursWorked, setHoursWorked] = useState("");
    const navigate = useNavigate();
    const timeoutId = useRef(null); 

    const displayMessage = (newMessage, newMessageType, duration = 2500) => {
        // clear existing timeout, so msg time is consistent, 
        // this is so if someone is spamming buttons, triggering different messages
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }
    };

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem("user");

        if (!userData) {
            setError("Not logged in");
            navigate("/users/login");
            return;
        }

        try {
            const user = JSON.parse(userData);

            // Check if user has Cook role
            if (user.role !== "Cook") {
                setError("Unauthorized access");
                navigate("/users/login");
                return;
            }

            setCookData(user);
        } catch (err) {
            console.error("Error loading cook data:", err);
            setError("Error loading Cook data");
        } finally {
            setLoading(false); // Ensure loading is set to false in all cases
        }
    }, [navigate]);

    const handleLogout = () => {
        if (cookData) {
            localStorage.removeItem(`isClockedIn_${cookData.email}`); // Clear clock-in status for this user
        }
        localStorage.removeItem("user"); // Remove user data
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
                    user_id: cookData.user_id,
                    date_worked: date,
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
        <div className="cook-dashboard-body">
            <div className="cook-dashboard">
                <header className="cook-header">
                    <h1>Cook Dashboard</h1>
                    <div className="cook-info">
                        <p>
                            Welcome, <span className="cook-name">{cookData.name}</span>
                        </p>
                        <p className="cook-role">Title: {cookData.role}</p>
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
                </main>
            </div>
        </div>
    );
}

export default DashCook;