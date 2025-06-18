import React from "react";

function SortDropdown({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="default">За замовчуванням</option>
      <option value="priority-asc">Пріоритет ↑</option>
      <option value="priority-desc">Пріоритет ↓</option>
      <option value="az">Назва A-Я</option>
      <option value="za">Назва Я-A</option>
      <option value="date-new">Новіші</option>
      <option value="date-old">Старіші</option>
    </select>
  );
}

export default SortDropdown;

