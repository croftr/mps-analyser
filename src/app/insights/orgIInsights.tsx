import {
    Info
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PartyPicker from "@/components/custom/partyPicker";

import CustomFieldset from "@/components/custom/customFieldset";
import CustomSelect from "@/components/custom/customSelect";

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
    setMinContractCount: (value: number) => void,
    orgType: string, 
    setOrgType: (value: string) => void;
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
    setMinContractCount,
    orgType,
    setOrgType
}: OrgInsightsProps) => {

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

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="orgName" className="w-[80px]">Type</Label>

                <CustomSelect
                    id="selectType"
                    className="w-[210px]"
                    value={orgType}
                    onValueChange={setOrgType}
                    options={["Any", "Organisation", "Individual"].map(str => ({ value: str,  label: str }))}
                />
            </div>


            <CustomFieldset legend="Donations Made">
                <div className='flex items-baseline gap-2'>
                    <Label htmlFor="donationAmount" className="w-[62px]">Amount</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">£</span>
                        </div>
                        <Input
                            placeholder="any name"
                            id="donationAmount"
                            className='w-[210px] pl-7' // Add left padding to accommodate the prefix
                            value={minTotalDonationValue}
                            onChange={(e) => setMinTotalDonationValue(Number(e.target.value))}
                            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                        />
                    </div>
                </div>

                <PartyPicker
                    party={dontatedToParty}
                    onChangeParty={onChangeDontatedToParty}
                    label="To"
                    labelClassName="min-w-[62px]"
                />
            </CustomFieldset>

            <div className="flex gap-2">
                <Info className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-500">Currently only same party names supported</span>
            </div>


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

                <PartyPicker
                    party={dontatedToParty}
                    onChangeParty={onChangeDontatedToParty}
                    label="By"
                    labelClassName="min-w-[62px]"
                />

            </CustomFieldset>
        </div>
    )
}

export default OrgInsights;