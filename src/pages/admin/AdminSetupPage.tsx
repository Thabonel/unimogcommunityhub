import { MakeAdminButton } from '@/components/admin/MakeAdminButton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold mb-2">Admin Setup</h1>
          <p className="text-gray-600">
            Set up admin access to manage manual processing and other admin features.
          </p>
        </div>

        <MakeAdminButton />
      </div>
    </div>
  );
}