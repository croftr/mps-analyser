import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PartyPicker from "@/components/custom/partyPicker";

interface OrgInsightsProps {
    dontatedToParty: string,
    onChangeDontatedToParty: (value: string) => void;
    awaredByParty: string
    onChangeAwaredByParty: (value: string) => void;
    orgName: string;
    onChangeOrgName: (value: string) => void;
    onSearch: () => void;
}

const OrgInsights = ({
    orgName,
    onChangeOrgName,
    onSearch,
    dontatedToParty,
    onChangeDontatedToParty,
    awaredByParty,
    onChangeAwaredByParty}
    : OrgInsightsProps) => {

    return (
        <div className="flex flex-col gap-2 mb-4 items-baseline flex-wrap">

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="orgName" className="min-w-[80px]">Name</Label>

                <Input
                    placeholder="any name"
                    id="orgName"
                    className='min-w-[190px]'
                    value={orgName}
                    onChange={(e) => onChangeOrgName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                >
                </Input>
            </div>

            <PartyPicker
                party={dontatedToParty}
                onChangeParty={onChangeDontatedToParty}
                label="Donated to"
            />

            <PartyPicker
                party={awaredByParty}
                onChangeParty={onChangeAwaredByParty}
                label="Awarded contract by"
            />
        </div>
    )
}

export default OrgInsights;