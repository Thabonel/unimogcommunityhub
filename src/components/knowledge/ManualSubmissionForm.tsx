
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { FileUploadField } from "./FileUploadField";
import { ManualFormFields } from "./ManualFormFields";
import { UploadProgressBar, SubmitButton } from "./UploadProgressBar";
import { useManualSubmission } from "@/hooks/use-manual-submission";
import { ManualFormValues } from "@/types/manuals";

const manualFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string(),
  fileName: z.string().optional(),
});

interface ManualSubmissionFormProps {
  onSubmitSuccess: () => void;
}

export function ManualSubmissionForm({ onSubmitSuccess }: ManualSubmissionFormProps) {
  const form = useForm<z.infer<typeof manualFormSchema>>({
    resolver: zodResolver(manualFormSchema),
    defaultValues: {
      title: "",
      description: "",
      fileName: "",
    },
  });
  
  const {
    isUploading,
    uploadProgress,
    handleFileSelect,
    handleSubmit
  } = useManualSubmission({ onSubmitSuccess });

  const onSubmit = (data: z.infer<typeof manualFormSchema>) => {
    handleSubmit(data as ManualFormValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ManualFormFields form={form} />
        <FileUploadField form={form} onFileSelected={handleFileSelect} />

        {isUploading && uploadProgress > 0 && (
          <UploadProgressBar 
            isUploading={isUploading} 
            progress={uploadProgress} 
          />
        )}

        <SubmitButton isUploading={isUploading} />
      </form>
    </Form>
  );
}
