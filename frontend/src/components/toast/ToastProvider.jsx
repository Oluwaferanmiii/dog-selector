import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

function ToastItem({ toast, onClose }) {
  const bg = toast.type === "success" ? "bg-success" : "bg-danger";

  return (
    <div
      className={`toast show ${bg} text-white`}
      role="alert"
      style={{
        width: 420,
        borderRadius: 6,
        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
      }}
    >
      <div className="toast-body d-flex align-items-center justify-content-between">
        <strong>{toast.message}</strong>
        <button
          type="button"
          className="btn-close btn-close-white ms-3"
          aria-label="Close"
          onClick={() => onClose(toast.id)}
        />
      </div>
    </div>
  );
}

function ToastViewport({ toasts, removeToast }) {
  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={removeToast} />
      ))}
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  function showToast(message, type = "success", timeoutMs = 3000) {
    const id = crypto.randomUUID?.() ?? String(Date.now() + Math.random());
    const toast = { id, message, type };

    setToasts((prev) => [...prev, toast]);

    window.setTimeout(() => {
      removeToast(id);
    }, timeoutMs);
  }

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider />");
  return ctx;
}