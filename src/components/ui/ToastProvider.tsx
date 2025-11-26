import React, { createContext, useContext, useState } from "react";

type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<any>(null);
export const useToast = () => useContext(ToastContext);

export default function ToastProvider({ children }: any) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = (message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      <div className="fixed top-5 right-5 space-y-3 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`px-5 py-3 rounded-lg shadow-md text-white ${
              t.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
