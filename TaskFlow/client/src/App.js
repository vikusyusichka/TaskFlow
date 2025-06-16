import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const API = process.env.REACT_APP_API;

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [taskColor, setTaskColor] = useState('#cccccc');
  const [suggestedColors, setSuggestedColors] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [timer, setTimer] = useState(0);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!taskTitle) return;

    try {
      await axios.post(`${API}/tasks`, {
        title: taskTitle,
        description: taskDescription,
        color: taskColor,
      });

      setTaskTitle('');
      setTaskDescription('');
      setTaskColor('#cccccc');
      setShowModal(false);
      setSuggestedColors([]);
      fetchTasks();
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  const generateRandomColors = () => {
    const colors = Array.from({ length: 5 }, () =>
      '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
    );
    setSuggestedColors(colors);
    setShowSuggestions(true);
    setTimer(5);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowSuggestions(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="app-container">
      <h1>TaskFlow</h1>
      <button onClick={() => setShowModal(!showModal)} className="toggle-btn">
        {showModal ? 'Згорнути' : 'Додати задачу'}
      </button>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h2>Додати задачу</h2>
              <button onClick={() => setShowModal(false)} className="modal-close-btn">✖</button>
            </div>
            <div className="task-add">
              <input
                className="task-name"
                type="text"
                placeholder="Назва задачі"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
              <input
                type="text"
                className="task-description"
                placeholder="Опис (необов'язково)"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>
            <div className="color-section">
              <label>Колір задачі:</label>
              <input
                type="color"
                value={taskColor}
                onChange={(e) => setTaskColor(e.target.value)}
                className="color-picker"
              />
              <button onClick={generateRandomColors}>Рекомендовані</button>
            </div>
            {showSuggestions && (
              <div className="suggestions">
                <div className="timer">⏱ {timer} сек</div>
                {suggestedColors.map((color, idx) => (
                  <button
                    key={idx}
                    className="color-swatch"
                    style={{ backgroundColor: color }}
                    onClick={() => setTaskColor(color)}
                  />
                ))}
              </div>
            )}
            <button onClick={handleAddTask}>Створити</button>
          </div>
        </div>
      )}

      <h2>Список задач:</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <div
            className="task-card"
            key={task._id}
            style={{ backgroundColor: task.color || '#f0f0f0' }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;