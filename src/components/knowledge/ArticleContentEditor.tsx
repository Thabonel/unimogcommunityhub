
import { FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { ArticleFormValues } from "./types/article";
import { ContentTextarea } from "./editor/ContentTextarea";
import { EditorFormField } from "./editor/EditorFormField";

interface ArticleContentEditorProps {
  form: UseFormReturn<ArticleFormValues>;
}

export function ArticleContentEditor({ form }: ArticleContentEditorProps) {
  return (
    <EditorFormField
      form={form}
      name="content"
      label="Content"
    >
      <ContentTextarea
        value={form.watch("content")}
        onChange={(value) => form.setValue("content", value, { shouldValidate: true })}
      />
      <FormMessage />
    </EditorFormField>
  );
}
