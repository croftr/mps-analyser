import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContractProps {
    onSearch: () => void;
    awardedCount: number;
    onChangeAwardedCount: (value: number) => void;
    awardedName: string;
    onChangeAwardedName: (value: string) => void;
}

const ContractInsights = ({ awardedCount, onChangeAwardedCount, awardedName, onChangeAwardedName, onSearch }: ContractProps) => {
    return (
        <div className="flex flex-col gap-2 mb-4 items-baseline flex-wrap">

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="awardedCount" className="min-w-[80px]">Awarded count</Label>

                <Input
                    id="awardedCount"
                    className='min-w-[190px]'
                    value={awardedCount}
                    onChange={(e) => onChangeAwardedCount(Number(e.target.value))}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    type="number">
                </Input>
            </div>

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="awardedName" className="min-w-[80px]">Awarded to</Label>

                <Input
                    id="awardedName"
                    className='min-w-[190px]'
                    value={awardedName}
                    onChange={(e) => onChangeAwardedName(e.target.value)}                    
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                >
                </Input>
            </div>

            
        </div>
    )
}

export default ContractInsights;