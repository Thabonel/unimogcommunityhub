
import { Progress } from "@/components/ui/progress";

interface CharacterCounterProps {
  charCount: number;
  maxChars: number;
}

const CharacterCounter = ({ charCount, maxChars }: CharacterCounterProps) => {
  const charPercentage = (charCount / maxChars) * 100;
  const isOverLimit = charCount > maxChars;
  
  return (
    <div className="flex justify-between items-center mt-1">
      <div className="w-full max-w-xs">
        <Progress 
          value={charPercentage} 
          className={isOverLimit ? "bg-red-200" : ""}
        />
      </div>
      <span className={`text-xs ${isOverLimit ? "text-red-500 font-bold" : "text-muted-foreground"}`}>
        {charCount}/{maxChars} characters
      </span>
    </div>
  );
};

export default CharacterCounter;
