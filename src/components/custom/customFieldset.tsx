import React, { ReactNode } from 'react';

interface customFieldset {
  legend: string;
  children: ReactNode;
  className?: string
}

const CustomFieldset: React.FC<customFieldset> = ({ legend, children, className }) => {
  return (
    <fieldset className={`flex flex-col gap-2 border p-4 rounded-md mb-4 border-gray-400 dark:border-gray-700 ${className}`}>
      <legend className="text-lg font-medium mb-2">{legend}</legend>
      {children}
    </fieldset>
  );
};

export default CustomFieldset;
