
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface PaymentInfoNoticeProps {
  className?: string;
}

export const PaymentInfoNotice: React.FC<PaymentInfoNoticeProps> = ({ className = '' }) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    const stored = localStorage.getItem('payment_info_notice_dismissed');
    return stored === 'true';
  });

  if (isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem('payment_info_notice_dismissed', 'true');
    setIsDismissed(true);
  };

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-6 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Connect directly with sellers to arrange payment and pickup. The Unimog Marketplace facilitates connections between buyers and sellers - all transactions are handled directly between parties.
          </p>
        </div>
        <button 
          type="button" 
          className="flex-shrink-0 ml-2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
          onClick={handleDismiss}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
