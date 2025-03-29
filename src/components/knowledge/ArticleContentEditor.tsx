
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types/article";

interface ArticleContentEditorProps {
  form: UseFormReturn<ArticleFormValues>;
}

export function ArticleContentEditor({ form }: ArticleContentEditorProps) {
  return (
    <FormField
      control={form.control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Write your full article content here" 
              className="h-60"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
