
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';

interface ProfileFormActionsProps {
  onCancel: () => void;
  isSaving: boolean;
}

const ProfileFormActions = ({ onCancel, isSaving }: ProfileFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSaving}
      >
        Cancel
      </Button>
      
      <Button 
        type="submit"
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" /> Save Changes
          </>
        )}
      </Button>
    </div>
  );
};

export default ProfileFormActions;
