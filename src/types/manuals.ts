
export interface ManualFormValues {
  title: string;
  description: string;
  fileName?: string;
}

export interface StorageManual {
  id: string;
  name: string;
  size: number;
  created_at: string;
  updated_at?: string;
  metadata?: {
    title?: string;
    description?: string;
    pages?: number;
  };
}

export interface PendingManual {
  id: string;
  title: string;
  description: string;
  submitter_name?: string;
  created_at: string;
  file_size: number;
}
