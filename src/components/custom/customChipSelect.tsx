'use client';
import { useState, useEffect } from "react";

interface SelectOption {
  value: string;
  label: string;
  icon: any
}

interface CustomChipSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  id?: string;
  className?: string;
}

const CustomChipSelect = ({ value, onValueChange, options, disabled, id, className }: CustomChipSelectProps) => {

  const [selectedValue, setSelectedValue] = useState<string | undefined>(value);
  const [prevValue, setPrevValue] = useState<string | undefined>(value); // To trigger onChange only when needed

  // Update selectedValue when the parent component's value prop changes
  useEffect(() => {
    if (value !== prevValue) {
      setSelectedValue(value);
      setPrevValue(value);
    }
  }, [value, prevValue]);

  const handleChipClick = (newValue: string) => {
    setSelectedValue(newValue);
    onValueChange?.(newValue); // Only trigger onValueChange if the value actually changed
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`} {...(id && { id })}>
      {options.map((option) => (
         <button
         key={option.label}
         onClick={() => !disabled && handleChipClick(option.value)}
         className={`
           flex items-center py-1 px-2 rounded-full font-medium gap-4 mb-2
           ${selectedValue === option.label ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}
           ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary'}
         `}
         disabled={disabled}
       >
         <span>{option.icon}</span>
         <span>{option.label}</span>
       </button>
      ))}
    </div>
  );
};

export default CustomChipSelect;
