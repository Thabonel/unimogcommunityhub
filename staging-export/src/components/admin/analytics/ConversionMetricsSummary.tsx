
import React from 'react';

interface ConversionMetricsSummaryProps {
  signupRate: number;
  trialConversionRate: number;
  subscriptionConversionRate: number;
}

export const ConversionMetricsSummary: React.FC<ConversionMetricsSummaryProps> = ({
  signupRate,
  trialConversionRate,
  subscriptionConversionRate
}) => {
  return (
    <div className="text-sm font-medium mt-2 sm:mt-0">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-muted-foreground">Signup Rate</div>
          <div className="text-xl">{signupRate.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">Trial Rate</div>
          <div className="text-xl">{trialConversionRate.toFixed(1)}%</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground">Subscription Rate</div>
          <div className="text-xl">{subscriptionConversionRate.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
};
