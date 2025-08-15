import { X } from "lucide-react";
import * as React from "react";
import ReactDOM from "react-dom";
import { cn } from "../../../lib/utils";

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "success";
  onClose?: () => void;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant = "default", onClose, children, ...props }, ref) => {
    const variantClasses = {
      default: "bg-gray-800 border-gray-700 text-gray-200",
      destructive: "bg-red-900/20 border-red-800 text-red-400",
      success: "bg-green-900/20 border-green-800 text-green-400",
    };

    const toastContent = (
      <div
        ref={ref}
        className={cn(
          "absolute top-4 right-4 rounded-lg border p-4 shadow-lg",
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );

    return ReactDOM.createPortal(toastContent, document.body);
  }
);
Toast.displayName = "Toast";

export { Toast };
