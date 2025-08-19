
import { FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ContentTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ContentTextarea({ 
  value, 
  onChange, 
  placeholder = "Write your full article content here", 
  className = "h-60"
}: ContentTextareaProps) {
  return (
    <FormControl>
      <Textarea 
        placeholder={placeholder} 
        className={className}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}
