
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isEmailBlocked } from "@/utils/emailBlockOperations";
import { toast } from "@/hooks/use-toast";

interface BlockEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (email: string, reason: string) => void;
}

export function BlockEmailDialog({ open, onOpenChange, onConfirm }: BlockEmailDialogProps) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  
  const handleSubmit = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to block",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsChecking(true);
      const isBlocked = await isEmailBlocked(email);
      
      if (isBlocked) {
        toast({
          title: "Already blocked",
          description: "This email address is already blocked",
          variant: "destructive",
        });
        setIsChecking(false);
        return;
      }
      
      onConfirm(email, reason);
      setEmail("");
      setReason("");
    } catch (error) {
      console.error("Error checking email:", error);
      toast({
        title: "Error",
        description: "Could not check if email is already blocked",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Block Email Address</AlertDialogTitle>
          <AlertDialogDescription>
            This will prevent new users from registering with this email address.
            Existing users with this email will still be able to log in.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to block"
              type="email"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for blocking this email"
              rows={3}
            />
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isChecking || !email}
          >
            {isChecking ? "Checking..." : "Block Email"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
