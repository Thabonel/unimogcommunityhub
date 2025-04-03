
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { grantFreeAccess } from "@/utils/userUtils";
import { Checkbox } from "@/components/ui/checkbox";

interface GiveFreeMembershipDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function GiveFreeMembershipDialog({
  open,
  onOpenChange,
  onComplete
}: GiveFreeMembershipDialogProps) {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [isPermanent, setIsPermanent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await grantFreeAccess({
        email,
        reason,
        isPermanent
      });
      
      toast({
        title: "Free access granted",
        description: `${email} has been granted free access to the platform`
      });
      
      setEmail("");
      setReason("");
      setIsPermanent(false);
      onComplete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error granting free access:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to grant free access",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Grant Free Membership</DialogTitle>
          <DialogDescription>
            Grant a user free access to premium features without requiring payment.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why is this user being granted free access?"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="permanent" 
              checked={isPermanent} 
              onCheckedChange={(checked) => setIsPermanent(checked === true)}
            />
            <Label htmlFor="permanent" className="text-sm font-normal">
              Grant permanent access (no expiration)
            </Label>
          </div>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Granting Access..." : "Grant Access"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
