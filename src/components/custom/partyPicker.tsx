
import { Label } from "@/components/ui/label";
import CustomSelect from "./customSelect";
import { Party } from "../../app/config/constants";

interface PartyPickerProps {
    onChangeParty: (value:string) => void;
    party: string;    
    className?: string,
    label?: string
}

export default function PartyPicker({ party, onChangeParty, className, label="Party" }: PartyPickerProps) {

    return (
        <div
            className={`flex items-baseline gap-2 ${className}`}
        >
            <Label
                htmlFor="partySelect"
                className="min-w-[80px]"
            >
                {label}
            </Label>
    
            <CustomSelect
                id="partySelect"
                className="w-[190px]"
                value={party}
                onValueChange={onChangeParty}
                options={["Any Party"].concat(Object.values(Party)).filter((i) => i !== "Unknown" && i !== "Any").map(str => ({ value: str, label: str }))}
            />
    
        </div>
    )
    

}

