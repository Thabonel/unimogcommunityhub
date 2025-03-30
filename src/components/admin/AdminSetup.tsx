
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Loader2 } from "lucide-react";
import { makeYourselfAdmin } from "@/utils/adminUtils";

const AdminSetup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMakeAdmin = async () => {
    setIsLoading(true);
    try {
      await makeYourselfAdmin();
    } finally {
      setIsLoading(false);
    }
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
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
};

export default AdminSetup;
