

import axios from 'axios';

const API = process.env.REACT_APP_API;

// Отримати всі задачі з сервера
export const fetchTasks = () => axios.get(`${API}/tasks`);

// Додати нову задачу
export const addTask = ({ title, description, color, priority }) =>
  axios.post(`${API}/tasks`, {
    title,
    description,
    color,
    priority,
  });
