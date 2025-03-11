// frontend/src/pages/UserOrder.jsx
import { useEffect, useState } from 'react';
import './styles/UserOrder.css';

const UserOrder = () => {
  const [userInfo, setUserInfo] = useState({
    schoolName: '',
    email: '',
    phoneNumber: '',
  });

  const [sections, setSections] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);

  // Load user info and fetch sections and books
  useEffect(() => {
    const savedUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
    setUserInfo(savedUserInfo);
    fetchSectionsAndBooks();
  }, []);

  // Fetch sections and books from backend
  const fetchSectionsAndBooks = async () => {
    try {
      const sectionRes = await fetch('http://localhost:5000/api/sections');
      const bookRes = await fetch('http://localhost:5000/api/books');

      const sectionData = await sectionRes.json();
      const bookData = await bookRes.json();

      console.log('Sections:', sectionData);
      console.log('Books:', bookData);

      setSections(sectionData);
      setBooks(bookData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle input changes
  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    const updatedUserInfo = { ...userInfo, [name]: value };
    setUserInfo(updatedUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
  };

  // Handle section change
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };

  // Toggle book selection
  const toggleBookSelection = (book) => {
    const isSelected = selectedBooks.find((b) => b._id === book._id);
    if (isSelected) {
      setSelectedBooks(selectedBooks.filter((b) => b._id !== book._id));
    } else {
      setSelectedBooks([...selectedBooks, book]);
    }
  };

  // Place order
  const placeOrder = async () => {
    if (!userInfo.schoolName || !userInfo.email || !userInfo.phoneNumber) {
      alert('Please fill out all user information fields!');
      return;
    }

    if (selectedBooks.length === 0) {
      alert('Please select at least one book.');
      return;
    }

    try {
      const orderData = {
        ...userInfo,
        books: selectedBooks.map((book) => ({
          bookId: book._id,
          name: book.name,
          price: book.price,
        })),
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert('Order placed successfully!');
        setSelectedBooks([]);
        localStorage.removeItem('userInfo');
      } else {
        alert('Error placing order.');
      }
    } catch (error) {
      console.error('Order error:', error);
    }
  };

  // Filter books by selected section (Fixed logic)
  const filteredBooks = selectedSection
  ? books.filter((book) => String(book.section._id) === String(selectedSection))
  : books;

  return (
    <div className="user-order-container">
      <div className="form-container">
        <h1>Book Order Form</h1>
        <input
          type="text"
          name="schoolName"
          placeholder="School Name"
          value={userInfo.schoolName}
          onChange={handleUserInfoChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={handleUserInfoChange}
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={userInfo.phoneNumber}
          onChange={handleUserInfoChange}
        />

        {/* Section Dropdown */}
        <select value={selectedSection} onChange={handleSectionChange}>
          <option value="">Select a Section</option>
          {sections.map((section) => (
            <option key={section._id} value={section._id}>
              {section.name}
            </option>
          ))}
        </select>
      </div>

      <div className="content-container">
        <div className="book-section">
          <h2>Books Available</h2>
          {filteredBooks.length === 0 ? (
            <p>No books available for this section.</p>
          ) : (
            filteredBooks.map((book) => (
              <div key={book._id} className="book-item">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedBooks.some((b) => b._id === book._id)}
                    onChange={() => toggleBookSelection(book)}
                  />
                  {book.name} - ${book.price}
                </label>
              </div>
            ))
          )}
        </div>

        <div className="cart-container">
          <h2>Selected Books</h2>
          {selectedBooks.length === 0 ? (
            <p>No books selected.</p>
          ) : (
            <ul>
              {selectedBooks.map((book) => (
                <li key={book._id}>
                  {book.name} - ${book.price}
                </li>
              ))}
            </ul>
          )}
          <button onClick={placeOrder}>Place Order</button>
        </div>
      </div>
    </div>
  );
};

export default UserOrder;
