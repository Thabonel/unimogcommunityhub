
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface ManualHeaderProps {
  openSubmissionDialog: () => void;
  adminCount?: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
}

export function ManualHeader({ 
  openSubmissionDialog, 
  adminCount, 
  activeTab, 
  setActiveTab,
  isAdmin 
}: ManualHeaderProps) {
  return (
    <>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/knowledge">Knowledge Base</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Vehicle Manuals</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <Button variant="outline" className="mb-4" asChild>
            <Link to="/knowledge">
              <ArrowLeft size={16} className="mr-2" />
              Back to Knowledge Base
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-unimog-800 dark:text-unimog-200 mb-2">
            Vehicle Manuals
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Access official Unimog technical documentation, owner's manuals, and service guides.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={openSubmissionDialog} className="gap-2">
            <Upload size={16} />
            Submit Manual
          </Button>

          {isAdmin && adminCount && adminCount > 0 && (
            <Button 
              onClick={() => setActiveTab('pending')} 
              variant={activeTab === 'pending' ? 'default' : 'outline'} 
              className="gap-2"
            >
              <span>Admin Review</span>
              <span className="bg-primary-foreground text-primary ml-1 px-1.5 py-0.5 rounded-full text-xs">
                {adminCount}
              </span>
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
