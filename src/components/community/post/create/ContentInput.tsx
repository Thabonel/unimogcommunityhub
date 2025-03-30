
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserProfile } from '@/types/user';
import CharacterCounter from './CharacterCounter';

interface ContentInputProps {
  content: string;
  profile: UserProfile | null;
  maxChars: number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ContentInput = ({ content, profile, maxChars, onChange }: ContentInputProps) => {
  const getInitials = () => {
    if (profile?.display_name) {
      return profile.display_name.substring(0, 2).toUpperCase();
    } else if (profile?.full_name) {
      return profile.full_name.substring(0, 2).toUpperCase();
    } else {
      return 'UN';
    }
  };
  
  return (
    <div className="flex space-x-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={profile?.avatar_url || undefined} alt="User avatar" />
        <AvatarFallback>{getInitials()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea 
          placeholder="What's on your mind?" 
          className="resize-none flex-1"
          value={content}
          onChange={onChange}
        />
        <CharacterCounter charCount={content.length} maxChars={maxChars} />
      </div>
    </div>
  );
};

export default ContentInput;
