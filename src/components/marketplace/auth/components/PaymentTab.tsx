
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export const PaymentTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border p-4 rounded-md">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              </div>
              <div>
                <p className="font-medium">•••• •••• •••• 4242</p>
                <p className="text-sm text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Default</span>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-2">Billing Address</h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>John Doe</p>
            <p>123 Main Street</p>
            <p>Apt 4B</p>
            <p>New York, NY 10001</p>
            <p>United States</p>
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            Update Billing Address
          </Button>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-lg font-medium mb-4">Transaction Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Default Currency</p>
                <p className="text-sm text-muted-foreground">
                  Used for all transactions
                </p>
              </div>
              <div>
                <span className="px-3 py-1 bg-muted rounded">USD</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Save Payment Info</p>
                <p className="text-sm text-muted-foreground">
                  Securely store payment details for future transactions
                </p>
              </div>
              <Switch checked={true} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
