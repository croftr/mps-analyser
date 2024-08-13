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
    minTotalDonationValue: number;
    setMinTotalDonationValue: (value: number) => void;
}

const OrgInsights = ({
    orgName,
    onChangeOrgName,
    onSearch,
    dontatedToParty,
    onChangeDontatedToParty,
    awaredByParty,
    onChangeAwaredByParty,
    minTotalDonationValue,
    setMinTotalDonationValue
}
    : OrgInsightsProps) => {

    return (
        // <div className="flex flex-col gap-2 items-baseline flex-wrap border border-gray-500 border-opacity-50 p-4 rounded-md">
        <div className="flex flex-col gap-2 items-baseline flex-wrap">

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="orgName" className="w-[80px]">Name</Label>

                <Input
                    placeholder="any name"
                    id="orgName"
                    className='w-[210px]'
                    value={orgName}
                    onChange={(e) => onChangeOrgName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                >
                </Input>
            </div>

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="orgName" className="w-[80px]">Donated more than</Label>

                <Input
                    placeholder="any name"
                    id="donationAmount"
                    className='w-[210px]'
                    value={minTotalDonationValue}
                    onChange={(e) => setMinTotalDonationValue(Number(e.target.value))}
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
                // className="items-center"
                labelClassName="w-[80px]"
            />

        </div>
    )
}

export default OrgInsights;