
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface ManualFormFieldsProps {
  form: UseFormReturn<any>;
}

export function ManualFormFields({ form }: ManualFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter manual title" {...field} />
            </FormControl>
            <FormDescription>
              Name of the manual (e.g. "U1700L Electrical Systems Guide")
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter a brief description of the manual" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Explain what information the manual contains
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
