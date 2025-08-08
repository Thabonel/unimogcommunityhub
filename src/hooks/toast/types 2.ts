
import { ToastActionElement } from "@/components/ui/toast";

export type ToastType = {
  id: string;
  open: boolean;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "success" | "warning";
  onOpenChange?: (open: boolean) => void;
};

export interface ToastOptions {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "success" | "warning";
}
