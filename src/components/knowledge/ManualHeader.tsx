
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ManualHeaderProps {
  openSubmissionDialog: () => void;
  adminCount?: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export function ManualHeader({
  openSubmissionDialog,
  adminCount = 0,
  activeTab,
  setActiveTab,
  isAdmin
}: ManualHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <div className="text-muted-foreground flex items-center gap-2 text-sm mb-6">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>&gt;</span>
        <Link to="/knowledge" className="hover:text-foreground">Knowledge Base</Link>
        <span>&gt;</span>
        <span className="text-foreground">Vehicle Manuals</span>
      </div>
      
      {/* Back button */}
      <Button
        variant="outline"
        size="sm"
        className="mb-6"
        as={Link}
        to="/knowledge"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Knowledge Base
      </Button>

      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Vehicle Manuals</h1>
        <p className="text-xl text-muted-foreground">
          Access official Unimog technical documentation, owner's manuals, and service guides.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isAdmin && (
            <div className="flex gap-2 items-center">
              <Button
                variant={activeTab === 'approved' ? 'default' : 'outline'}
                onClick={() => setActiveTab('approved')}
                className="font-medium"
              >
                Available Manuals
              </Button>
              <Button
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                onClick={() => setActiveTab('pending')}
                className="font-medium relative"
              >
                Pending Approval
                {adminCount > 0 && (
                  <span className="ml-2 bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full text-xs">
                    {adminCount}
                  </span>
                )}
              </Button>
            </div>
          )}
        </div>
        <Button onClick={openSubmissionDialog} className="ml-auto">
          Submit Manual
        </Button>
      </div>
    </div>
  );
}
