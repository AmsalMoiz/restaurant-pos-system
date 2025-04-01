import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import "./userLogin.css";

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

function UserLogin({ onLogin }) {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Basic validation
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }
        
        try {
            const response = await fetch(`${API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: username, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // If login successful, store user info and notify parent component
            localStorage.setItem('user', JSON.stringify(data.user));
            onLogin(data.user);
            // Check user role and redirect accordingly
            if (data.user.role === 'Admin') {
                navigate('/admin-dashboard'); // Redirect to admin dashboard
            } 
            else if (data.user.role === 'Manager') {
                navigate('/manager-dashboard'); // Redirect to manager dashboard
            }
            else if (data.user.role === 'Waiter') {
                navigate('/waiter-dashboard'); // Redirect to waiter dashboard
            }
            else if (data.user.role === 'Cook') {
                navigate('/cook-dashboard'); // Redirect to cook dashboard
            }
            
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Login failed. Please try again.');
        }
    };
    
    return (
        <>
        <div id="user_login_body">
        <div id="user_login"> 
            <h1>Employee Login</h1> 
            
            {error && <div className="error-message">{error}</div>}
                        
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username/Email</label>
                <br />
                <input type="text" id="username" required/>
                <br />
                <label htmlFor="password">Password</label>
                <br />
                <input type="password" id="password" required/>
                <br />
                <br />
                <button type="submit" id="sign_in">Sign In</button>
            </form>

            {/* Add Back to Customer Login Link */}
            <p style={{ marginTop: "1rem" }}>
                <Link to="/login">Back to Customer Login</Link>
            </p>
        </div>
        </div>
        </>
    );
}
        
export default UserLogin;



