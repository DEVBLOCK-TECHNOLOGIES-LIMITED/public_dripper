import React, { useEffect } from "react";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiX,
} from "react-icons/hi";

const Toast = ({ id, message, type, removeToast }) => {
  useEffect(() => {
    // Entrance animation handled by CSS/Tailwind class
  }, []);

  const styles = {
    success: {
      icon: <HiCheckCircle className="text-xl text-gold-500" />,
      border: "border-gold-500",
      bg: "bg-noir-900/95",
      text: "text-champagne-100",
    },
    error: {
      icon: <HiExclamationCircle className="text-xl text-rosegold-500" />,
      border: "border-rosegold-500",
      bg: "bg-noir-900/95",
      text: "text-champagne-100",
    },
    warning: {
      icon: <HiExclamationCircle className="text-xl text-gold-400" />,
      border: "border-gold-400",
      bg: "bg-noir-900/95",
      text: "text-champagne-100",
    },
    info: {
      icon: <HiInformationCircle className="text-xl text-champagne-400" />,
      border: "border-champagne-400",
      bg: "bg-noir-900/95",
      text: "text-champagne-100",
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className={`
        flex items-center gap-3 w-full max-w-sm p-4 rounded-xl shadow-2xl 
        border-l-4 ${currentStyle.border} ${currentStyle.bg} backdrop-blur-md
        transform transition-all duration-500 ease-in-out
        animate-slide-in-right hover:scale-[1.02] cursor-pointer
        relative overflow-hidden group
      `}
      onClick={() => removeToast(id)}
    >
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />

      {/* Icon */}
      <div className="shrink-0">{currentStyle.icon}</div>

      {/* Message */}
      <p className={`font-medium text-sm ${currentStyle.text} grow font-sans`}>
        {message}
      </p>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeToast(id);
        }}
        className="text-champagne-500 hover:text-white transition-colors p-1"
      >
        <HiX />
      </button>

      {/* Progress Bar (Optional, can add later) */}
    </div>
  );
};

export default Toast;
