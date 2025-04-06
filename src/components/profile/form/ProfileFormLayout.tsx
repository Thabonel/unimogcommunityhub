
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PreviewToggle from './PreviewToggle';

interface ProfileFormLayoutProps {
  children: ReactNode;
  title?: string;
  showPreview: boolean;
  onTogglePreview: () => void;
}

const ProfileFormLayout = ({ 
  children, 
  title = "Edit Profile", 
  showPreview, 
  onTogglePreview 
}: ProfileFormLayoutProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <PreviewToggle 
          showPreview={showPreview} 
          onToggle={onTogglePreview} 
        />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileFormLayout;
