// UI State Types
export interface DialogState {
  open: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  autoHideDuration?: number;
}

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// Toast Notification Types
export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Sidebar Navigation Types
export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  children?: NavItem[];
}

// Form Types
export interface FormError {
  field: string;
  message: string;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: FormError[];
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}
