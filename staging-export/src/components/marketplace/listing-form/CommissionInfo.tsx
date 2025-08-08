
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { commissionStructure } from '@/types/marketplace';

export function CommissionInfo() {
  return (
    <div className="mb-6 bg-amber-50 dark:bg-amber-950/30 rounded-md p-4 border border-amber-200 dark:border-amber-800">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
        <AlertCircle size={18} className="text-amber-600" />
        Commission Information
      </h2>
      <p className="text-sm text-muted-foreground mb-3">
        The Unimog Marketplace charges a {commissionStructure.percentage}% commission on all sales.
        This fee helps maintain our platform and provide secure transactions for all users.
      </p>
    </div>
  );
}
