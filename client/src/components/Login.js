import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {  
      const response = await fetch("https://sweet-heaven-atduagede6hpdxeg.eastus-01.azurewebsites.net/api/auth/login", { // hardcoded url better to use env variable but portability and security aren't important considerations for this project currently
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Login Successful!");
        navigate("/home");
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Error connecting to server.");
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
        <h2>Welcome to Sweet Heaven</h2>
        <p>Sign in to explore our desserts & dine-in menu</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p>
          New to Sweet Heaven? <Link to="/signup">Create an account</Link>
        </p>

        <p style={{ marginTop: "1rem" }}>
          Or <Link to="/home">Go to Home Page</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


