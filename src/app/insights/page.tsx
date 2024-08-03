'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE } from "../config/constants";
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
import { log } from 'console';

const types = [
  "MP",
  "Division",
  "Contract",
  "Organisation or Individual",
]

const urlTypes = [
  "mp",
  "division",
  "contract",
  "org",
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
  const [awardedCount, setAwardedCount] = useState<number | undefined>();
  const [awardedName, setAwardedName] = useState("");
  const [awardedBy, setAwardedBy] = useState("Any Party");
  const [groupByContractCount, setGroupByContractCount] = useState(false);

  //orgs
  const [orgName, setOrgName] = useState("");
  const [dontatedToParty, setDontatedToParty] = useState("");
  const [awaredByParty, setAwaredByParty] = useState("");

  const capitalizeWords = (inputString: string) => {
    if (!inputString || inputString.trim() === '') {
      return ""; // Handle empty or whitespace-only input
    }

    const words = inputString.split(" ");
    const capitalizedWords = words.map(word => {
      const lowercaseWord = word.toLowerCase();
      if (lowercaseWord === "and" || lowercaseWord === "up") {
        return lowercaseWord; // Keep "and" and "up" lowercase
      } else {
        return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
      }
    });

    return capitalizedWords.join(" ");
  }

  /**
   * Called when the url for the insights page contains the type=xx param
   * query the database set the search fields based on the query params in the url 
   *
   */
  const getData = async () => {
    //TODO change url when fields are changed

    const typeParam = searchParams.get('type');

    if (!typeParam) {
      return; // Handle the case where typeParam is missing
    }

    //if type query param is set then perform query
    if (typeParam && urlTypes.includes(typeParam)) {

      let url: string | undefined = undefined;

      setIsQuerying(true);
      setData(undefined);

      if (typeParam === 'mp') {

        console.log("query from url ");        

        //get query data from url params
        const nameParam = searchParams.get('name') || "Any";

        const rawPartyParam = searchParams.get('party');
        const partyParam = rawPartyParam ? rawPartyParam[0].toUpperCase() + rawPartyParam.slice(1) : "Any";

        const rawLimitParam = searchParams.get('limit') || '';
        const limitParam = !isNaN(parseInt(rawLimitParam))
          ? parseInt(rawLimitParam)
          : 100;

        const categoryParam = searchParams.get('category') || 'Any';

        const fromDateParam = searchParams.get('fromdate') || EARLIEST_FROM_DATE;
        const toDateParam = searchParams.get('todate') || new Date().toISOString().substr(0, 10);
        const rawVoteParam = searchParams.get('voted') || 'most';
        const votedParam = rawVoteParam === "least" ? "ASC" : "DESC";

        //set fields based on url params
        setType("MP");
        setParty(partyParam === "Any" ? "Any Party" : partyParam);
        setLimit(limitParam);
        setName(nameParam === "Any" ? "" : nameParam);
        setFromDate(fromDateParam);
        setToDate(toDateParam);
        setQuery(rawVoteParam);
        setVoteCategory(capitalizeWords(categoryParam));


        url = `${config.mpsApiUrl}insights/mpvotes?limit=${limitParam}&orderby=${votedParam}&partyIncludes=${partyParam}&fromDate=${fromDateParam}&toDate=${toDateParam}&category=${categoryParam}&name=${nameParam}`;

        setTableHeader("MPs");

      } else if (typeParam === 'division') {      
        
        console.log("query from url ");
        
        //get query data from url params
        const nameParam = searchParams.get('name') || "Any";
        const rawPartyParam = searchParams.get('party');
        const partyParam = rawPartyParam ? rawPartyParam[0].toUpperCase() + rawPartyParam.slice(1) : "Any";

        const rawVoteParam = searchParams.get('voted') || 'most';
        const votedParam = rawVoteParam === "least" ? "ASC" : "DESC";

        const voteTypeParam = searchParams.get('votetype');

        const categoryParam = searchParams.get('category') || "Any";

        const fromDateParam = searchParams.get('fromdate') || EARLIEST_FROM_DATE;
        const toDateParam = searchParams.get('todate') || new Date().toISOString().substr(0, 10);

        const rawLimitParam = searchParams.get('limit') || '';
        const limitParam = !isNaN(parseInt(rawLimitParam))
          ? parseInt(rawLimitParam)
          : 100;
        
        //set fields based on url params                
        setType("Division");
        setName(nameParam === "Any" ? "" : nameParam);
        setVoteCategory(capitalizeWords(categoryParam));        
        setParty(partyParam === "Any" ? "Any Party" : partyParam);        
        setVoteType(voteTypeParam === "for" ? "on" : voteTypeParam === "against" ? "against" : "on");
        setQuery(rawVoteParam);
        setFromDate(fromDateParam);
        setToDate(toDateParam);
        setLimit(limitParam);
        
        url = `${config.mpsApiUrl}insights/divisionvotes?limit=${limitParam}&orderby=${votedParam}&fromDate=${fromDateParam}&toDate=${toDateParam}&category=${categoryParam}&name=${nameParam}`;
        
        if (voteTypeParam &&  (voteTypeParam === "for" || voteTypeParam === "against")) {
          const ayeOrNo = voteTypeParam === "for" ? "aye" : "no";
          url = `${url}&ayeorno=${ayeOrNo}`;
        }

      } else if (typeParam.startsWith("org")) {
        setType("Organisation or Individual");
        url = `${config.mpsApiUrl}orgs?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${party}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${name}`;
      } else if (typeParam === 'contract') {
        setType("Contract");
        url = `${config.mpsApiUrl}contracts?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${party}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${name}`;
      }

      if (url) {
        const result: any = await ky(url).json();        
        setData(result);
      }
    }
  }

  useEffect(() => {
    getData();
  }, []);

  /**
   * Set url in browser from fields set at query time 
   */
  const setUrlFromQueryFields= (nameParam:string, partyParam:string) => {    
    console.log("query from button");      
    const queryString = `?type=${type.toLowerCase()}&name=${nameParam}&party=${partyParam}&voted=${query}&votetype=${voteType}&category=${voteCategory}&fromdate=${fromDate}&todate=${toDate}&limit=${limit}`
    router.push(queryString, { scroll: false });    
  }

  const onSearchDivisionsOrMps = async () => {

    setIsQuerying(true);
    setData(undefined);

    setTableHeader(`${type}s`);

    const nameParam = name || "Any";
    const partyParam = party.includes("Any") ? "Any" : party;

    setUrlFromQueryFields(nameParam, partyParam);

    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${partyParam}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${nameParam}`;

    if (type === 'Division' && voteType !== 'on') {
      const ayeOrNo = voteType === "for" ? "aye" : "no";
      url = `${url}&ayeorno=${ayeOrNo}`;
    }

    const result: any = await ky(url).json();
    
    setData(result);

  }

  /**
   * Called when user clicks on table row to navigate to details page
   */
  const getDetails = (row: any) => {

    if (type === "MP") {
      const id = row._fields[3].low;
      router.push(`mp?id=${id}`, { scroll: true });
    } else if (type === "Division") {
      const id = row._fields[2].low;
      router.push(`division?id=${id}`, { scroll: true });
    } else if ((type === "Organisation or Individual") || (type === "Contract" && groupByContractCount)) {
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

  const onChangeAwardedName = (value: string) => {
    console.log("check ", value);

    setAwardedName(value);
  }
  const onChangeAwardedCount = (value: number | undefined) => {
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

  const onChangeAwaredByParty = (value: string) => {
    setAwaredByParty(value);
  }

  const onSearchOrgs = async () => {
    setIsQuerying(true);
    setData(undefined);

    setTableHeader("Organisations and individuals");

    const result: any = await ky(`${config.mpsApiUrl}orgs?name=${orgName}&donatedTo=${dontatedToParty}&awardedBy=${awaredByParty}&limit=${limit}`).json();

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
              onKeyDown={type === "Contract" ? onSearchContracts : type === "Organisation or Individual" ? onSearchOrgs : onSearchDivisionsOrMps}
              type="number">
            </Input>
          </div>

          <div className='w-full justify-center items-center mt-4' >
            <Button
              className="w-full md:w-[700px]"
              onClick={type === "Contract" ? onSearchContracts : type === "Organisation or Individual" ? onSearchOrgs : onSearchDivisionsOrMps}
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
