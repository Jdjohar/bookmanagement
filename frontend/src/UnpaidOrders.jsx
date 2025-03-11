// frontend/src/pages/UnpaidOrders.jsx
import { useEffect, useState } from 'react';
import './styles/Admin.css';
import Navbar from './components/Navbar';

const UnpaidOrders = () => {
  const [unpaidOrders, setUnpaidOrders] = useState([]);

  // Fetch unpaid orders
  const fetchUnpaidOrders = async () => {
    try {
      const response = await fetch('https://bookmanagement-yjoe.onrender.com/api/orders/unpaid');
      const data = await response.json();
      setUnpaidOrders(data);
    } catch (error) {
      console.error('Error fetching unpaid orders:', error);
    }
  };

  // Mark an order as Paid
  const markAsPaid = async (orderId) => {
    try {
      const response = await fetch(`https://bookmanagement-yjoe.onrender.com/api/orders/${orderId}/pay`, {
        method: 'PUT',
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Order marked as Paid! Invoice URL: ${result.invoiceUrl}`);
        fetchUnpaidOrders(); // Refresh list after marking paid
      } else {
        alert('Error marking order as paid.');
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  useEffect(() => {
    fetchUnpaidOrders();
  }, []);

  return (
  
  <div>
      <Navbar />
    <div className="admin-container">
      <h1>Unpaid Orders</h1>
      {unpaidOrders.length === 0 && <p>No unpaid orders available.</p>}
      {unpaidOrders.map((order) => (
        <div key={order._id} className="order-card">
          <h3>{order.schoolName}</h3>
          <p>Email: {order.email}</p>
          <p>Phone: {order.phoneNumber}</p>
          <p>Payment Status: {order.paymentStatus}</p>

          <h4>Books:</h4>
          <ul>
            {order.books.map((book) => (
              <li key={book.bookId._id}>
                {book.name} (${book.price})
              </li>
            ))}
          </ul>

          <button onClick={() => markAsPaid(order._id)}>Mark as Paid</button>
        </div>
      ))}
    </div>
    </div>
  );
};

export default UnpaidOrders;
