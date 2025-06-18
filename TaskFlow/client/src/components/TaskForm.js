import React, { useState, useEffect, useRef } from "react";
import "../App.css";

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}

function TaskForm({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(2);
  const [color, setColor] = useState("#60a5fa");
  const [generatedColors, setGeneratedColors] = useState([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setGeneratedColors([]);
    }
  }, [countdown]);

  const handleGenerateColors = () => {
    const colors = Array.from({ length: 5 }, getRandomColor);
    setGeneratedColors(colors);
    setCountdown(5);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const newTask = {
      id: Date.now(),
      name,
      description,
      priority: Number(priority),
      color,
      createdAt: Date.now(),
    };

    onCreate(newTask);
    setName("");
    setDescription("");
    setPriority(2);
    setColor("#60a5fa");
  };

  return (
    <form className="task-add" onSubmit={handleSubmit}>
      <input
        className="task-name"
        type="text"
        placeholder="Назва задачі"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="task-description"
        type="text"
        placeholder="Опис"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="color-section">
        <label>Колір:</label>
        <input
          type="color"
          className="color-picker"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={(e) => { e.preventDefault(); handleGenerateColors(); }}>
          Рекомендований колір
        </button>
      </div>
      {generatedColors.length > 0 && countdown > 0 && (
        <div className="suggestions" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {generatedColors.map((c, idx) => (
            <button
              key={idx}
              style={{ backgroundColor: c }}
              onClick={(e) => {
                e.preventDefault();
                setColor(c);
              }}
            />
          ))}
          <span className="timer">{countdown}</span>
        </div>
      )}
      <div className="color-section">
        <label>Пріоритет:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value={1}>дуже важливо</option>
          <option value={2}>важливо</option>
          <option value={3}>неважливо</option>
        </select>
      </div>
      <button type="submit">Створити</button>
    </form>
  );
}

export default TaskForm;
