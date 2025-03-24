import { useState, useEffect } from 'react';
import apiService from './apiService';

function Menu({ addToCart }) {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const items = await apiService.getMenuItems();
        setMenuItems(items);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(items.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        setError('Failed to load menu items. Please try again later.');
        console.error('Error fetching menu items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="menu-container">
        <h1>Loading Menu...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>
      
      <div className="category-filter">
        {categories.map(category => (
          <button 
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className="menu-items">
        {filteredItems.length === 0 ? (
          <p>No items available in this category.</p>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="menu-item">
              <img src={item.image} alt={item.name} />
              <div className="menu-item-details">
                <h3>{item.name}</h3>
                <p>{item.description || `${item.category} item`}</p>
                <div className="menu-item-footer">
                  <span className="price">${item.price.toFixed(2)}</span>
                  <button 
                    className="add-to-cart"
                    onClick={() => addToCart(item)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Menu;