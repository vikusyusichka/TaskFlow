
import React, { useEffect, useState } from "react";
import { eventBus } from "../utils/eventBus";

function Logger() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const handleCreate = (e) => {
      setLogs((prev) => [...prev, `Task created: ${e.detail.name}`]);
    };
    const handleDone = (e) => {
      setLogs((prev) => [...prev, `Task completed: ${e.detail.name}`]);
    };
    const handleImport = (e) => {
      setLogs((prev) => [...prev, `Task imported: ${e.detail.name}`]);
    };

    eventBus.on("task:created", handleCreate);
    eventBus.on("task:done", handleDone);
    eventBus.on("task:imported", handleImport);

    return () => {
      eventBus.off("task:created", handleCreate);
      eventBus.off("task:done", handleDone);
      eventBus.off("task:imported", handleImport);
    };
  }, []);

  return (
    <div style={{ textAlign: "left", marginTop: "1rem" }}>
      <h3>🔔 Події:</h3>
      <ul>
        {logs.slice(-10).map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

export default Logger;
