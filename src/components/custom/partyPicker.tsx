
import { Label } from "@/components/ui/label";
import CustomSelect from "./customSelect";
import { Party } from "../../app/config/constants";

interface PartyPickerProps {
    onChangeParty: (value:string) => void;
    party: string;    
    className?: string,
    label?: string,
    labelClassName?: string,
    selectClassName?: string,
}

export default function PartyPicker({ party, onChangeParty, className, label="Party", labelClassName, selectClassName }: PartyPickerProps) {

    return (
        <div
            className={`flex items-baseline gap-2 ${className}`}
        >
            <Label
                htmlFor="partySelect"
                className={`min-w-[80px] ${labelClassName}`}
            >
                {label}
            </Label>
    
            <CustomSelect
                id="partySelect"
                className={`w-[210px] ${selectClassName}`}                
                value={party}
                onValueChange={onChangeParty}
                options={["Any Party"].concat(Object.values(Party)).filter((i) => i !== "Unknown" && i !== "Any").map(str => ({ value: str, label: str }))}
            />
    
        </div>
    )
    

}

