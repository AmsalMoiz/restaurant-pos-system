import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome!</h1>
        <p>Delicious food delivered to your doorstep</p>
        <div className="hero-buttons">
          <Link to="/menu" className="hero-button primary">Browse Menu</Link>
          <Link to="/auth" className="hero-button secondary">Login / Sign Up</Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>Online Ordering</h3>
          <p>Order your favorite meals with just a few clicks</p>
        </div>
        
        <div className="feature">
          <h3>Fast Delivery</h3>
          <p>Get your food delivered in 30 minutes or less</p>
        </div>
        
        <div className="feature">
          <h3>Easy Tracking</h3>
          <p>Track your order status in real-time</p>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Hungry? Order Now!</h2>
        <p>Explore our menu and satisfy your cravings</p>
        <Link to="/menu" className="cta-button">View Menu</Link>
      </div>
    </div>
  );
}

export default HomePage;