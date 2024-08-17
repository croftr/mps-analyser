'use client';

import { VOTING_CATEGORIES, EARLIEST_FROM_DATE, Party, PartyType } from "../config/constants";

import CustomSelect from "@/components/custom/customSelect";
import PartyPicker from "@/components/custom/partyPicker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const queries = [
  "most",
  "least"
];

const voteTyps = [
  "on",
  "for",
  "against",
];

interface MpsAndDivisionInsightsProps {
  type: string;
  name: string;
  setName: (name: string) => void;
  voteCategory: string;
  onChangeCategory: (category: string) => void;
  party: string;
  onChangeParty: (value:string) => void;
  voteType: string;
  onChangeVoteType: (voteType: string) => void;
  query: string;
  onChangeQuery: (query: string) => void;
  fromDate: string;
  setFromDate: (date: string) => void;
  toDate: string;
  setToDate: (date: string) => void;    
  onChangeVoteCategory: (voteType: string) => void;  
}

export default function MpsAndDivisionInsights({
  type,
  name,
  setName,
  voteCategory,
  onChangeCategory,
  party,
  onChangeParty,
  voteType,
  onChangeVoteType,
  query,
  onChangeQuery,
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  onChangeVoteCategory
}: MpsAndDivisionInsightsProps) {

  return (

    <div className="flex flex-col gap-2 items-baseline flex-wrap">
      <div className='flex items-baseline gap-2'>
        <Label
          htmlFor="name"
          className="min-w-[80px]"
        >
          {type === "MP" ? "name" : "title"}
        </Label>
        <Input
          id="name"
          className='w-[210px]'
          type="search"
          placeholder="includes text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

      </div>

      {type === 'Division' && (
        <div className='flex items-baseline gap-2'>
          <Label
            htmlFor="voteCategory"
            className="min-w-[80px]"
          >
            category
          </Label>

          <CustomSelect
            id="voteCategory"
            className="w-[210px]"
            value={voteCategory}
            onValueChange={onChangeCategory}
            options={VOTING_CATEGORIES.map(str => ({ value: str, label: str }))}
          />

        </div>
      )}

      {type === 'MP' && (
        <PartyPicker party={party} onChangeParty={onChangeParty} label="from" />
      )}

      {type === 'Division' && (
        <div className='flex items-baseline gap-2'>

          <Label
            htmlFor="voteType"
            className="whitespace-nowrap min-w-[80px]"
          >was voted
          </Label>

          <CustomSelect
            id="voteType"
            className="w-[210px]"
            value={voteType}
            onValueChange={onChangeVoteType}
            options={voteTyps.map(str => ({ value: str, label: str }))}
          />
        </div>
      )}

      <div className="flex items-baseline gap-2">

        {type === 'Division' && <Label htmlFor="leastMostSelct" className="min-w-[80px]">the</Label>}
        {type === 'MP' && <Label htmlFor="leastMostSelct" className='whitespace-nowrap min-w-[80px]'>voted the</Label>}

        <CustomSelect
          id="voteType"
          className="w-[210px]"
          value={query}
          onValueChange={onChangeQuery}
          options={queries.map(str => ({ value: str, label: str }))}
        />

      </div>

      {type === 'MP' && (
        <div className='flex items-baseline gap-2'>
          <Label
            htmlFor="categorySelect"
            className="min-w-[80px]"
          >
            on
          </Label>
          <CustomSelect
            id="voteType"
            className="w-[210px]"
            value={voteCategory}
            onValueChange={onChangeVoteCategory}
            options={VOTING_CATEGORIES.map(str => ({ value: str, label: str }))}
          />
        </div>
      )}

      <div className="flex gap-2 items-baseline">

        <Label
          htmlFor="startSelect"
          className="min-w-[80px]">
          between
        </Label>

        <input
          type="date"
          id="startSelect"
          name="from-date"
          min={EARLIEST_FROM_DATE}
          max={new Date().toISOString().substring(0, 10)}
          onChange={(e) => setFromDate(e.target.value)}
          value={fromDate}
          className="px-4 py-2 rounded-md
          bg-background 
          border-input  // Use the custom border color class
          focus:outline-none 
          focus:ring-2 
          focus:ring-custom-outline 
          transition-all duration-200 ease-in-out w-[210px]"
        />
      </div>

      <div className="flex gap-2 items-baseline">
        <Label
          htmlFor="startSelect"
          className="min-w-[80px]">
          and
        </Label>

        <input
          type="date"
          id="toDate"
          name="to-date"
          min={EARLIEST_FROM_DATE}
          max={new Date().toISOString().substring(0, 10)}
          onChange={(e) => setToDate(e.target.value)}
          value={toDate}
          className="px-4 py-2 rounded-md
          bg-background 
          border-input  // Use the custom border color class
          focus:outline-none 
          focus:ring-2 
          focus:ring-custom-outline 
          transition-all duration-200 ease-in-out w-[210px]"
        />
      </div>

    </div>
  );
}
