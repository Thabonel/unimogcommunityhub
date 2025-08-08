
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import UnimogModelSelector from './UnimogModelSelector';

interface ProfileBasicInfoFieldsProps {
  formData: {
    name: string;
    email: string;
    unimogModel: string | null;
    unimogSeries?: string | null;
    unimogSpecs?: Record<string, any> | null;
    unimogFeatures?: string[] | null;
    website?: string;
    location: string;
  };
  isMasterUser: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onModelChange: (model: string, series: string, specs: Record<string, any>, features: string[]) => void;
}

const ProfileBasicInfoFields = ({ 
  formData, 
  isMasterUser, 
  onChange, 
  onModelChange 
}: ProfileBasicInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Display Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={onChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          name="email" 
          type="email"
          value={formData.email} 
          onChange={onChange}
          disabled={isMasterUser}
        />
        {isMasterUser && (
          <p className="text-xs text-muted-foreground">
            Email cannot be changed in demo mode
          </p>
        )}
      </div>
      
      <UnimogModelSelector
        currentModel={formData.unimogModel}
        onChange={onModelChange}
        disabled={false}
      />
      
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
          placeholder="e.g. myunimog.com"
        />
      </div>
    </div>
  );
};

export default ProfileBasicInfoFields;
