
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { SettingsTooltip } from "./SettingsTooltip";
import { toast } from "@/hooks/use-toast";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

const defaultPlans: SubscriptionPlan[] = [
  {
    id: "plan_free",
    name: "Free",
    price: 0,
    billingCycle: "monthly",
    features: ["Basic access", "Community forums", "Limited articles"],
    isPopular: false,
    isActive: true,
  },
  {
    id: "plan_standard",
    name: "Standard",
    price: 9.99,
    billingCycle: "monthly",
    features: ["Full access", "No ads", "Download manuals", "Priority support"],
    isPopular: true,
    isActive: true,
  },
  {
    id: "plan_premium",
    name: "Premium",
    price: 19.99,
    billingCycle: "monthly",
    features: ["Everything in Standard", "API access", "Custom branding", "Dedicated support"],
    isPopular: false,
    isActive: true,
  }
];

export function PaymentPlansSection() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(defaultPlans);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSavePlan = (plan: SubscriptionPlan) => {
    if (editingPlan) {
      // Update existing plan
      setPlans(plans.map(p => p.id === plan.id ? plan : p));
      toast({
        title: "Plan updated",
        description: `${plan.name} plan has been updated successfully.`
      });
    } else {
      // Add new plan
      setPlans([...plans, { ...plan, id: `plan_${Date.now()}` }]);
      toast({
        title: "Plan created",
        description: `${plan.name} plan has been created successfully.`
      });
    }
    setIsDialogOpen(false);
    setEditingPlan(null);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(plan => plan.id !== id));
    toast({
      title: "Plan deleted",
      description: "The subscription plan has been deleted."
    });
  };

  const handleToggleActive = (id: string, isActive: boolean) => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, isActive } : plan
    ));
    const plan = plans.find(p => p.id === id);
    toast({
      title: isActive ? "Plan activated" : "Plan deactivated",
      description: `${plan?.name} plan has been ${isActive ? "activated" : "deactivated"}.`
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Subscription Plans</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditingPlan(null)}>
              <Plus className="h-4 w-4 mr-2" /> Add Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</DialogTitle>
              <DialogDescription>
                Configure the subscription plan details below.
              </DialogDescription>
            </DialogHeader>
            <PlanForm 
              initialPlan={editingPlan || {
                id: '',
                name: '',
                price: 0,
                billingCycle: 'monthly',
                features: [],
                isPopular: false,
                isActive: true
              }}
              onSave={handleSavePlan}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Billing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">
                  {plan.name}
                  {plan.isPopular && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full dark:bg-green-900/20 dark:text-green-400">
                      Popular
                    </span>
                  )}
                </TableCell>
                <TableCell>${plan.price.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{plan.billingCycle}</TableCell>
                <TableCell>
                  <Switch 
                    checked={plan.isActive} 
                    onCheckedChange={(checked) => handleToggleActive(plan.id, checked)}
                    aria-label={`${plan.name} status`}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => {
                      setEditingPlan(plan);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface PlanFormProps {
  initialPlan: SubscriptionPlan;
  onSave: (plan: SubscriptionPlan) => void;
  onCancel: () => void;
}

function PlanForm({ initialPlan, onSave, onCancel }: PlanFormProps) {
  const [plan, setPlan] = useState<SubscriptionPlan>({ ...initialPlan });
  const [newFeature, setNewFeature] = useState("");

  const handleChange = (field: keyof SubscriptionPlan, value: any) => {
    setPlan({ ...plan, [field]: value });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setPlan({ ...plan, features: [...plan.features, newFeature.trim()] });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = [...plan.features];
    updatedFeatures.splice(index, 1);
    setPlan({ ...plan, features: updatedFeatures });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(plan); }} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name</Label>
        <Input 
          id="name" 
          value={plan.name} 
          onChange={(e) => handleChange('name', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input 
            id="price" 
            type="number"
            min="0"
            step="0.01"
            value={plan.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="billingCycle">Billing Cycle</Label>
          <Select 
            value={plan.billingCycle}
            onValueChange={(value) => handleChange('billingCycle', value)}
          >
            <SelectTrigger id="billingCycle">
              <SelectValue placeholder="Select billing cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Features</Label>
          <div className="flex items-center space-x-2">
            <Input 
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature"
              className="w-64"
            />
            <Button type="button" size="sm" onClick={addFeature}>Add</Button>
          </div>
        </div>
        
        <ul className="border rounded-md p-2 min-h-[100px]">
          {plan.features.length === 0 && (
            <li className="text-muted-foreground text-sm p-2">No features added yet</li>
          )}
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center justify-between py-1">
              <span>{feature}</span>
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch 
          id="isPopular"
          checked={plan.isPopular}
          onCheckedChange={(checked) => handleChange('isPopular', checked)}
        />
        <Label htmlFor="isPopular" className="text-sm">Mark as popular plan</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="isActive"
          checked={plan.isActive}
          onCheckedChange={(checked) => handleChange('isActive', checked)}
        />
        <Label htmlFor="isActive" className="text-sm">Plan is active</Label>
      </div>

      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Plan</Button>
      </DialogFooter>
    </form>
  );
}
