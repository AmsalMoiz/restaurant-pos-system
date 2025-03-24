import { useState } from 'react';
import apiService from './apiService';

function CustomerAuth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { email, password } = formData;
      const result = await apiService.login(email, password);
      
      if (result.success) {
        // Store customer info in localStorage
        localStorage.setItem('customer', JSON.stringify(result.customer));
        onLogin(result.customer);
      }
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await apiService.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        cardNumber: formData.cardNumber || null,
        expiry: formData.expiry || null,
        cvv: formData.cvv || null
      });
      
      if (result.success) {
        // Store customer info in localStorage
        localStorage.setItem('customer', JSON.stringify(result.customer));
        onLogin(result.customer);
      }
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>{isLogin ? "Customer Login" : "Create Account"}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          {!isLogin && (
            <>
              <label htmlFor="name">Full Name</label>
              <br />
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <br />
            </>
          )}
          
          <label htmlFor="email">Email</label>
          <br />
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email}
            onChange={handleChange}
            required 
          />
          <br />
          
          <label htmlFor="password">Password</label>
          <br />
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password}
            onChange={handleChange}
            required 
          />
          <br />
          
          {!isLogin && (
            <>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <br />
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
              />
              <br />
              
              <label htmlFor="phone">Phone Number</label>
              <br />
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
              />
              <br />
              
              <div className="payment-info">
                <h3>Payment Information (Optional)</h3>
                
                <label htmlFor="cardNumber">Card Number</label>
                <br />
                <input 
                  type="text" 
                  id="cardNumber" 
                  name="cardNumber" 
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="XXXX XXXX XXXX XXXX"
                />
                <br />
                
                <div className="form-row">
                  <div>
                    <label htmlFor="expiry">Expiry Date</label>
                    <br />
                    <input 
                      type="date" 
                      id="expiry" 
                      name="expiry" 
                      value={formData.expiry}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cvv">CVV</label>
                    <br />
                    <input 
                      type="text" 
                      id="cvv" 
                      name="cvv" 
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="XXX"
                      maxLength="3"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading 
              ? "Loading..." 
              : isLogin ? "Login" : "Create Account"
            }
          </button>
        </form>
        
        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            className="toggle-link" 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default CustomerAuth;