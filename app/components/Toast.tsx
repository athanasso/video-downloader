"use client";

import { useEffect, useState, memo, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { ToastMessage } from "@/app/types/video";

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
} as const;

const colorMap = {
  success: "from-green-500/20 to-green-600/20 border-green-500/30",
  error: "from-red-500/20 to-red-600/20 border-red-500/30",
  info: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  warning: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
} as const;

const iconColorMap = {
  success: "text-green-400",
  error: "text-red-400",
  info: "text-blue-400",
  warning: "text-yellow-400",
} as const;

/**
 * Individual toast notification component
 * Memoized for performance
 */
const Toast = memo(function Toast({ toast, onDismiss }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = iconMap[toast.type];

  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl
        bg-gradient-to-r ${colorMap[toast.type]}
        backdrop-blur-lg border
        shadow-lg max-w-md
        ${isExiting ? "toast-exit" : "toast-enter"}
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColorMap[toast.type]}`} />
      <p className="text-sm text-white flex-1">{toast.message}</p>
      <button
        onClick={handleDismiss}
        className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
});

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

/**
 * Container component for toast notifications
 */
const ToastContainer = memo(function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
});

export default ToastContainer;

