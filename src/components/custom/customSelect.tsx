import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type SelectProps } from "@radix-ui/react-select"

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps extends SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

const CustomSelect = ({ value, onValueChange, options, disabled=false, id }: CustomSelectProps) => {
  return (
    <Select      
      onValueChange={(value) => onValueChange?.(value)}
      {...(id && { id })} // Conditionally spread the id prop if not undefined
      value={value}
      disabled={disabled}
    >
      <SelectTrigger className="">
        <SelectValue placeholder={options[0].label}>{value}</SelectValue>
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
          {options.map(option => (
            <SelectItem onClick={(e) => e.stopPropagation()} value={option.value} key={option.value}>{option.label}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default CustomSelect;
