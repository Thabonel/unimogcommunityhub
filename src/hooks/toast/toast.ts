
import { ToastOptions } from "./types";
import { addToast, dismissToast } from "./toast-store";

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

// Generate unique ID for each toast
function genId() {
  return Math.random().toString(36).substring(2, 9);
}
