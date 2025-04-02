import React, { useState } from 'react';

interface LocationWarningProps {
  message: string;
  isDefaultLocation: boolean;
}

export function LocationWarning({ message, isDefaultLocation }: LocationWarningProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !message) return null;

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-1">
          <p className="text-sm text-orange-700 whitespace-pre-line">{message}</p>
          {isDefaultLocation && (
            <p className="text-sm text-orange-600 mt-2">現在、東京駅周辺の公園を表示しています</p>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-orange-500 hover:text-orange-600"
        >
          <span className="sr-only">閉じる</span>
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
