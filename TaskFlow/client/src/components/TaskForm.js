// src/components/TaskForm.js
import React, { useState } from 'react';
import '../App.css';

export default function TaskForm({ onSubmit, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#cccccc');
  const [suggested, setSuggested] = useState([]);
  const [showSug, setShowSug] = useState(false);
  const [timer, setTimer] = useState(0);

  const generateSuggestions = () => {
    const arr = Array.from({ length: 5 }, () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    );
    setSuggested(arr);
    setShowSug(true);
    setTimer(5);
    const iv = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(iv);
          setShowSug(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    onSubmit({ title, description, color });
    setTitle(''); setDescription(''); setColor('#cccccc'); setSuggested([]);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h2>Нова задача</h2>
          <button className="modal-close-btn" onClick={onClose}>✖</button>
        </div>
        <div className="task-add">
          <input
            type="text"
            placeholder="Назва задачі"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Опис (необов'язково)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div className="color-section">
          <label>Колір задачі:</label>
          {/* Кнопка колірної піктограми замінена на input color */}
          <input
            type="color"
            value={color}
            onChange={e => setColor(e.target.value)}
            className="color-picker"
          />
          <button className="recommend-btn" onClick={generateSuggestions}>
            Рекомендовані
          </button>
        </div>
        {showSug && (
          <div className="suggestions">
            <div className="timer">⏱ {timer} сек</div>
            {suggested.map((c, i) => (
              <button
                key={i}
                className="color-swatch"
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        )}
        <button className="submit-btn" onClick={handleCreate}>
          Створити
        </button>
      </div>
    </div>
  );
}
