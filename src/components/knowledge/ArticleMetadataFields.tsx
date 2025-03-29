
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link as LinkIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types/article";

interface ArticleMetadataFieldsProps {
  form: UseFormReturn<ArticleFormValues>;
}

export function ArticleMetadataFields({ form }: ArticleMetadataFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Article Title</FormLabel>
            <FormControl>
              <Input placeholder="Enter a descriptive title" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Adventures">Adventures</SelectItem>
                <SelectItem value="Modifications">Modifications</SelectItem>
                <SelectItem value="Tyres">Tyres</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Select the most appropriate category for your article
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="excerpt"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Summary</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Write a brief summary of your article" 
                className="h-20"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="sourceUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source URL (Optional)</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <LinkIcon className="w-4 h-4 mr-2 text-muted-foreground" />
                <Input placeholder="https://facebook.com/groups/unimog/..." {...field} />
              </div>
            </FormControl>
            <FormDescription>
              If you're sharing content from Facebook or another site, please include the original link
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
