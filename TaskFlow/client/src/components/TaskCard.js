import React from 'react';

export default function TaskCard({ task }) {
  return (
    <div className="task-card" style={{ backgroundColor: task.color || '#f0f0f0' }}>
      <h3>{task.title}</h3>
      <p>{task.description}</p>
    </div>
  );
}
