// frontend/src/pages/Invoices.jsx
import { useEffect, useState } from 'react';
import './styles/Admin.css';
import Navbar from './components/Navbar';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);

  // Fetch Paid Invoices
  const fetchInvoices = async () => {
    try {
      const response = await fetch('https://bookmanagement-yjoe.onrender.com/api/admin/invoices');
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div>
      <Navbar />
    <div className="admin-container">
      <h1>Invoices</h1>
      {invoices.length === 0 && <p>No invoices available.</p>}
      {invoices.map((invoice) => (
        <div key={invoice._id} className="invoice-card">
          <h3>{invoice.schoolName}</h3>
          <p>Email: {invoice.email}</p>
          <p>Phone: {invoice.phoneNumber}</p>
          <p>Payment Status: {invoice.paymentStatus}</p>

          <a href={invoice.invoiceUrl} target="_blank" rel="noopener noreferrer">
            View Invoice
          </a>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Invoices;
