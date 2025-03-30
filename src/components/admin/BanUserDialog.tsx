
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface BanUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (duration: number, reason?: string) => void;
}

export function BanUserDialog({ open, onOpenChange, onConfirm }: BanUserDialogProps) {
  const [banDuration, setBanDuration] = useState(30); // Default: 30 days
  const [banReason, setBanReason] = useState("");
  
  const handleSubmit = () => {
    onConfirm(banDuration, banReason.trim() || undefined);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ban User</AlertDialogTitle>
          <AlertDialogDescription>
            This will prevent the user from accessing the platform for the selected period.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-3">
            <Label htmlFor="ban-duration">Ban Duration</Label>
            <RadioGroup
              id="ban-duration"
              value={String(banDuration)}
              onValueChange={(value) => setBanDuration(Number(value))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="ban-day" />
                <Label htmlFor="ban-day">1 day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="7" id="ban-week" />
                <Label htmlFor="ban-week">7 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="30" id="ban-month" />
                <Label htmlFor="ban-month">30 days</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="365" id="ban-year" />
                <Label htmlFor="ban-year">1 year</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ban-reason">Reason (Optional)</Label>
            <Textarea 
              id="ban-reason"
              placeholder="Enter a reason for the ban..."
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit}
            className="bg-amber-600 text-white hover:bg-amber-700"
          >
            Ban User
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
