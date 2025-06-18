import React from "react";
import "../App.css";

const priorityLabels = {
  1: "дуже важливо",
  2: "важливо",
  3: "неважливо",
};

function TaskCard({ task, onMarkDone }) {
  return (
    <div className="task-card" style={{ backgroundColor: task.color || "#fff" }}>
      <h3>{task.name}</h3>
      <p>{task.description}</p>
      <p><strong>Пріоритет:</strong> {priorityLabels[task.priority]}</p>
      {onMarkDone && (
        <label>
          <input
            type="checkbox"
            onChange={() => onMarkDone(task.id)}
          /> Завершено
        </label>
      )}
    </div>
  );
}

export default TaskCard;
