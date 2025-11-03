// src/components/ui/InputField.tsx
"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  textarea = false,
}) => {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-gray-400">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          rows={4}
          className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      ) : (
        <input
          id={name}
          name={name}
          type="text"
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-gray-900 border border-gray-700 rounded-lg p-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      )}
    </div>
  );
};

export default InputField;
