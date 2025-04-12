import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DashCook.css";

function DashCook() {
    const [cookData, setCookData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isClockedIn, setIsClockedIn] = useState(false); // State to track clock-in status
    const navigate = useNavigate();
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('');
    const timeoutId = useRef(null); 

    const displayMessage = (newMessage, newMessageType, duration = 2500) => {
        // clear existing timeout, so msg time is consistent, 
        // this is so if someone is spamming buttons, triggering different messages
        if (timeoutId.current) {
            clearTimeout(timeoutId.current);
        }

        setMessage(newMessage);
        setMessageType(newMessageType);

        // set new timeout
        timeoutId.current = setTimeout(() => {
            setMessage(null);
            setMessageType('');
            timeoutId.current = null; //clear ref
        }, duration);
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
            displayMessage("User data not loaded. Please try again.", 'error');
            return;
        }
        if (isClockedIn) {
            displayMessage("Already clocked in. Clock out first.", 'warning');
            return;
        }

        setIsClockedIn(true); // Set clock-in status to true
        localStorage.setItem(`isClockedIn_${cookData.email}`, true); // Save to localStorage
        displayMessage("You have clocked in.", 'success');
    };

    const handleClockOut = () => {
        if (!cookData) {
            displayMessage("User data not loaded. Please try again.", 'error');
            return;
        }
        if (!isClockedIn) {
            displayMessage("Not clocked in yet.", 'warning');
            return;
        }

        setIsClockedIn(false); // Set clock-in status to false
        localStorage.setItem(`isClockedIn_${cookData.email}`, false); // Save to localStorage
        displayMessage("You have clocked out.", 'success');
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

                            {/* message display area, messages go here, maybe consider changing color */}
                            {message && (
                                <div className={`message ${messageType}`}>
                                {message}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashCook;