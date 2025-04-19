import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./userLogin.css";

const API_BASE = process.env.REACT_APP_API_BASE || '';

function UserLogin({ onLogin }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);

      if (data.user.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "Manager") {
        navigate("/manager-dashboard");
      } else if (data.user.role === "Waiter") {
        navigate("/waiter-dashboard");
      } else if (data.user.role === "Cook") {
        navigate("/cook-dashboard");
      } else {
        navigate("/customer-dashboard");
      }
    
    }catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${process.env.PUBLIC_URL}/images/restomainpic.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <div className="login-container">
        <h2>Employee Login</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="username"
            placeholder="Username or Email"
            required
          />
          <input
            type="password"
            id="password"
            placeholder="Password"
            required
          />
          <button type="submit">Sign In</button>
        </form>

        <p style={{ marginTop: "1rem" }}>
          <Link to="/login">Back to Customer Login</Link>
        </p>
      </div>
    </div>
  );
}

export default UserLogin;
