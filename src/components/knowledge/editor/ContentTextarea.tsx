
import { FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface ContentTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ContentTextarea({ 
  value, 
  onChange, 
  placeholder = "Write your full article content here using Markdown formatting...", 
  className = "h-60"
}: ContentTextareaProps) {
  return (
    <div className="space-y-4">
      <FormControl>
        <Textarea 
          placeholder={placeholder} 
          className={className}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </FormControl>
      
      {/* Markdown help */}
      <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <CardContent className="p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium">
                Markdown Formatting Supported:
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">**bold**</Badge>
                <Badge variant="outline" className="text-xs">*italic*</Badge>
                <Badge variant="outline" className="text-xs"># Headers</Badge>
                <Badge variant="outline" className="text-xs">[link](url)</Badge>
                <Badge variant="outline" className="text-xs">- Lists</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
