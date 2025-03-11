// src/pages/Sections.jsx
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchSections = async () => {
    const response = await fetch('http://localhost:5000/api/sections');
    const data = await response.json();
    setSections(data);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const addSection = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });
    fetchSections();
  };

  return (
    <div>
      <Navbar />
      <h2>Add Section</h2>
      <form onSubmit={addSection}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Section Name" required />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Add</button>
      </form>
      <h3>Sections List</h3>
      <ul>
        {sections.map((s) => (
          <li key={s._id}>{s.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sections;
