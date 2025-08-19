import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastCounter = 0;
const toasts: Toast[] = [];
const listeners: Set<() => void> = new Set();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export function toast(options: Omit<Toast, 'id'>) {
  const id = `toast-${++toastCounter}`;
  const newToast = { ...options, id };
  toasts.push(newToast);
  notifyListeners();
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
      notifyListeners();
    }
  }, 5000);
}

export function useToast() {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const listener = () => forceUpdate({});
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  
  return {
    toast,
    toasts: [...toasts],
    dismiss: (id: string) => {
      const index = toasts.findIndex(t => t.id === id);
      if (index !== -1) {
        toasts.splice(index, 1);
        notifyListeners();
      }
    },
  };
}