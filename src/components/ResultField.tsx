import React from 'react';

interface ResultFieldProps {
  label: string;
  value: number;
  isPercentage?: boolean;
}

export function ResultField({ label, value, isPercentage = false }: ResultFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="text-xl font-semibold text-gray-900">
        {isPercentage ? (
          `${value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
        ) : (
          `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        )}
      </div>
    </div>
  );
}