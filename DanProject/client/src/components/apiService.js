const API_URL = 'http://localhost:3001';

export const apiService = {
  // Customer Authentication
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/customers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (customerData) => {
    try {
      const response = await fetch(`${API_URL}/customers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  updateCustomer: async (customerId, customerData) => {
    try {
      const response = await fetch(`${API_URL}/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  },
  
  // Menu
  getMenuItems: async () => {
    try {
      const response = await fetch(`${API_URL}/menu`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch menu');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch menu error:', error);
      throw error;
    }
  },
  
  // Orders
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },
  
  getCustomerOrders: async (customerId) => {
    try {
      const response = await fetch(`${API_URL}/customers/${customerId}/orders`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Fetch orders error:', error);
      throw error;
    }
  },
};

export default apiService;