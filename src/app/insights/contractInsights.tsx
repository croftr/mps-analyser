import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EARLIEST_FROM_DATE } from "../config/constants";

import PartyPicker from "@/components/custom/partyPicker";
import CustomFieldset from "@/components/custom/customFieldset";
import IndustryPicker from "@/components/custom/IndustryPicker";
import ToggleButton from "@/components/custom/toggleButton";

interface ContractProps {
    awardedName: string;
    onChangeAwardedName: (value: string) => void;
    party: string,
    onChangeParty: (value: string) => void;
    onSearch: () => void;
    setContractFromDate: (value: string) => void;
    contractFromDate: string
    setContractToDate: (value: string) => void;
    contractToDate: string,
    onChangeContractName: (value: string) => void;
    contractName: string,
    industry: string,
    setIndustry: (value: string) => void;
    valueFrom: number;
    setValueFrom: (value: number) => void;
    valueTo: number,
    setValueTo: (value: number) => void;
    wholeWordMatch: boolean;
    onToggleWholeWordMatch: () => void;
}

const ContractInsights = ({
    awardedName,
    onChangeAwardedName,
    party,
    onChangeParty,
    onSearch,
    setContractFromDate,
    contractFromDate,
    setContractToDate,
    contractToDate,
    onChangeContractName,
    contractName,
    industry,
    setIndustry,
    valueFrom,
    setValueFrom,
    valueTo,
    setValueTo,
    wholeWordMatch,
    onToggleWholeWordMatch
}: ContractProps) => {

    return (
        <div className="flex flex-col gap-2 items-baseline flex-wrap">

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="awardedName" className="min-w-[80px]">Title</Label>

                <div className="flex items-end gap-2">
                    <Input
                        id="awardedName"
                        placeholder="Any contract title"
                        className='min-w-[244px]'
                        value={contractName}
                        onChange={(e) => onChangeContractName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    >
                    </Input>

                    <ToggleButton label="Toggle Whole Word Match" isTrue={wholeWordMatch} toggleIsTrue={onToggleWholeWordMatch} />
                </div>

            </div>

            <div className='flex items-baseline gap-2'>
                <Label htmlFor="awardedName" className="min-w-[80px]">Industry</Label>
                <IndustryPicker value={industry} onValueChange={setIndustry} className="w-[244px]" />
            </div>

            <PartyPicker
                party={party}
                onChangeParty={onChangeParty}
                label="Awarded by"
                selectClassName='w-[244px]'
            />

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="awardedName" className="min-w-[80px]">Awarded to</Label>

                <Input
                    id="awardedName"
                    placeholder="name includes"
                    className='min-w-[244px]'
                    value={awardedName}
                    onChange={(e) => onChangeAwardedName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                >
                </Input>
            </div>

            <CustomFieldset legend="Awarded between">

                <div className="flex gap-2 items-baseline">

                    <Label
                        htmlFor="startSelect"
                        className="min-w-[80px]">
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
                        className="min-w-[80px]">
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

            <CustomFieldset legend="£ Value between">
                <div className='flex items-baseline gap-2'>
                    <Label htmlFor="valueFrom" className="min-w-[80px]">Min</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">£</span>
                        </div>
                        <Input
                            type="number"
                            id="valueFrom"
                            className='min-w-[210px] pl-7' // Add left padding to accommodate the prefix
                            value={valueFrom}
                            onChange={(e) => setValueFrom(Number(e.target.value))}
                            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                        />
                    </div>
                </div>

                <div className='flex items-baseline gap-2'>
                    <Label htmlFor="valueTo" className="min-w-[80px]">Max</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">£</span>
                        </div>
                        <Input
                            type="number"
                            id="valueTo"
                            className='min-w-[210px] pl-7'
                            value={valueTo}
                            onChange={(e) => setValueTo(Number(e.target.value))}
                            onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                        />
                    </div>
                </div>
            </CustomFieldset>


        </div>
    )
}

export default ContractInsights;