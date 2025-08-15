import { useState } from "react";
import { createPortal } from "react-dom";
import type { ToastProps } from "../ui/toast/toast";
import { Toast } from "../ui/toast/toast";

interface ToastOptions extends Omit<ToastProps, "children"> {
  message: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const showToast = (options: ToastOptions) => {
    setToasts((prev) => [...prev, options]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast !== options));
    }, 3000);
  };

  const ToastContainer = () =>
    createPortal(
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast, index) => (
          <Toast
            key={index}
            variant={toast.variant}
            onClose={() =>
              setToasts((prev) => prev.filter((_, i) => i !== index))
            }
          >
            {toast.title && <strong>{toast.title}</strong>}
            <br />
            {toast.message}
          </Toast>
        ))}
      </div>,
      document.body
    );

  return { showToast, ToastContainer };
};
