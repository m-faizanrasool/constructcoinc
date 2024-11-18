import React from "react";
import { Icon } from "lucide-react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  icon: Icon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
  formatNumber?: boolean;
}

export function InputField({
  label,
  name,
  value,
  icon: IconComponent,
  onChange,
  step = "any",
  formatNumber = false,
}: InputFieldProps) {
  const displayValue =
    formatNumber && value ? Number(value).toLocaleString("en-US") : value;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove commas before processing
    const rawValue = e.target.value.replace(/,/g, "");
    const numericValue = rawValue.replace(/[^\d.]/g, "");

    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: numericValue,
        name: e.target.name,
      },
    };

    onChange(syntheticEvent);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          name={name}
          value={displayValue}
          onChange={handleChange}
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-green-50"
          placeholder="Enter value"
          step={step}
        />
      </div>
    </div>
  );
}
