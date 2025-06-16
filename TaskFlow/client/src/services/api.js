import axios from 'axios';

const API = process.env.REACT_APP_API;

export const fetchTasks = () => axios.get(`${API}/tasks`);
export const addTask    = task => axios.post(`${API}/tasks`, task);
