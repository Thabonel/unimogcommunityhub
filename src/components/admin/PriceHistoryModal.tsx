import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';

interface PriceHistoryModalProps {
  productId: string;
  productTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface PriceHistoryRecord {
  id: string;
  old_price: number;
  new_price: number;
  currency: string;
  price_change_percent: number;
  detected_at: string;
}

export function PriceHistoryModal({ productId, productTitle, open, onOpenChange }: PriceHistoryModalProps) {
  const [priceHistory, setPriceHistory] = useState<PriceHistoryRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && productId) {
      loadPriceHistory();
    }
  }, [open, productId]);

  const loadPriceHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_price_history')
        .select('*')
        .eq('product_id', productId)
        .order('detected_at', { ascending: true })
        .limit(100);

      if (error) throw error;

      setPriceHistory(data || []);
    } catch (err) {
      console.error('Error loading price history:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = priceHistory.map(record => ({
    date: new Date(record.detected_at).toLocaleDateString(),
    price: parseFloat(record.new_price.toString()),
    change: record.price_change_percent
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Price History: {productTitle}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">Loading price history...</div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No price history available yet
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 max-h-60 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Date</th>
                    <th className="text-right p-2">Old Price</th>
                    <th className="text-right p-2">New Price</th>
                    <th className="text-right p-2">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {priceHistory.map(record => (
                    <tr key={record.id} className="border-b">
                      <td className="p-2">{new Date(record.detected_at).toLocaleString()}</td>
                      <td className="text-right p-2">{record.currency} {record.old_price}</td>
                      <td className="text-right p-2">{record.currency} {record.new_price}</td>
                      <td className={`text-right p-2 ${record.price_change_percent < 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {record.price_change_percent > 0 ? '+' : ''}{record.price_change_percent.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
