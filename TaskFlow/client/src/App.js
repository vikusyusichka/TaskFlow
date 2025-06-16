// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import { fetchTasks, addTask } from './services/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Завантаження задач з сервера
  const loadTasks = async () => {
    try {
      const { data } = await fetchTasks();
      setTasks(data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Додавання нової задачі
  const handleAddTask = async (task) => {
    try {
      await addTask(task);
      loadTasks();
      setShowModal(false);
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  return (
    <div className="app-container">
      <h1>TaskFlow</h1>

      {/* Кнопка відкриття форми */}
      <button className="toggle-btn" onClick={() => setShowModal(true)}>
        Додати задачу
      </button>

      {/* Модальне вікно для створення задачі */}
      {showModal && (
        <TaskForm
          onSubmit={handleAddTask}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2>Список задач:</h2>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default App;
