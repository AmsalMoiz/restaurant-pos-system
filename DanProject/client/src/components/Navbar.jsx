import { Link } from 'react-router-dom';

function Navbar({ cartItems, isLoggedIn, handleLogout }) {
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="nav-container">
      <div className="nav-content">
        <Link to="/" className="logo" href>Home</Link>
        
        <div className="nav-links">
          <Link to="/menu" className="nav-link">Menu</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/orders" className="nav-link">My Orders</Link>
              <span className="nav-link" onClick={handleLogout}>Logout</span>
            </>
          ) : (
            <Link to="/auth" className="nav-link">Login / Signup</Link>
          )}
          
          <Link to="/cart" className="nav-link cart-icon">
            🛒
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;