import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastMessage } from '../types';

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info', title: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info', title: string) => {
    const id = Date.now().toString();
    const newToast: ToastMessage = { id, message, type, title };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-[300px] max-w-md p-4 rounded-lg shadow-2xl
              transform transition-all duration-300 ease-in-out
              animate-fade-in backdrop-blur-sm
              ${toast.type === 'success' ? 'bg-green-500/90 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
              ${toast.type === 'info' ? 'bg-blue-500/90 text-white' : ''}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-1">{toast.title}</h4>
                <p className="text-sm opacity-90">{toast.message}</p>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-white hover:opacity-70 transition-opacity"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
