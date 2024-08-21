import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type SelectProps } from "@radix-ui/react-select"

import { icons } from 'lucide-react';
import { INDUSTRIES } from "@/app/config/constants";

interface CustomSelectProps extends SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string
}


//@ts-ignore
const Icon = ({ name }) => {
  //@ts-ignore
  const LucideIcon = icons[name];
  return <LucideIcon />;
};

const IndustryPicker = ({ value, onValueChange, disabled = false, id, className }: CustomSelectProps) => {
  return (

    <Select
      onValueChange={(value) => onValueChange?.(value)}
      {...(id && { id })} // Conditionally spread the id prop if not undefined
      value={value}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={INDUSTRIES[0].label}>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent
        ref={(ref: any) => {
          if (!ref) return;
          ref.ontouchstart = (e: any) => {
            e.preventDefault();
          };
        }}
        className="bg-white dark:bg-slate-800 text-black dark:text-white"
      >
        <SelectGroup>
          {INDUSTRIES.map(option => (
            <SelectItem
              onClick={(e) => e.stopPropagation()} value={option.value} key={option.value}
              className="mt-1 mb-1 border-b border-input"
            >
              <div className="flex gap-2">
                <Icon name={option.icon} />
                {option.label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default IndustryPicker;
