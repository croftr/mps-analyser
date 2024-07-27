import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import PartyPicker from "@/components/custom/partyPicker";

interface ContractProps {
    awardedCount: number | undefined;
    onChangeAwardedCount: (value: number|undefined) => void;
    awardedName: string;
    onChangeAwardedName: (value: string) => void;
    party: string,
    onChangeParty: (value: string) => void;
    onSearch: () => void;
    groupByContractCount: boolean,
    setGroupByContractCount: (value: boolean) => void;
}

const ContractInsights = ({
    awardedCount,
    onChangeAwardedCount,
    awardedName,
    onChangeAwardedName,
    party,
    onChangeParty,
    onSearch,
    groupByContractCount: groupByContractCount,
    setGroupByContractCount: setGroupByContractCount
}: ContractProps) => {

    const onToggleGrouping = () => {
        if (groupByContractCount) {
            onChangeAwardedCount(0)
        } else {
            onChangeAwardedCount(10)
        }
        
        setGroupByContractCount(!groupByContractCount);
    }

    return (
        <div className="flex flex-col gap-2 mb-4 items-baseline flex-wrap">

            <PartyPicker
                party={party}
                onChangeParty={onChangeParty}
                label="Awarded by"
            />

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="awardedName" className="min-w-[80px]">Awarded to</Label>

                <Input
                    id="awardedName"
                    placeholder="name includes"
                    className='min-w-[190px]'
                    value={awardedName}
                    onChange={(e) => onChangeAwardedName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                >
                </Input>
            </div>

            <div className="flex flex-row items-baseline gap-2">

                <div className='flex items-center gap-2'>
                    <Label htmlFor="individualContracts" className="min-w-[80px]">
                        Group orgs
                    </Label>

                    <Switch 
                        id="individualContracts" 
                        checked={groupByContractCount} 
                        onCheckedChange={onToggleGrouping} 
                    />
                    </div>
                    <Input
                        disabled={!groupByContractCount}
                        id="awardedCount"
                        placeholder="contract count"
                        className='w-[138px]'                        
                        value={awardedCount}
                        onChange={(e) => onChangeAwardedCount(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                        type="number">
                    </Input>
                



            </div>


        </div>
    )
}

export default ContractInsights;