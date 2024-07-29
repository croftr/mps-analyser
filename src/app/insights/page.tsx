'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE, Party } from "../config/constants";
import ky from 'ky';

import ContractInsights from './contractInsights';
import OrgInsights from './orgIInsights';
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
  "Organisation or Individual",  
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

  const [type, setType] = useState(types[0]);

  //table
  const [data, setData] = useState();
  const [isQuerying, setIsQuerying] = useState(false);
  const [tableHeader, setTableHeader] = useState("");

  //mps and divisions  
  const [name, setName] = useState("");
  const [query, setQuery] = useState(queries[0]);
  const [party, setParty] = useState("Any Party");
  const [voteType, setVoteType] = useState(voteTyps[0]);
  const [voteCategory, setVoteCategory] = useState(VOTING_CATEGORIES[0]);
  const [limit, setLimit] = useState(100);
  const [fromDate, setFromDate] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substr(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));

  //contracts
  const [awardedCount, setAwardedCount] = useState<number|undefined>();
  const [awardedName, setAwardedName] = useState("");
  const [awardedBy, setAwardedBy] = useState("Any Party");
  const [groupByContractCount, setGroupByContractCount] = useState(false);


  //orgs
  const [orgName, setOrgName] = useState("");
  const [dontatedToParty, setDontatedToParty] = useState("");
  const [awaredByParty, setAwaredByParty] = useState("");

  const onSearchDivisionsOrMps = async () => {

    setIsQuerying(true);
    setData(undefined);

    setTableHeader(`${type}s`);

    const nameParam = name || "Any";

    const partyParam = party.includes("Any") ? "Any" : party;

    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${partyParam}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${nameParam}`;

    if (type === 'Division' && voteType !== 'on') {
      const ayeOrNo = voteType === "for" ? "aye" : "no";
      url = `${url}&ayeorno=${ayeOrNo}`;
    }

    const result: any = await ky(url).json();

    setData(result);

  }

  const getDetails = (row: any) => {

    if (type === "MP") {
      const id = row._fields[3].low;
      router.push(`mp?id=${id}`, { scroll: true });
    } else if (type === "Division"){
      const id = row._fields[2].low;
      router.push(`division?id=${id}`, { scroll: true });
    } else if ( (type === "Organisation or Individual") || (type === "Contract" && groupByContractCount)) {
      console.log("check ", row);      
      const orgName = row._fields[0];
      router.push(`org?name=${orgName}`, { scroll: true });            
    } else if (type === "Contract") {
      console.log("check ", row);      
      router.push(`contract?supplier=${row._fields[0]}&title=${row._fields[1]}&value=${row._fields[2]}`, { scroll: true });      
    } else {
      console.log("warning unknown type of ", type);
      
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

  //contracts
  const onChangeAwardedName = (value: string) => {
    console.log("check ", value);

    setAwardedName(value);
  }
  const onChangeAwardedCount = (value: number|undefined) => {
    setAwardedCount(value);
  }

  const onSearchContracts = async () => {

    setIsQuerying(true);
    setData(undefined);

    if (awardedCount) {
      setTableHeader("Grouping contracts by organisation");
    } else {
      setTableHeader("Showing individual contracts");
    }

    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${awardedName}&awardedCount=${awardedCount}&awardedBy=${awardedBy}&limit=${limit}&groupByContractCount=${groupByContractCount}`);
    const contractsResult = await result.json();
    setData(contractsResult);
  }

  //orgs
  const onChangeOrgName = (value: string) => {
    setOrgName(value)
  }

  const onChangeDontatedToParty = (value: string) => {
    setDontatedToParty(value);
  }

  const onChangeAwaredByParty = (value:string)  => {
    setAwaredByParty(value);
  }

  const onSearchOrgs = async () => {
    setIsQuerying(true);
    setData(undefined);

    setTableHeader("Organisations and individuals");

    const result:any = await ky(`${config.mpsApiUrl}orgs?name=${orgName}&donatedTo=${dontatedToParty}&awardedBy=${awaredByParty}&limit=${limit}`).json();

    console.log("result ", result);
    
    setData(result);
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
              options={types.map(str => ({ value: str, label: `${str}s`, }))}
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
              onSearch={onSearchDivisionsOrMps}
              onChangeVoteCategory={setVoteCategory}
            />
          )}

          {type === "Contract" && (
            <div id="contracts">
              <ContractInsights
                awardedCount={awardedCount}
                awardedName={awardedName}
                onChangeAwardedName={onChangeAwardedName}
                onChangeAwardedCount={onChangeAwardedCount}
                party={awardedBy}
                onChangeParty={setAwardedBy}
                onSearch={onSearchContracts}
                groupByContractCount={groupByContractCount}
                setGroupByContractCount={setGroupByContractCount}
              />
            </div>
          )}

          {type === "Organisation or Individual" && (
            <OrgInsights
              onChangeOrgName={onChangeOrgName}
              orgName={orgName}
              onSearch={onSearchOrgs}
              dontatedToParty={dontatedToParty}
              onChangeDontatedToParty={onChangeDontatedToParty}
              awaredByParty={awaredByParty}
              onChangeAwaredByParty={onChangeAwaredByParty}

            />
          )}

          <Separator />

          <div className='flex items-baseline gap-2'>

            <Label htmlFor="insightsLimit" className="min-w-[80px]">limit</Label>

            <Input
              id="insightsLimit"
              className='min-w-[190px]'
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              onKeyDown={type === "Contract" ? onSearchContracts : type === "Organisation or Individual" ? onSearchOrgs :  onSearchDivisionsOrMps}
              type="number">
            </Input>
          </div>

          <div className='w-full justify-center items-center mt-4' >
            <Button
              className="w-full md:w-[700px]"
              onClick={type === "Contract" ? onSearchContracts : type === "Organisation or Individual" ? onSearchOrgs :  onSearchDivisionsOrMps}
            >
              Go
            </Button>
          </div>
        </div>

      </div>

      {isQuerying && <NeoTable data={data} title={tableHeader} onRowClick={getDetails} />}

    </div>
  );
}
