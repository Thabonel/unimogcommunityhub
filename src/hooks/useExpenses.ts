// React Hook for Expense Management
// Provides state management and real-time updates for expenses

import { useState, useEffect, useCallback } from 'react'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'
import {
  ExpenseService,
  type Expense,
  type CreateExpenseRequest,
  type ExpenseFilters,
  type ExpenseStats,
  type ExpenseCategory
} from '@/services/expense/ExpenseService'
import { toast } from 'sonner'

export interface UseExpensesOptions {
  filters?: ExpenseFilters
  autoRefresh?: boolean
  refreshInterval?: number
}

export function useExpenses(options: UseExpensesOptions = {}) {
  const { filters = {}, autoRefresh = false, refreshInterval = 30000 } = options
  const queryClient = useQueryClient()

  const expensesQuery = useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => ExpenseService.listExpenses(filters),
    refetchInterval: autoRefresh ? refreshInterval : false,
    staleTime: 5000
  })

  const categoriesQuery = useQuery({
    queryKey: ['expense-categories'],
    queryFn: () => ExpenseService.getCategories(),
    staleTime: 300000
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateExpenseRequest) => ExpenseService.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Expense created successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to create expense: ${error.message}`)
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateExpenseRequest> }) =>
      ExpenseService.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Expense updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update expense: ${error.message}`)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => ExpenseService.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Expense deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete expense: ${error.message}`)
    }
  })

  const uploadMutation = useMutation({
    mutationFn: ({ file, ocrProvider }: { file: File; ocrProvider?: 'google_vision' | 'unstructured' }) =>
      ExpenseService.uploadAndProcessInvoice(file, ocrProvider),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })

      if (result.ocrResult.requiresReview) {
        toast.warning('Invoice processed - review required', {
          description: `Confidence: ${result.ocrResult.invoiceData.confidence}%`
        })
      } else {
        toast.success('Invoice processed successfully', {
          description: `Extracted: ${result.ocrResult.invoiceData.vendorName}`
        })
      }
    },
    onError: (error: Error) => {
      toast.error(`Failed to process invoice: ${error.message}`)
    }
  })

  const reviewMutation = useMutation({
    mutationFn: ({
      expenseId,
      approved,
      corrections
    }: {
      expenseId: string
      approved: boolean
      corrections?: Partial<Expense>
    }) => ExpenseService.reviewExpense(expenseId, approved, corrections),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense reviewed successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to review expense: ${error.message}`)
    }
  })

  const markAsPaidMutation = useMutation({
    mutationFn: ({
      expenseId,
      paymentDate,
      paymentMethod
    }: {
      expenseId: string
      paymentDate: string
      paymentMethod: string
    }) => ExpenseService.markAsPaid(expenseId, paymentDate, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['expense-stats'] })
      toast.success('Expense marked as paid')
    },
    onError: (error: Error) => {
      toast.error(`Failed to mark as paid: ${error.message}`)
    }
  })

  return {
    expenses: expensesQuery.data?.expenses || [],
    pagination: expensesQuery.data?.pagination,
    categories: categoriesQuery.data || [],
    isLoading: expensesQuery.isLoading || categoriesQuery.isLoading,
    isError: expensesQuery.isError || categoriesQuery.isError,
    error: expensesQuery.error || categoriesQuery.error,
    createExpense: createMutation.mutate,
    isCreating: createMutation.isPending,
    updateExpense: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteExpense: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    uploadAndProcessInvoice: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    reviewExpense: reviewMutation.mutate,
    isReviewing: reviewMutation.isPending,
    markAsPaid: markAsPaidMutation.mutate,
    isMarkingPaid: markAsPaidMutation.isPending,
    refetch: expensesQuery.refetch
  }
}

export function useExpense(expenseId: string | null) {
  const queryClient = useQueryClient()

  const expenseQuery = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => {
      if (!expenseId) throw new Error('Expense ID required')
      return ExpenseService.getExpense(expenseId)
    },
    enabled: !!expenseId,
    staleTime: 5000
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateExpenseRequest>) => {
      if (!expenseId) throw new Error('Expense ID required')
      return ExpenseService.updateExpense(expenseId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expense', expenseId] })
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Expense updated successfully')
    },
    onError: (error: Error) => {
      toast.error(`Failed to update expense: ${error.message}`)
    }
  })

  return {
    expense: expenseQuery.data,
    isLoading: expenseQuery.isLoading,
    isError: expenseQuery.isError,
    error: expenseQuery.error,
    updateExpense: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    refetch: expenseQuery.refetch
  }
}

