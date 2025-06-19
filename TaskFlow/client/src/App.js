
import React, { useState, useRef, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskCard from "./components/TaskCard";
import SortDropdown from "./components/SortDropdown";
import Logger from "./components/Logger";
import Toast from "./components/Toast";
import DoneToast from "./components/DoneToast";
import { asyncFilterMap } from "./utils/asyncArrayFunctions";
import { memoizeSortBy } from "./utils/memoizeAndSort";
import { simulateTaskStream } from "./utils/taskStream";
import { eventBus } from "./utils/eventBus";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [filter, setFilter] = useState("active");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const checkIfRelevant = async (task) => {
      await new Promise((res) => setTimeout(res, 100));
      return task.name.toLowerCase().includes("old") ? undefined : task;
    };

    async function filterRelevant() {
      const filtered = await asyncFilterMap(tasks, checkIfRelevant);
      setTasks(filtered);
    }

    filterRelevant();
  }, []);

  const handleCreateTask = (newTask) => {
    newTask.createdAt = Date.now();
    setTasks((prev) => [...prev, newTask]);
    setShowModal(false);
    eventBus.emit("task:created", newTask);
  };

  const handleMarkAsDone = (taskId) => {
    const completed = tasks.find((t) => t.id === taskId);
    if (!completed) return;
    setDoneTasks([...doneTasks, completed]);
    setTasks(tasks.filter((t) => t.id !== taskId));
    eventBus.emit("task:done", completed);
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const getSortedTasks = memoizeSortBy((tasks, order) => {
    const sorted = [...tasks];
    if (order === "priority-asc") return sorted.sort((a, b) => a.priority - b.priority);
    if (order === "priority-desc") return sorted.sort((a, b) => b.priority - a.priority);
    if (order === "az") return sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (order === "za") return sorted.sort((a, b) => b.name.localeCompare(a.name));
    if (order === "date-new") return sorted.sort((a, b) => b.createdAt - a.createdAt);
    if (order === "date-old") return sorted.sort((a, b) => a.createdAt - b.createdAt);
    return sorted;
  });

  const visibleTasks = {
    active: getSortedTasks(tasks, sortOrder),
    done: doneTasks,
    all: [...getSortedTasks(tasks, sortOrder), ...doneTasks],
  }[filter];

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setShowModal(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleImportStream = async () => {
    setIsImporting(true);
    for await (const task of simulateTaskStream(20)) {
      setTasks((prev) => [...prev, task]);
      eventBus.emit("task:imported", task);
    }
    setIsImporting(false);
  };

  return (
    <div className="App app-container">
      <Toast />
      <DoneToast />
      <h1>TaskFlow</h1>

      <button className="toggle-btn" onClick={() => setShowModal(true)}>
        + Нова задача
      </button>

      <button
        className="toggle-btn"
        onClick={handleImportStream}
        disabled={isImporting}
      >
        {isImporting ? "Імпортую..." : "Імпортувати потік задач"}
      </button>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal" ref={modalRef}>
            <div className="modal-header">
              <h2>Створити нову задачу</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <TaskForm onCreate={handleCreateTask} />
          </div>
        </div>
      )}

      <div className="sort-dropdown">
        <label>Сортування:</label>
        <SortDropdown value={sortOrder} onChange={handleSortChange} />
        <button onClick={() => setFilter("active")}>Активні</button>
        <button onClick={() => setFilter("done")}>Виконані</button>
        <button onClick={() => setFilter("all")}>Усі</button>
      </div>

      <div className="task-list">
        {visibleTasks.map((task) => (
          <TaskCard key={task.id} task={task} onMarkDone={handleMarkAsDone} />
        ))}
      </div>

      <Logger />
    </div>
  );
}

export default App;
