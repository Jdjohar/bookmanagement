// src/api.js

const API_URL = "http://localhost:5000/api";

// Fetch all sections
export const getSections = async () => {
  const response = await fetch(`${API_URL}/sections`);
  return response.json();
};

// Fetch all books
export const getBooks = async () => {
  const response = await fetch(`${API_URL}/books`);
  return response.json();
};

// Place order
export const placeOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return response.json();
};

// Admin API Methods
export const adminLogin = async (credentials) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return response.json();
  };
  
  export const addSection = async (section) => {
    const response = await fetch(`${API_URL}/admin/add-section`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(section),
    });
    return response.json();
  };
  
  export const addBook = async (book) => {
    const response = await fetch(`${API_URL}/admin/add-book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book),
    });
    return response.json();
  };
  
  export const getUnpaidOrders = async () => {
    const response = await fetch(`${API_URL}/api/orders/unpaid`);
    return response.json();
  };
  
  export const markOrderAsPaid = async (orderId) => {
    const response = await fetch(`${API_URL}/admin/order/${orderId}/pay`, {
      method: 'PUT',
    });
    return response.json();
  };
  
  export const getInvoices = async () => {
    const response = await fetch(`${API_URL}/admin/invoices`);
    return response.json();
  };
  
