import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase-client';
import { useAuthStore } from '@/stores/auth-store';
import { Vehicle } from '@/hooks/vehicle-maintenance/types';
import {
  ExpenseList,
  ExpenseUploadModal,
  ReceiptViewer,
  useExpenseUpload,
  type ExpenseRecord,
  type ExpenseReceipt,
  type ExpenseFormValues,
} from './index';

interface ExpenseTrackingSectionProps {
  vehicleId?: string;
  vehicles: Vehicle[];
}

export const ExpenseTrackingSection: React.FC<ExpenseTrackingSectionProps> = ({
  vehicleId,
  vehicles,
}) => {
  const user = useAuthStore((state) => state.user);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);
  const [selectedReceipts, setSelectedReceipts] = useState<ExpenseReceipt[]>([]);

  const { uploadFiles, deleteFile, getPublicUrl } = useExpenseUpload();

  const { data: expenses = [], refetch: refetchExpenses, isLoading } = useQuery({
    queryKey: ['expenses', vehicleId],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('expense_records')
        .select('*')
        .eq('user_id', user.id)
        .order('expense_date', { ascending: false });

      if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch expenses:', error);
        throw error;
      }

      return data as ExpenseRecord[];
    },
    enabled: !!user,
  });

  const { data: receiptCounts = {} } = useQuery({
    queryKey: ['receipt-counts', expenses.map((e) => e.id).join(',')],
    queryFn: async () => {
      if (expenses.length === 0) return {};

      const { data, error } = await supabase
        .from('expense_receipts')
        .select('expense_id');

      if (error) throw error;

      return data.reduce(
        (acc, r: any) => {
          acc[r.expense_id] = (acc[r.expense_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
    },
    enabled: expenses.length > 0,
  });

  const { data: receipts = [] } = useQuery({
    queryKey: ['receipts', selectedExpense?.id],
    queryFn: async () => {
      if (!selectedExpense) return [];

      const { data, error } = await supabase
        .from('expense_receipts')
        .select('*')
        .eq('expense_id', selectedExpense.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data as ExpenseReceipt[];
    },
    enabled: !!selectedExpense,
  });

  const { mutate: createExpense, isPending: isCreating } = useMutation({
    mutationFn: async (vars: {
      data: ExpenseFormValues;
      files: File[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      const expenseDateStr = vars.data.expense_date
        .toISOString()
        .split('T')[0];

      const { data: expense, error: expenseError } = await supabase
        .from('expense_records')
        .insert({
          vehicle_id: vars.data.vehicle_id,
          user_id: user.id,
          amount: vars.data.amount,
          currency: vars.data.currency,
          category: vars.data.category,
          description: vars.data.description,
          expense_date: expenseDateStr,
          notes: vars.data.notes || null,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      if (vars.files.length > 0) {
        const { files: uploadedPaths, errors: uploadErrors } = await uploadFiles(
          vars.files,
          expense.id
        );

        if (uploadErrors.length > 0) {
          console.warn('Some files failed to upload:', uploadErrors);
        }

        if (uploadedPaths.length > 0) {
          const receipts = uploadedPaths.map((path: string, idx: number) => ({
            expense_id: expense.id,
            file_name: vars.files[idx].name,
            file_type: vars.files[idx].type,
            file_size: vars.files[idx].size,
            storage_path: path,
            is_primary: idx === 0,
          }));

          const { error: receiptError } = await supabase
            .from('expense_receipts')
            .insert(receipts);

          if (receiptError) throw receiptError;
        }
      }

      return expense;
    },
    onSuccess: () => {
      setModalOpen(false);
      setSelectedExpense(null);
      refetchExpenses();
    },
    onError: (error: any) => {
      console.error('Failed to create expense:', error);
    },
  });

  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: async (expense: ExpenseRecord) => {
      const { error } = await supabase
        .from('expense_records')
        .delete()
        .eq('id', expense.id);

      if (error) throw error;
    },
    onSuccess: () => {
      setSelectedExpense(null);
      refetchExpenses();
    },
  });

  const { mutate: deleteReceipt } = useMutation({
    mutationFn: async (receipt: ExpenseReceipt) => {
      const { success } = await deleteFile(receipt.storage_path);
      if (!success) throw new Error('Failed to delete file');

      const { error } = await supabase
        .from('expense_receipts')
        .delete()
        .eq('id', receipt.id);

      if (error) throw error;
    },
    onSuccess: () => {
      if (selectedExpense) {
        const { refetch } = useQuery({
          queryKey: ['receipts', selectedExpense.id],
        });
        refetch();
      }
    },
  });

  const handleViewReceipts = (expense: ExpenseRecord) => {
    setSelectedExpense(expense);
    setViewerOpen(true);
  };

  const handleDeleteExpense = (expense: ExpenseRecord) => {
    if (confirm('Delete this expense and all its receipts?')) {
      deleteExpense(expense);
    }
  };

  const handleSubmitExpense = (data: ExpenseFormValues, files: File[]) => {
    return new Promise<void>((resolve, reject) => {
      createExpense(
        { data, files },
        {
          onSuccess: () => resolve(),
          onError: reject,
        }
      );
    });
  };

  return (
    <div className="space-y-6">
      <ExpenseList
        expenses={expenses}
        receiptCounts={receiptCounts}
        selectedVehicleId={vehicleId}
        isLoading={isLoading}
        onAddExpense={() => setModalOpen(true)}
        onEdit={(expense) => {
          setSelectedExpense(expense);
          setModalOpen(true);
        }}
        onDelete={handleDeleteExpense}
        onViewReceipts={handleViewReceipts}
      />

      <ExpenseUploadModal
        isOpen={modalOpen}
        vehicles={vehicles}
        isLoading={isCreating}
        onSubmit={handleSubmitExpense}
        onClose={() => {
          setModalOpen(false);
          setSelectedExpense(null);
        }}
      />

      <ReceiptViewer
        isOpen={viewerOpen}
        receipts={receipts}
        onClose={() => {
          setViewerOpen(false);
          setSelectedExpense(null);
        }}
        onDelete={(receipt) => {
          if (confirm('Delete this receipt?')) {
            deleteReceipt(receipt);
          }
        }}
        publicUrlGetter={getPublicUrl}
      />
    </div>
  );
};
