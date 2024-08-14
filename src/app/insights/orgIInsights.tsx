import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PartyPicker from "@/components/custom/partyPicker";

import CustomFieldset from "@/components/custom/customFieldset";

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
    minDonationCount: number;
    setMinDonationCount: (value: number) => void
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
    setMinTotalDonationValue,
    minDonationCount,
    setMinDonationCount
}
    : OrgInsightsProps) => {

    return (

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

            <CustomFieldset legend="Donations Made">
                <div className='flex items-baseline gap-2'>
                    <Label htmlFor="donationAmount" className="w-[62px]">Amount</Label>
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
                    label="To"
                    labelClassName="min-w-[62px]"
                />
            </CustomFieldset>

            <CustomFieldset legend="Contracts Awarded">

                <div className='flex items-baseline gap-2'>

                    <Label htmlFor="contractCount" className="w-[62px]">Amount</Label>

                    <Input
                        placeholder="any name"
                        disabled={true}
                        id="contractCount"
                        className='w-[210px]'
                        value={minDonationCount}
                        onChange={(e) => setMinDonationCount(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    >
                    </Input>
                </div>

                <PartyPicker
                    party={awaredByParty}
                    onChangeParty={onChangeAwaredByParty}
                    label="By"
                    labelClassName="min-w-[62px]"
                />

            </CustomFieldset>
        </div>
    )
}

export default OrgInsights;