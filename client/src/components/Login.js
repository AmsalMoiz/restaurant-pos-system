import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = [
      { email: "cynthia@example.com", password: "password123" },
      { email: "admin@example.com", password: "adminpass" },
    ];

    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      alert("Login Successful!");
      navigate("/home");
    } else {
      setError("Invalid email or password");
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
          New to Sweet Heaven? <a href="#">Create an account</a>
        </p>

        <p style={{ marginTop: "1rem" }}>
          Or <Link to="/home">Go to Home Page</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;


