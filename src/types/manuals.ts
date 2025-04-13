
/**
 * Manual metadata stored in storage
 */
export interface ManualMetadata {
  title: string;
  description: string;
  pages?: string;
  modelCodes?: string[];
}

/**
 * Manual object returned from storage
 */
export interface StorageManual {
  id?: string;
  name: string;
  size: number;
  created_at: string;
  updated_at: string;
  metadata: ManualMetadata;
}

/**
 * Manual awaiting approval
 */
export interface PendingManual {
  id: string;
  title: string;
  description: string;
  filename: string;
  submittedBy: string;
  submittedAt: string;
  size: number;
  file_size?: number;
  submitter_name?: string;
  created_at?: string;
}

/**
 * Form values for manual submission
 */
export interface ManualFormValues {
  title: string;
  description: string;
  fileName?: string;
}
