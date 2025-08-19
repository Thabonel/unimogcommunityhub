
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ReactNode } from "react";

interface EditorFormFieldProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  children: ReactNode;
}

export function EditorFormField({ 
  form, 
  name, 
  label, 
  children 
}: EditorFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          {children}
        </FormItem>
      )}
    />
  );
}
