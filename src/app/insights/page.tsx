'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE, Party } from "../config/constants";
import ky from 'ky';

import CustomSelect from "@/components/custom/customSelect";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { config } from '../app.config';
import { NeoTable } from '@/components/ui/neoTable'

const types = [
  "MP",
  "Division",
  // "Contract",
  // "Organisation",
  // "Individual"
]

const queries = [
  "most",
  "least"
];

const voteTyps = [
  "on",
  "for",
  "against",
];

export default function insights() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState();
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(false);
  const [fromDate, setFromDate] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substr(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));

  const [type, setType] = useState(types[0]);
  const [query, setQuery] = useState(queries[0]);
  const [party, setParty] = useState("Any Party");
  const [voteType, setVoteType] = useState(voteTyps[0]);
  const [voteCategory, setVoteCategory] = useState(VOTING_CATEGORIES[0]);
  const [limit, setLimit] = useState(10);

  const [isQuerying, setIsQuerying] = useState(false);

  const onSearch = async () => {

    setIsQuerying(true);
    setData(undefined);
    setProgress(true);

    const nameParam = name || "Any";

    const partyParam = party.includes("Any") ? "Any" : party;

    // @ts-ignore
    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${partyParam}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${nameParam}`;

    // @ts-ignore
    if (type === 'Division' && voteType !== 'on') {
      const ayeOrNo = voteType === "for" ? "aye" : "no";
      url = `${url}&ayeorno=${ayeOrNo}`;
    }

    const result: any = await ky(url).json();

    setData(result);

    setProgress(false);
  }

  const getDetails = (row: any) => {

    if (type === "MP") {
      const id = row._fields[3].low;
      router.push(`mp?id=${id}`, { scroll: true });
    } else {
      const id = row._fields[2].low;
      router.push(`division?id=${id}`, { scroll: true });
    }
  }

  const onChangeType = (value: string) => {
    setType(value);
  }

  const onChangeCategory = (value: string) => {
    setVoteCategory(value);
  }

  const onChangeParty = (value: string) => {
    setParty(value);
  }

  const onChangeVoteType = (value: string) => {
    setVoteType(value);
  }

  const onChangeQuery = (value: string) => {
    setQuery(value);
  }

  const onChangeVoteCategory = (value: string) => {
    setVoteCategory(value);
  }



  return (

    <div className="insights">

      <div>
        <div className="flex flex-col gap-2 mb-4 items-baseline p-4 flex-wrap">

          <div className='flex items-baseline gap-2'>

            <Label
              className="min-w-[80px]"
              htmlFor="selectType"
            >
              Which
            </Label>

            <CustomSelect
              id="selectType"
              className="min-w-[190px]"
              value={type}
              onValueChange={onChangeType}
              options={types.map(str => ({ value: str, label: `${str}'s`, }))}
            />
          </div>

          <div className='flex items-baseline gap-2'>
            <Label
              htmlFor="name"
              className="min-w-[80px]"
            >
              {type === "MP" ? "name" : "title"}
            </Label>
            <Input
              id="name"
              className='min-w-[190px]'
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
                className="min-w-[190px]"
                value={voteCategory}
                onValueChange={onChangeCategory}
                options={VOTING_CATEGORIES.map(str => ({ value: str, label: `${str}'s`, }))}
              />

            </div>
          )}

          {type === 'MP' && (

            <div
              className='flex items-baseline gap-2'
            >
              <Label
                htmlFor="partySelect"
                className="min-w-[80px]"
              >
                from
              </Label>

              <CustomSelect
                id="partySelect"
                className="min-w-[190px]"
                value={party}
                onValueChange={onChangeParty}
                options={["Any Party"].concat(Object.values(Party)).filter((i) => i !== "Unknown" && i !== "Any").map(str => ({ value: str, label: str }))}
              />
              
            </div>
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
                className="min-w-[190px]"
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
              className="min-w-[190px]"
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
                className="min-w-[190px]"
                value={query}
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
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
              value={fromDate}
              className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
              px-4 py-2 rounded-md
              bg-background 
              border-input  // Use the custom border color class
              focus:outline-none 
              focus:ring-2 
              focus:ring-custom-outline 
              transition-all duration-200 ease-in-out min-w-[190px]"
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
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
              value={toDate}
              className="
              px-4 py-2 rounded-md
              bg-background 
              border-input  // Use the custom border color class
              focus:outline-none 
              focus:ring-2 
              focus:ring-custom-outline 
              transition-all duration-200 ease-in-out min-w-[190px]"
            />

          </div>

          <div className='flex items-baseline gap-2'>

            <Label htmlFor="insightsLimit" className="min-w-[80px]">limit</Label>

            <Input
              id="insightsLimit"
              className='min-w-[190px]'
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
              type="number">
            </Input>

          </div>

          <div className='w-full justify-center items-center mt-4' >
            <Button
              className="w-full md:w-[700px]"
              onClick={onSearch}
            >
              Go
            </Button>
          </div>
        </div>

      </div>

      {isQuerying && <NeoTable data={data} title={"Insights"} onRowClick={getDetails} />}

    </div>


  );
}
