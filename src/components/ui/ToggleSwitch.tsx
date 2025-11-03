"use client";

import { useState } from "react";

interface ToggleSwitchProps {
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function ToggleSwitch({
  defaultChecked = false,
  onChange,
}: ToggleSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleChange = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue);
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="sr-only peer"
      />
      <div className="w-10 h-5 bg-gray-700 rounded-full peer-checked:bg-[var(--color-primary)] transition-all" />
      <span className="absolute left-1 top-0.5 w-4 h-4 bg-white rounded-full transform peer-checked:translate-x-5 transition-all" />
    </label>
  );
}
