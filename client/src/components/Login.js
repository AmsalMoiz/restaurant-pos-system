import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import UserSignupModal from "./UserSignupModal"; 

const API_BASE = process.env.REACT_APP_API_BASE || '';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignupModal, setShowSignupModal] = useState(false); 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { name, email, phone } = data.user;
  
        localStorage.setItem("user", JSON.stringify({
          name,
          email,
          phone
        }));
  
        navigate("/customer-dashboard"); 
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. See console for details.");
    }
  };
  

  const [modalErrorMessage, setModalErrorMessage] = useState("")
  const handleSignup = async (formData) => {
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
  
        displayMessage("Account created successfully!", 'success');
  
        setShowSignupModal(false);
        navigate("/customer-dashboard");
      } else {
        setModalErrorMessage(data.error || "Signup failed.");
      }
    } catch (error) {
      setModalErrorMessage("Server error during signup.");
      console.error(error);
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
          New to Sweet Heaven?{" "}
          <button onClick={() => setShowSignupModal(true)} className="link-button">Create an account</button>
        </p>
        
        <p style={{ marginTop: "1rem" }}>
          Or <Link to="/home">Go to Home Page</Link>
        </p>

        {/* Employee Login Link */}
        <p style={{ marginTop: "1rem" }}>
          <Link to="/users/login">Go to Employee Login</Link>
        </p>
        {/* message display area, messages go here */}
          {message && (
          <div className={`message ${messageType}`}>
          {message}
          </div>
        )}
      </div>

      {/* Modal component visible only if toggled on */}
      {showSignupModal && (
        <UserSignupModal onClose={() => setShowSignupModal(false)} 
        onSignup={handleSignup}
        showSignupModal={showSignupModal}
        errorMessage={modalErrorMessage}
        setErrorMessage={setModalErrorMessage}
        />
      )}
    </div>
  );
};

export default Login;
