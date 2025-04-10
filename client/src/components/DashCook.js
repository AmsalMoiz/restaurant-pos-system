import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashCook.css";

function DashCook() {
    const [cookData, setCookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isClockedIn, setIsClockedIn] = useState(false); // State to track clock-in status, not being used commented out
    const navigate = useNavigate();

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

            // Retrieve clock-in status from localStorage
            const savedClockStatus = localStorage.getItem(`isClockedIn_${user.email}`);
            setIsClockedIn(savedClockStatus === "true"); // Convert string to boolean

            setLoading(false);
        } catch (err) {
            console.error("Error loading cook data:", err);
            setError("Error loading Cook data");
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        if (cookData) {
            localStorage.removeItem(`isClockedIn_${cookData.email}`); // Clear clock-in status for this user
        }
        localStorage.removeItem("user"); // Remove user data
        navigate("/users/login");
    };

    const handleClockIn = () => {
        if (!cookData) {
            alert("User data not loaded. Please try again.");
            return;
        }

        setIsClockedIn(true); // Set clock-in status to true
        localStorage.setItem(`isClockedIn_${cookData.email}`, true); // Save to localStorage
        alert("You have clocked in.");
    };

    const handleClockOut = () => {
        if (!cookData) {
            alert("User data not loaded. Please try again.");
            return;
        }

        setIsClockedIn(false); // Set clock-in status to false
        localStorage.setItem(`isClockedIn_${cookData.email}`, false); // Save to localStorage
        alert("You have clocked out.");
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
                        <h2>Clock In/Clock Out</h2>
                        <div className="clock-buttons">
                            <button onClick={handleClockIn} className="clock-btn">
                                Clock In
                            </button>
                            <button onClick={handleClockOut} className="clock-btn">
                                Clock Out
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashCook;