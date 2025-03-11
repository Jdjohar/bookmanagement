// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Sections from './Sections';
import Books from './Books';
import UnpaidOrders from './UnpaidOrders';
import Invoices from './Invoices';
import UserOrder from './UserOrder';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/sections" element={<Sections />} />
      <Route path="/books" element={<Books />} />
      <Route path="/unpaid-requests" element={<UnpaidOrders />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/usersBooks" element={<UserOrder />} />
    </Routes>
  </Router>
);

export default App;