export function useExpenseStats(startDate?: string, endDate?: string) {
  const statsQuery = useQuery({
    queryKey: ['expense-stats', startDate, endDate],
    queryFn: () => ExpenseService.getStatistics(startDate, endDate),
    staleTime: 60000
  })

  return {
    stats: statsQuery.data,
    isLoading: statsQuery.isLoading,
    isError: statsQuery.isError,
    error: statsQuery.error,
    refetch: statsQuery.refetch
  }
}

export function useExpenseCategories() {
  const categoriesQuery = useQuery({
    queryKey: ['expense-categories'],
    queryFn: () => ExpenseService.getCategories(),
    staleTime: 300000
  })

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    error: categoriesQuery.error
  }
}

export function useExpenseSearch(query: string, limit = 20) {
  const searchQuery = useQuery({
    queryKey: ['expense-search', query, limit],
    queryFn: () => ExpenseService.searchExpenses(query, limit),
    enabled: query.length > 2,
    staleTime: 5000
  })

  return {
    results: searchQuery.data || [],
    isLoading: searchQuery.isLoading,
    isError: searchQuery.isError,
    error: searchQuery.error
  }
}

export function useUnpaidExpenses() {
  const unpaidQuery = useQuery({
    queryKey: ['expenses', 'unpaid'],
    queryFn: () => ExpenseService.getUnpaidExpenses(),
    staleTime: 30000
  })

  return {
    unpaidExpenses: unpaidQuery.data || [],
    isLoading: unpaidQuery.isLoading,
    isError: unpaidQuery.isError,
    error: unpaidQuery.error,
    refetch: unpaidQuery.refetch
  }
}

export function useExpensesNeedingReview() {
  const reviewQuery = useQuery({
    queryKey: ['expenses', 'review'],
    queryFn: () => ExpenseService.getExpensesNeedingReview(),
    staleTime: 30000,
    refetchInterval: 60000
  })

  return {
    expensesNeedingReview: reviewQuery.data || [],
    isLoading: reviewQuery.isLoading,
    isError: reviewQuery.isError,
    error: reviewQuery.error,
    refetch: reviewQuery.refetch
  }
}

export function useExpensesByCategory(category: string, startDate?: string, endDate?: string) {
  const categoryQuery = useQuery({
    queryKey: ['expenses', 'category', category, startDate, endDate],
    queryFn: () => ExpenseService.getExpensesByCategory(category, startDate, endDate),
    enabled: !!category,
    staleTime: 60000
  })

  return {
    expenses: categoryQuery.data || [],
    isLoading: categoryQuery.isLoading,
    isError: categoryQuery.isError,
    error: categoryQuery.error
  }
}

export function useExpensesByVendor(vendorName: string, startDate?: string, endDate?: string) {
  const vendorQuery = useQuery({
    queryKey: ['expenses', 'vendor', vendorName, startDate, endDate],
    queryFn: () => ExpenseService.getExpensesByVendor(vendorName, startDate, endDate),
    enabled: !!vendorName,
    staleTime: 60000
  })

  return {
    expenses: vendorQuery.data || [],
    isLoading: vendorQuery.isLoading,
    isError: vendorQuery.isError,
    error: vendorQuery.error
  }
}

export function useExpenseInvoiceUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const queryClient = useQueryClient()

  const uploadInvoice = useCallback(
    async (file: File, ocrProvider: 'google_vision' | 'unstructured' = 'google_vision') => {
      try {
        setIsProcessing(true)
        setUploadProgress(20)

        const result = await ExpenseService.uploadAndProcessInvoice(file, ocrProvider)

        setUploadProgress(100)

        queryClient.invalidateQueries({ queryKey: ['expenses'] })
        queryClient.invalidateQueries({ queryKey: ['expense-stats'] })

        if (result.ocrResult.requiresReview) {
          toast.warning('Invoice processed - review required', {
            description: `Confidence: ${result.ocrResult.invoiceData.confidence}%`
          })
        } else {
          toast.success('Invoice processed successfully', {
            description: `Extracted: ${result.ocrResult.invoiceData.vendorName}`
          })
        }

        return result
      } catch (error: any) {
        toast.error(`Failed to process invoice: ${error.message}`)
        throw error
      } finally {
        setIsProcessing(false)
        setTimeout(() => setUploadProgress(0), 1000)
      }
    },
    [queryClient]
  )

  return {
    uploadInvoice,
    uploadProgress,
    isProcessing
  }
}
