import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Search, Filter } from 'lucide-react';
import { ExpenseRecord, ExpenseCategory } from './types';
import { ExpenseCard } from './ExpenseCard';

interface ExpenseListProps {
  expenses: ExpenseRecord[];
  receiptCounts?: Record<string, number>;
  selectedVehicleId?: string;
  onAddExpense?: () => void;
  onEdit?: (expense: ExpenseRecord) => void;
  onDelete?: (expense: ExpenseRecord) => void;
  onViewReceipts?: (expense: ExpenseRecord) => void;
  isLoading?: boolean;
}

const expenseCategories: ExpenseCategory[] = [
  'fuel',
  'maintenance',
  'repair',
  'parts',
  'tires',
  'insurance',
  'registration',
  'toll',
  'parking',
  'accommodation',
  'camping',
  'equipment',
  'other',
];

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  receiptCounts = {},
  selectedVehicleId,
  onAddExpense,
  onEdit,
  onDelete,
  onViewReceipts,
  isLoading = false,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<'date' | 'amount'>('date');

  const filteredExpenses = React.useMemo(() => {
    let filtered = expenses;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.description.toLowerCase().includes(query) ||
          exp.notes?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((exp) => exp.category === selectedCategory);
    }

    if (selectedVehicleId) {
      filtered = filtered.filter((exp) => exp.vehicle_id === selectedVehicleId);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

    return filtered;
  }, [expenses, searchQuery, selectedCategory, selectedVehicleId, sortBy]);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const groupedByCurrency = filteredExpenses.reduce(
    (acc, exp) => {
      if (!acc[exp.currency]) acc[exp.currency] = 0;
      acc[exp.currency] += exp.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="h-24 bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold tracking-tight">Expenses</h2>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} expenses recorded
          </p>
        </div>

        {onAddExpense && (
          <Button onClick={onAddExpense} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        )}
      </div>

      {filteredExpenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(groupedByCurrency).map(([currency, amount]) => (
            <Card key={currency} className="p-4">
              <p className="text-sm text-muted-foreground">Total ({currency})</p>
              <p className="text-2xl font-bold">
                {currency} {amount.toFixed(2)}
              </p>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {expenseCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() +
                    category.slice(1).replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'date' | 'amount')}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Latest First</SelectItem>
              <SelectItem value="amount">Highest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <Card className="p-12 text-center">
          <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            {expenses.length === 0
              ? 'No expenses recorded yet'
              : 'No expenses match your filters'}
          </p>
          {onAddExpense && expenses.length === 0 && (
            <Button onClick={onAddExpense} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Record First Expense
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              receiptCount={receiptCounts[expense.id] || 0}
              onEdit={() => onEdit?.(expense)}
              onDelete={() => onDelete?.(expense)}
              onViewReceipts={() => onViewReceipts?.(expense)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
