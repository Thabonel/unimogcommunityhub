
import { ToastType, ToastOptions } from "./types";
import { ToastProps } from "@/components/ui/toast";

let count = 0;
let toasts: ToastType[] = [];
let listeners: ((toasts: ToastType[]) => void)[] = [];

const TOAST_LIMIT = 20;

// Generate unique ID for each toast
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

// Helper to check for duplicate toasts
function hasDuplicateToast(newToast: ToastType): boolean {
  return toasts.some(toast => 
    toast.title === newToast.title && 
    toast.description === newToast.description &&
    toast.open === true
  );
}

export function addToast(toast: ToastType) {
  // Check for duplicates before adding
  if (hasDuplicateToast(toast)) {
    return {
      id: toast.id,
      dismiss: () => dismissToast(toast.id),
      update: (props: ToastProps) => updateToast(toast.id, props),
    };
  }
  
  toasts = [toast, ...toasts].slice(0, TOAST_LIMIT);
  
  listeners.forEach((listener) => {
    listener(toasts);
  });
  
  return {
    id: toast.id,
    dismiss: () => dismissToast(toast.id),
    update: (props: ToastProps) => updateToast(toast.id, props),
  };
}

export function dismissToast(id: string) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
  
  listeners.forEach((listener) => {
    listener(toasts);
  });
}

export function updateToast(id: string, props: ToastProps) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, ...props } : t));
  
  listeners.forEach((listener) => {
    listener(toasts);
  });
}

export function getToasts() {
  return toasts;
}

export function subscribe(listener: (toasts: ToastType[]) => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}
