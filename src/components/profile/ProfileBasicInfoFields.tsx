
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileBasicInfoFieldsProps {
  formData: {
    name: string;
    email: string;
    unimogModel: string;
    location: string;
    website?: string;
  };
  isMasterUser: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileBasicInfoFields = ({ formData, isMasterUser, onChange }: ProfileBasicInfoFieldsProps) => {
  const { toast } = useToast();

  const handleRequestEmailChange = () => {
    toast({
      title: "Email change request",
      description: "For security reasons, please contact support to change your email address.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={onChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email} 
            onChange={onChange} 
            disabled={!isMasterUser}
            className="pr-10"
          />
          {!isMasterUser && (
            <Button 
              type="button" 
              variant="ghost" 
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2" 
              onClick={handleRequestEmailChange}
              title="Request email change"
            >
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
        {!isMasterUser && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" /> 
            For security, please contact support to change your email address
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="unimogModel">Unimog Model</Label>
        <Input 
          id="unimogModel" 
          name="unimogModel" 
          value={formData.unimogModel} 
          onChange={onChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input 
          id="location" 
          name="location" 
          value={formData.location} 
          onChange={onChange} 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input 
          id="website" 
          name="website" 
          value={formData.website || ''} 
          onChange={onChange} 
        />
      </div>
    </div>
  );
};

export default ProfileBasicInfoFields;
