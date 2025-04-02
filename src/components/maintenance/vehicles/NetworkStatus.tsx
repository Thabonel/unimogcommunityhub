
import { Wifi, WifiOff } from 'lucide-react';

interface NetworkStatusProps {
  status: 'online' | 'offline' | 'checking';
}

export default function NetworkStatus({ status }: NetworkStatusProps) {
  if (status === 'offline') {
    return (
      <span className="text-xs flex items-center text-amber-500 mr-2">
        <WifiOff size={12} className="mr-1" />
        Offline
      </span>
    );
  }
  
  if (status === 'online') {
    return (
      <span className="text-xs flex items-center text-green-500 mr-2">
        <Wifi size={12} className="mr-1" />
        Connected
      </span>
    );
  }
  
  return null;
}
