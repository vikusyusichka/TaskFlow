import React, { useEffect, useState } from "react";
import { eventBus } from "../utils/eventBus";

function Toast() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const show = (e) => {
      setMessage(`✅ Задача створена!`);
      setTimeout(() => setMessage(null), 3000);
    };

    eventBus.on("task:created", show);
    return () => eventBus.off("task:created", show);
  }, []);

  if (!message) return null;

  return (
    <div style={{
      position: "fixed",
      top: "1rem",
      right: "1rem",
      background: "#4caf50",
      color: "white",
      padding: "1rem 1.5rem",
      borderRadius: "10px",
      boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      zIndex: 9999,
    }}>
      {message}
    </div>
  );
}

export default Toast;
