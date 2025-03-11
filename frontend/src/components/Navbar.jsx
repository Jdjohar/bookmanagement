// src/components/Navbar.jsx
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link> | 
      <Link to="/sections">Sections</Link> | 
      <Link to="/books">Books</Link> | 
      <Link to="/unpaid-requests">Unpaid Requests</Link> | 
      <Link to="/invoices">Invoices</Link>
    </nav>
  );
};

export default Navbar;
