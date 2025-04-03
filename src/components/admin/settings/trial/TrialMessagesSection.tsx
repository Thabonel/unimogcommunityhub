
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SettingsTooltip } from "../SettingsTooltip";

interface TrialMessagesSectionProps {
  customTrialMessage: string;
  trialEndMessage: string;
  onCustomMessageChange: (value: string) => void;
  onEndMessageChange: (value: string) => void;
}

export function TrialMessagesSection({
  customTrialMessage,
  trialEndMessage,
  onCustomMessageChange,
  onEndMessageChange
}: TrialMessagesSectionProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="customTrialMessage">
          Trial Welcome Message
          <SettingsTooltip content="Message shown to users when they start a trial" />
        </Label>
        <Textarea 
          id="customTrialMessage" 
          value={customTrialMessage}
          onChange={(e) => onCustomMessageChange(e.target.value)}
          placeholder="Enter custom trial message"
          rows={2}
        />
        <p className="text-xs text-muted-foreground">
          Use {`{{duration}}`} to include the trial duration in days
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="trialEndMessage">
          Trial Ending Message
          <SettingsTooltip content="Message shown to users when their trial is about to end" />
        </Label>
        <Textarea 
          id="trialEndMessage" 
          value={trialEndMessage}
          onChange={(e) => onEndMessageChange(e.target.value)}
          placeholder="Enter trial ending message"
          rows={2}
        />
      </div>
    </>
  );
}
