import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Heart, Star, Crown } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

export function SupporterTierSelector() {
  const [selectedAmount, setSelectedAmount] = useState(15);
  const [customAmount, setCustomAmount] = useState('');
  const [isAnnual, setIsAnnual] = useState(false);
  const [publicName, setPublicName] = useState('');
  const [supporterMessage, setSupporterMessage] = useState('');
  const [showPublicly, setShowPublicly] = useState(true);
  const { subscribe } = useSubscription();

  const presetAmounts = [
    { amount: 5, label: 'Supporter', icon: Heart, description: 'Help keep the lights on' },
    { amount: 15, label: 'Patron', icon: Star, description: 'Fund new features', popular: true },
    { amount: 25, label: 'Champion', icon: Crown, description: 'Lead community growth' }
  ];

  const handleAmountChange = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 5) {
      setSelectedAmount(numValue);
      setCustomAmount(value);
    }
  };

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const annualAmount = finalAmount * 12;
  const annualSavings = annualAmount * 0.15; // 15% discount for annual

  const handleSubscribe = async () => {
    // This would integrate with Stripe for supporter subscriptions
    const result = await subscribe('supporter');
    if (result.success) {
      // Handle successful subscription
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Support the Community</h2>
        <p className="text-muted-foreground">
          Your support helps us maintain the platform, add new features, and keep everything ad-free.
          Thank you for being awesome! ❤️
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose Your Support Level</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preset Amounts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {presetAmounts.map((preset) => {
              const Icon = preset.icon;
              return (
                <Card
                  key={preset.amount}
                  className={`cursor-pointer transition-all ${
                    selectedAmount === preset.amount && !customAmount
                      ? 'border-primary shadow-md'
                      : 'hover:shadow-sm'
                  } ${preset.popular ? 'relative' : ''}`}
                  onClick={() => handleAmountChange(preset.amount)}
                >
                  {preset.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-primary">
                      Popular
                    </Badge>
                  )}
                  <CardContent className="pt-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-bold text-lg">${preset.amount}/mo</div>
                    <div className="text-sm font-medium text-primary">{preset.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {preset.description}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount">Or enter a custom amount (minimum $5)</Label>
            <Input
              id="custom-amount"
              type="number"
              min="5"
              step="1"
              placeholder="Enter amount in USD"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
            />
          </div>

          {/* Annual Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="annual-billing">Annual Billing</Label>
              <div className="text-sm text-muted-foreground">
                Save 15% with annual payment (${(finalAmount * 12 - annualSavings).toFixed(0)}/year)
              </div>
            </div>
            <Switch
              id="annual-billing"
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
            />
          </div>

          {/* Public Recognition */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="public-recognition">Show on public recognition page</Label>
              <Switch
                id="public-recognition"
                checked={showPublicly}
                onCheckedChange={setShowPublicly}
              />
            </div>

            {showPublicly && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="public-name">Public name (optional)</Label>
                  <Input
                    id="public-name"
                    placeholder="How should we recognize you publicly?"
                    value={publicName}
                    onChange={(e) => setPublicName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supporter-message">Support message (optional)</Label>
                  <Textarea
                    id="supporter-message"
                    placeholder="Leave a message for the community..."
                    value={supporterMessage}
                    onChange={(e) => setSupporterMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <div className="p-4 bg-primary/5 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-semibold">
                ${finalAmount}/month
              </span>
            </div>
            {isAnnual && (
              <>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Annual total:</span>
                  <span>${(finalAmount * 12).toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Annual savings:</span>
                  <span>-${annualSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>You pay:</span>
                  <span>${(finalAmount * 12 - annualSavings).toFixed(0)}/year</span>
                </div>
              </>
            )}
          </div>

          {/* Subscribe Button */}
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubscribe}
            disabled={finalAmount < 5}
          >
            <Heart className="h-4 w-4 mr-2" />
            Support with ${finalAmount}/{isAnnual ? 'year' : 'month'}
          </Button>

          <div className="text-xs text-center text-muted-foreground">
            You can cancel or change your support amount anytime. Powered by Stripe.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}