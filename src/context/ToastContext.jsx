import React, { createContext, useContext, useState, useCallback } from "react";
import ToastContainer from "../components/Toast/ToastContainer";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Add a new toast
  const addToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = Date.now().toString();
      setToasts((prev) => [...prev, { id, message, type, duration }]);

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast],
  );

  // Helper methods
  const toast = {
    success: (msg, options) => addToast(msg, "success", options?.autoClose),
    error: (msg, options) => addToast(msg, "error", options?.autoClose),
    info: (msg, options) => addToast(msg, "info", options?.autoClose),
    warning: (msg, options) => addToast(msg, "warning", options?.autoClose),
  };

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};
