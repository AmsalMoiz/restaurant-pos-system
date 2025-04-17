import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DashCook.css";

function DashCook() {
    const [cookData, setCookData] = useState(null);
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
            setLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        if (cookData) {
            localStorage.removeItem(`isClockedIn_${cookData.email}`);
        }
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
                        <h2>Actions</h2>
                        <button
                            className="clock-btn"
                            onClick={() => navigate("/log-hours")}
                        >
                            Log Hours
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default DashCook;
