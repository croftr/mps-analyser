'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE, Party } from "../config/constants";
import ky from 'ky';

import ContractInsights from './contractInsights';
import CustomSelect from "@/components/custom/customSelect";
import MpsAndDivisionInsights from './mpsAndDivisionInsights';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { config } from '../app.config';
import { NeoTable } from '@/components/ui/neoTable'

import { Separator } from "@/components/ui/separator"

const types = [
  "MP",
  "Division",
  "Contract",
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

          <Separator />

          {(type === "MP" || type === "Division") && (
            <MpsAndDivisionInsights
              type={type}
              name={name}
              setName={setName}
              voteCategory={voteCategory}
              onChangeCategory={setVoteCategory}
              party={party}
              onChangeParty={setParty} // Note: we're passing the setParty function
              voteType={voteType}
              onChangeVoteType={setVoteType}
              query={query}
              onChangeQuery={setQuery}
              fromDate={fromDate}
              setFromDate={setFromDate}
              toDate={toDate}
              setToDate={setToDate}
              onSearch={onSearch}
              onChangeVoteCategory={setVoteCategory}
            />
          )}

          {type === "Contract" && (
            <div id="contracts">
              <ContractInsights />
            </div>
          )}

          <Separator />

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
