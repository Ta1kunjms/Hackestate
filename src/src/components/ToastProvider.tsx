import React, { createContext, useContext, useState, useCallback } from 'react';

export type Toast = {
  id: number;
  message: string;
};

const ToastContext = createContext<
  | {
      showToast: (message: string) => void;
    }
  | undefined
>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 3000,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            style={{
              background: '#1976d2',
              color: '#fff',
              borderRadius: 10,
              padding: '14px 28px',
              fontWeight: 500,
              fontSize: 16,
              boxShadow: '0 4px 24px rgba(25,118,210,0.18)',
              minWidth: 180,
              maxWidth: 340,
              opacity: 1,
              transition: 'opacity 0.5s',
              cursor: 'pointer',
            }}
            onClick={() =>
              setToasts(prev => prev.filter(t => t.id !== toast.id))
            }
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
