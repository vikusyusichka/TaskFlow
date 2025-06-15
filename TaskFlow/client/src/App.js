import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.REACT_APP_API;

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
    if (!title) return;

    try {
      await axios.post(`${API}/tasks`, {
        title,
        description,
      });

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>TaskFlow</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Назва задачі"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Опис задачі"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br />
        <button onClick={handleAddTask}>Додати задачу</button>
      </div>

      <h2>Список задач:</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong>: {task.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
