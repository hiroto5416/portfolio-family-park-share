'use client';

import { AlertCircle, Info, AlertTriangle, Terminal, XCircle } from 'lucide-react';
import { ERROR_CODES } from '@/utils/errors';

export interface ErrorMessageProps {
  code?: keyof typeof ERROR_CODES;
  message: string;
  variant?: 'default' | 'error' | 'warning' | 'info' | 'debug' | 'server';
  className?: string;
  action?: React.ReactNode;
  onDismiss?: () => void;
}

/**
 * エラーメッセージコンポーネント
 */
export function ErrorMessage({
  code,
  message,
  variant = 'default',
  className = '',
  action,
  onDismiss,
}: ErrorMessageProps) {
  // バリアントによって色とアイコンを変更
  const variantStyles = {
    default: {
      container: 'bg-gray-50 border-gray-200 text-gray-600',
      icon: <Info className="h-5 w-5" />,
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-600',
      icon: <AlertCircle className="h-5 w-5" />,
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      icon: <AlertTriangle className="h-5 w-5" />,
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-600',
      icon: <Info className="h-5 w-5" />,
    },
    debug: {
      container: 'bg-purple-50 border-purple-200 text-purple-600',
      icon: <Terminal className="h-5 w-5" />,
    },
    server: {
      container: 'bg-rose-50 border-rose-200 text-rose-600',
      icon: <XCircle className="h-5 w-5" />,
    },
  };

  // エラーコードによってバリアントを自動判定
  const getVariantFromCode = (): keyof typeof variantStyles => {
    if (!code) return variant;

    switch (code) {
      case 'SERVER_ERROR':
      case 'API_ERROR':
        return 'server';
      case 'VALIDATION_ERROR':
      case 'INVALID_QUERY':
        return 'warning';
      case 'UNAUTHORIZED':
      case 'FORBIDDEN':
      case 'RATE_LIMIT':
        return 'error';
      case 'NO_RESULTS':
      case 'NOT_FOUND':
        return 'info';
      default:
        return variant;
    }
  };

  const currentVariant = getVariantFromCode();
  const { container, icon } = variantStyles[currentVariant];

  return (
    <div
      className={`p-4 rounded border flex items-start space-x-2 ${container} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex-grow">
        <div className="flex items-start justify-between">
          <div>
            {code && (
              <p className="font-medium mb-1 text-sm uppercase tracking-wider">
                {code.replace(/_/g, ' ')}
              </p>
            )}
            <p className="text-sm">{message}</p>
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-3 -mt-1 text-current opacity-70 hover:opacity-100"
              aria-label="閉じる"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
