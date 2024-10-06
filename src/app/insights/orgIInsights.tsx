import {
    Info
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import PartyPicker from "@/components/custom/partyPicker";

import CustomFieldset from "@/components/custom/customFieldset";
import CustomSelect from "@/components/custom/customSelect";
import ToggleButton from "@/components/custom/toggleButton";

import { EARLIEST_FROM_DATE } from "../config/constants";

interface OrgInsightsProps {
    dontatedToParty: string,
    onChangeDontatedToParty: (value: string) => void;
    awardedByParty: string,
    onChangeAwardedByarty: (value: string) => void;
    orgName: string;
    onChangeOrgName: (value: string) => void;
    onSearch: () => void;
    minTotalDonationValue: number;
    setMinTotalDonationValue: (value: number) => void;
    minContractCount: number;
    setMinContractCount: (value: number) => void,
    orgType: string,
    setOrgType: (value: string) => void;
    wholeWordMatch: boolean;
    onToggleWholeWordMatch: () => void;
    donationFromDate: string;
    setDonationFromDate: (value: string) => void;
    donationToDate: string;
    setDonationToDate: (value: string) => void;
    contractFromDate: string;
    setContractFromDate: (value: string) => void;
    contractToDate: string;
    setContractToDate: (value: string) => void;
}

const OrgInsights = ({
    orgName,
    onChangeOrgName,
    onSearch,
    dontatedToParty,
    onChangeDontatedToParty,
    awardedByParty,
    onChangeAwardedByarty,
    minTotalDonationValue,
    setMinTotalDonationValue,
    minContractCount,
    setMinContractCount,
    orgType,
    setOrgType,
    wholeWordMatch,
    onToggleWholeWordMatch,
    donationFromDate,
    setDonationFromDate,
    donationToDate,
    setDonationToDate,
    contractFromDate,
    setContractFromDate,
    contractToDate,
    setContractToDate,
}: OrgInsightsProps) => {

    return (

        <div className="flex flex-col gap-2 items-baseline flex-wrap">

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="orgName" className="w-[80px]">Name</Label>

                <div className="flex items-end gap-2">
                    <Input
                        placeholder="any name"
                        id="orgName"
                        className='w-[226px]'
                        value={orgName}
                        onChange={(e) => onChangeOrgName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    >
                    </Input>

                    <ToggleButton label="Toggle Whole Word Match" isTrue={wholeWordMatch} toggleIsTrue={onToggleWholeWordMatch} />
                </div>
            </div>

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="orgName" className="w-[80px]">Type</Label>

                <CustomSelect
                    id="selectType"
                    className="w-[226px]"
                    value={orgType}
                    onValueChange={setOrgType}
                    options={["Any", "Organisation", "Individual"].map(str => ({ value: str, label: str }))}
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

                <div className="flex gap-2 items-baseline">

                    <Label
                        htmlFor="startSelect"
                        className="min-w-[62px]">
                        from
                    </Label>

                    <input
                        type="date"
                        id="startSelect"
                        name="from-date"
                        min={EARLIEST_FROM_DATE}
                        max={new Date().toISOString().substring(0, 10)}
                        onChange={(e) => setDonationFromDate(e.target.value)}
                        value={donationFromDate}
                        className="px-4 py-2 rounded-md
                            bg-background                 
                            border 
                            border-gray-400 dark:border-gray-700       
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-custom-outline 
                            transition-all 
                            duration-200 
                            ease-in-out w-[210px]"
                    />
                </div>

                <div className="flex gap-2 items-baseline">
                    <Label
                        htmlFor="startSelect"
                        className="min-w-[62px]">
                        to
                    </Label>

                    <input
                        type="date"
                        id="toDate"
                        name="to-date"
                        min={EARLIEST_FROM_DATE}
                        max={new Date().toISOString().substring(0, 10)}
                        onChange={(e) => setDonationToDate(e.target.value)}
                        value={donationToDate}
                        className="px-4 py-2 rounded-md
                            bg-background 
                            border
                            border-gray-400 dark:border-gray-700
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-custom-outline 
                            transition-all duration-200 ease-in-out w-[210px]"
                    />
                </div>
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
                    party={awardedByParty}
                    onChangeParty={onChangeAwardedByarty}
                    label="By"
                    labelClassName="min-w-[62px]"
                />

                <div className="flex gap-2 items-baseline">

                    <Label
                        htmlFor="startSelect"
                        className="min-w-[62px]">
                        from
                    </Label>

                    <input
                        type="date"
                        id="startSelect"
                        name="from-date"
                        min={EARLIEST_FROM_DATE}
                        max={new Date().toISOString().substring(0, 10)}
                        onChange={(e) => setContractFromDate(e.target.value)}
                        value={contractFromDate}
                        className="px-4 py-2 rounded-md
                            bg-background                 
                            border 
                            border-gray-400 dark:border-gray-700       
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-custom-outline 
                            transition-all 
                            duration-200 
                            ease-in-out w-[210px]"
                    />
                </div>

                <div className="flex gap-2 items-baseline">
                    <Label
                        htmlFor="startSelect"
                        className="min-w-[62px]">
                        to
                    </Label>

                    <input
                        type="date"
                        id="toDate"
                        name="to-date"
                        min={EARLIEST_FROM_DATE}
                        max={new Date().toISOString().substring(0, 10)}
                        onChange={(e) => setContractToDate(e.target.value)}
                        value={contractToDate}
                        className="px-4 py-2 rounded-md
                            bg-background 
                            border
                            border-gray-400 dark:border-gray-700
                            focus:outline-none 
                            focus:ring-2 
                            focus:ring-custom-outline 
                            transition-all duration-200 ease-in-out w-[210px]"
                    />
                </div>

            </CustomFieldset>
        </div>
    )
}

export default OrgInsights;