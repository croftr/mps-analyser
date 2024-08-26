import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { EARLIEST_FROM_DATE, INDUSTRIES } from "../config/constants";

import PartyPicker from "@/components/custom/partyPicker";
import CustomFieldset from "@/components/custom/customFieldset";
import CustomSelect from "@/components/custom/customSelect";
import IndustryPicker from "@/components/custom/IndustryPicker";

interface ContractProps {
    awardedCount: number | undefined;
    onChangeAwardedCount: (value: number | undefined) => void;
    awardedName: string;
    onChangeAwardedName: (value: string) => void;
    party: string,
    onChangeParty: (value: string) => void;
    onSearch: () => void;
    groupByContractCount: boolean,
    setGroupByContractCount: (value: boolean) => void;
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
    setGroupByContractCount: setGroupByContractCount,
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
    setValueTo
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
        <div className="flex flex-col gap-2 items-baseline flex-wrap">

            <div className='flex items-baseline gap-2'>

                <Label htmlFor="awardedName" className="min-w-[80px]">Title</Label>

                <Input
                    id="awardedName"
                    placeholder="Any contract title"
                    className='min-w-[244px]'
                    value={contractName}
                    onChange={(e) => onChangeContractName(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                >
                </Input>
            </div>

            <div className='flex items-baseline gap-2'>
                <Label htmlFor="awardedName" className="min-w-[80px]">Industry</Label>
                <IndustryPicker value={industry} onValueChange={setIndustry} className="w-[244px]"/>
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

            {/* <div className="flex flex-row items-baseline gap-2">

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
                    className='w-[158px]'
                    value={awardedCount}
                    onChange={(e) => onChangeAwardedCount(Number(e.target.value))}
                    onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
                    type="number">
                </Input>

                
            </div> */}

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