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
    minContractCount: number;
    setMinContractCount: (value: number) => void
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
    minContractCount,
    setMinContractCount
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
                        id="contractCount"
                        className='w-[210px]'
                        value={minContractCount}
                        onChange={(e) => setMinContractCount(Number(e.target.value))}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    >
                    </Input>
                </div>

                <div className='flex items-baseline gap-2'>
                    <Label htmlFor="contractCount" className="w-[82px]">By</Label>

                    <Input
                        disabled
                        value={dontatedToParty}
                    />
                </div>

            </CustomFieldset>
        </div>
    )
}

export default OrgInsights;