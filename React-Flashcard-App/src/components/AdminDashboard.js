import React, { useState } from 'react';

function AdminDashboard({ flashcards, onAdd, onEdit, onDelete }) {
  const [newCard, setNewCard] = useState({ question: '', answer: '' });

  const handleAdd = () => {
    if (newCard.question.trim() && newCard.answer.trim()) {
      onAdd(newCard);
      setNewCard({ question: '', answer: '' });
    } else {
      alert('Both question and answer are required.');
    }
  };

  const handleEdit = (id) => {
    const question = prompt('New question:');
    const answer = prompt('New answer:');
    if (question && answer) {
      onEdit(id, { question, answer });
    } else {
      alert('Both question and answer are required.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      onDelete(id);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <input
        type="text"
        placeholder="Question"
        value={newCard.question}
        onChange={(e) => setNewCard({ ...newCard, question: e.target.value })}
      />
      <input
        type="text"
        placeholder="Answer"
        value={newCard.answer}
        onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })}
      />
      <button onClick={handleAdd}>Add Flashcard</button>
      <div>
        {flashcards.map((card) => (
          <div key={card.id}>
            <h3>{card.question}</h3>
            <p>{card.answer}</p>
            <button onClick={() => handleEdit(card.id)}>Edit</button>
            <button onClick={() => handleDelete(card.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
