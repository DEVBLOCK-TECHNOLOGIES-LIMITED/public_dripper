import React from "react";
import Toast from "./Toast";

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {/* 
        pointer-events-none on container allows clicks to pass through empty space.
        pointer-events-auto is needed on individual toasts (handled by default on div) 
      */}
      <div className="flex flex-col gap-3 w-full pointer-events-auto">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} removeToast={removeToast} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
