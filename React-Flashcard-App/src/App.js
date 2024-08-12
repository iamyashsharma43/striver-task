import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FlashcardList from './components/FlashcardList';
import Header from './components/Header';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';  // Correct path to Login.js
import './App.css';
import axios from 'axios';

function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  useEffect(() => {
    axios.get('https://opentdb.com/api_category.php').then(res => {
      setCategories(res.data.trivia_categories);
    });
  }, []);

  const handleGenerateFlashcards = (category, amount) => {
    axios
      .get('https://opentdb.com/api.php', {
        params: { amount, category }
      })
      .then(res => {
        const newFlashcards = res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a)),
            answer
          ];
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer,
            options: options.sort(() => Math.random() - 0.5)
          };
        });
        setFlashcards(newFlashcards);
      });
  };

  const handleAddFlashcard = (newCard) => {
    setFlashcards([...flashcards, { ...newCard, id: `${flashcards.length}-${Date.now()}` }]);
  };

  const handleEditFlashcard = (id, updatedCard) => {
    setFlashcards(flashcards.map(card => (card.id === id ? updatedCard : card)));
  };

  const handleDeleteFlashcard = (id) => {
    setFlashcards(flashcards.filter(card => card.id !== id));
  };

  const decodeString = (str) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsModalOpen(false); // Close the modal on successful login
  };

  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <Router>
      <div>
        <Link
          onClick={openModal} // Updated to open the modal
          style={{
            position: 'absolute',
            left: '10px',
            top: '10px',
            borderRadius: '50px',
            border: '1px solid black',
            padding: '5px 10px',
            color: 'black',
            cursor: 'pointer',
            textDecoration: 'none'
          }}
        >
          Login
        </Link>
        <Header categories={categories} onGenerate={handleGenerateFlashcards} />
        <div className="container">
          <FlashcardList flashcards={flashcards} />
        </div>
        {isLoggedIn && (
          <AdminDashboard
            flashcards={flashcards}
            onAdd={handleAddFlashcard}
            onEdit={handleEditFlashcard}
            onDelete={handleDeleteFlashcard}
          />
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <Routes>
                <Route path="/login" element={<Login onLogin={handleLogin} />} />  // Updated route
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
