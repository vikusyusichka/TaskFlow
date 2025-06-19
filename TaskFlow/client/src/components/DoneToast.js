import React, { useEffect, useState } from "react";
import { eventBus } from "../utils/eventBus";

function DoneToast() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const show = () => {
      setMessage("✔️ Задача виконана!");
      setTimeout(() => setMessage(null), 3000);
    };

    eventBus.on("task:done", show);
    return () => eventBus.off("task:done", show);
  }, []);

  if (!message) return null;

  return (
    <div style={{
      position: "fixed",
      top: "4.5rem",
      right: "1rem",
      background: "#2196f3",
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

export default DoneToast;
