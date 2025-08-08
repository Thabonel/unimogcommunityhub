
import { ToastOptions } from "./types";
import { ToastProps } from "@/components/ui/toast";
import { 
  addToast, 
  dismissToast, 
  updateToast, 
  getToasts, 
  subscribe 
} from "./toast-store";
import { useState, useEffect } from "react";

export function useToast() {
  const [toasts, setToasts] = useState(() => getToasts());
  
  useEffect(() => {
    return subscribe(setToasts);
  }, []);
  
  function toast(opts: ToastOptions) {
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
  
  return {
    toasts,
    toast,
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

// Generate unique ID for each toast
function genId() {
  return Math.random().toString(36).substring(2, 9);
}
