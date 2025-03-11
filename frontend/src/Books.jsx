// src/pages/Books.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [sections, setSections] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [section, setSection] = useState('');

  const fetchBooks = async () => {
    const response = await fetch('https://bookmanagement-yjoe.onrender.com/api/books');
    const data = await response.json();
    setBooks(data);
  };

  const fetchSections = async () => {
    const response = await fetch('https://bookmanagement-yjoe.onrender.com/api/sections');
    const data = await response.json();
    console.log(data);
    
    setSections(data);
  };

  useEffect(() => {
    fetchBooks();
    fetchSections();
  }, []);

  const addBook = async (e) => {
    e.preventDefault();
    await fetch('https://bookmanagement-yjoe.onrender.com/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price, section }),
    });
    fetchBooks();
  };

  return (
    <div>
      <Navbar />
      <h2>Add Book</h2>
      <form onSubmit={addBook}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Book Name" required />
        <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />
        <select value={section} onChange={(e) => setSection(e.target.value)} required>
          <option value="">Select Section</option>
          {sections.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>
      <h3>Books List</h3>
      <ul>
        {books.map((b) => (
          <li key={b._id}>{b.name} - ${b.price}</li>
        ))}
      </ul>
    </div>
  );
};

export default Books;
