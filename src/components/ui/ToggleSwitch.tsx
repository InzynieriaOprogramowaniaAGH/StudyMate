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
      <div className="w-10 h-5 rounded-full bg-[var(--color-border)] peer-checked:bg-[var(--color-primary)] transition-colors duration-300" />
      <span
        className="absolute left-0.5 top-0.5 w-4 h-4 bg-[var(--color-bg-light)] rounded-full shadow-sm transform transition-transform duration-300 peer-checked:translate-x-5"
      />
    </label>
  );
}
