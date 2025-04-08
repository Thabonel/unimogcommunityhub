
import { ToastOptions } from "./types";
import { addToast } from "./toast-store";

// Function to create and manage toasts
export function toast(props: ToastOptions) {
  const id = Math.random().toString(36).substring(2, 9);
  
  addToast({
    id,
    ...props,
    open: true,
    onOpenChange: (open) => {
      if (!open) {
        // This will be handled by the dismiss function in useToast
      }
    },
  });

  return {
    id,
    dismiss: () => document.dispatchEvent(new CustomEvent(`toast-dismiss-${id}`)),
    update: (props: ToastOptions) => document.dispatchEvent(new CustomEvent(`toast-update-${id}`, { detail: props })),
  };
}
