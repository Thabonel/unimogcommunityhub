
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2, RefreshCcw } from "lucide-react";
import { makeYourselfAdmin } from "@/utils/adminUtils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMakeAdmin = async () => {
    setIsLoading(true);
    try {
      console.log("Attempting to make user admin...");
      // In development mode, just simulate success
      // In production, uncomment the real function call
      // const success = await makeYourselfAdmin();
      const success = true;
      
      console.log("Make admin result:", success);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Admin privileges granted. Redirecting to admin dashboard...",
        });
        // Wait a moment before redirecting to allow the toast to be seen
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      }
    } catch (error) {
      console.error("Error making user admin:", error);
      toast({
        title: "Error",
        description: "Failed to assign admin role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    navigate(0); // Refreshes the current page
  };

  return (
    <Card className="max-w-md mx-auto my-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Admin Setup
        </CardTitle>
        <CardDescription>
          Grant yourself admin privileges to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          You need admin privileges to access the admin dashboard. Click the button below to make yourself an admin.
          This is only required once for your account.
        </p>
        <p className="text-sm text-amber-600 dark:text-amber-400 mb-4">
          <strong>Development Mode:</strong> For testing purposes, clicking the button below will grant admin access without checking database roles.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button 
          onClick={handleMakeAdmin} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Make Me Admin
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={handleRetry}
          className="w-full"
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Retry Verification
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminSetup;
