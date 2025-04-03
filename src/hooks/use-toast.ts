
import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 20;
export type ToastType = Toast;

interface ToastOptions {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "success" | "warning";
}

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

let toasts: ToastType[] = [];

let listeners: ((toasts: ToastType[]) => void)[] = [];

function addToast(toast: ToastType) {
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

function dismissToast(id: string) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, open: false } : t));
  
  listeners.forEach((listener) => {
    listener(toasts);
  });
}

function updateToast(id: string, props: ToastProps) {
  toasts = toasts.map((t) => (t.id === id ? { ...t, ...props } : t));
  
  listeners.forEach((listener) => {
    listener(toasts);
  });
}

export function useToast() {
  return {
    toasts,
    toast: (opts: ToastOptions) => {
      const id = genId();
      
      return addToast({
        id,
        open: true,
        ...opts,
        variant: opts.variant || "default",
        onOpenChange: (open) => {
          if (!open) dismissToast(id);
        },
      });
    },
    dismiss: (toastId?: string) => {
      if (toastId) {
        dismissToast(toastId);
      }
    },
    update: (id: string, props: ToastProps) => {
      updateToast(id, props);
    },
  };
}

export function toast(opts: ToastOptions) {
  const id = genId();
  
  return addToast({
    id,
    open: true,
    ...opts,
    variant: opts.variant || "default",
    onOpenChange: (open) => {
      if (!open) dismissToast(id);
    },
  });
}
