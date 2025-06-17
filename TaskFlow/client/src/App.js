// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';

import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import SortDropdown from './components/SortDropdown';

import { fetchTasks, addTask } from './services/api';

function App() {
  const [originalTasks, setOriginalTasks] = useState([]); 
  const [displayedTasks, setDisplayedTasks] = useState([]); 
  const [showModal, setShowModal] = useState(false);

  // Завантаження задач із сервера
  const loadTasks = async () => {
    try {
      const { data } = await fetchTasks();
      setOriginalTasks(data);
      setDisplayedTasks(data); 
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Додавання нової задачі
  const handleAddTask = async (newTask) => {
    try {
      await addTask(newTask);
      await loadTasks();
      setShowModal(false);
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  // Отримання відсортованих задач із SortDropdown
  const handleSortedTasks = (sorted) => {
    setDisplayedTasks(sorted);
  };

  return (
    <div className="app-container">
      <h1>TaskFlow</h1>

      {/* Кнопка для створення задачі */}
      <button className="toggle-btn" onClick={() => setShowModal(true)}>
        Додати задачу
      </button>

      {/* Випадаючий список сортування */}
      <SortDropdown tasks={originalTasks} onSorted={handleSortedTasks} />

      {/* Модальне вікно для форми */}
      {showModal && (
        <TaskForm
          onSubmit={handleAddTask}
          onClose={() => setShowModal(false)}
        />
      )}

      <h2>Список задач:</h2>
      <div className="task-list">
        {displayedTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
}

export default App;
