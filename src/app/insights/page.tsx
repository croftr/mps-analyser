'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE, MAX_CONTRACT_VALUE } from "../config/constants";
import ky from 'ky';

import ContractInsights from './contractInsights';
import OrgInsights from './orgIInsights';
import CustomChipSelect from "@/components/custom/customChipSelect";
import MpsAndDivisionInsights from './mpsAndDivisionInsights';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { config } from '../app.config';
import { NeoTable } from '@/components/ui/neoTable'

import { ArrowUp } from "lucide-react"
import { ArrowDown } from "lucide-react"

import { ContractParams, OrgParams, CommonParams } from './insightTypes';

import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible"

import {
  Building2,
  Handshake,
  User,
  Vote
} from "lucide-react";

import { Separator } from '@radix-ui/react-separator';
import { generateHeaderFromQueryParams } from './tableHeaderGenerator';

const types = [
  { value: "MP", label: "MPs", icon: <User />, fieldCount: 7 },      
  { value: "Division", label: "Division", icon: <Vote />, fieldCount: 7 },
  { value: "Contract", label: "Contracts", icon: <Handshake />, fieldCount: 9 },
  { value: "Organisation or Individual", label: "Organisation or Individual", icon: <Building2 />, fieldCount: 7 },  
];

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

  const [isControlsDown, setIsControlsDown] = useState(false);

  const [type, setType] = useState(types[0].value);

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
  const [fromDate, setFromDate] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substring(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().substring(0, 10));

  //contracts
  const [awardedCount, setAwardedCount] = useState<number | undefined>();
  const [awardedTo, setAwardedTo] = useState("Any Organisation");
  const [awardedBy, setAwardedBy] = useState("Any Party");  
  const [contractName, setContractName] = useState("");
  const [groupByContractCount, setGroupByContractCount] = useState(false);  
  const [contractFromDate, setContractFromDate] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substring(0, 10));
  const [contractToDate, setContractToDate] = useState(new Date().toISOString().substring(0, 10));  
  const [industry, setIndustry] = useState("Any");
  const [valueFrom, setValueFrom] = useState(0);
  const [valueTo, setValueTo] = useState(MAX_CONTRACT_VALUE);

  //orgs
  const [orgName, setOrgName] = useState("");
  const [dontatedToParty, setDontatedToParty] = useState("");  
  const [awaredByParty, setAwaredByParty] = useState("");
  const [minTotalDonationValue, setMinTotalDonationValue] = useState(0);
  const [minContractCount, setMinContractCount] = useState(0);
  const [orgType, setOrgType] = useState("Any");

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

  function generateTableHeader(params: {
    typeParam: string;
    commonParams?: CommonParams;
    voteType?: string | null;
    contractParams?: ContractParams;
    orgParams?: OrgParams;
  }): void {
    const header = generateHeaderFromQueryParams(params)
    setTableHeader(header);  
  }

  /**
   * Called when the url for the insights page contains the type=xx param
   * query the database set the search fields based on the query params in the url 
   *
   */
  const getData = async () => {

    const typeParam = searchParams.get('type');

    if (!typeParam || !urlTypes.includes(typeParam)) {
      return;
    }

    setIsQuerying(true);
    setData(undefined);

    // Common Parameters and Settings
    const commonParams: CommonParams = {
      name: searchParams.get('name') || 'Any',
      party: (searchParams.get('party') ?? 'Any')?.[0]?.toUpperCase() + (searchParams.get('party') ?? 'Any')?.slice(1) || 'Any',
      limit: searchParams.get('limit') ? Number(searchParams.get('limit' || 100)) : 100, 
      fromDate: searchParams.get('fromdate') || EARLIEST_FROM_DATE,
      toDate: searchParams.get('todate') || new Date().toISOString().substring(0, 10),
      category: searchParams.get('category') || 'Any',
      voted: searchParams.get('voted') || 'most',
    };

    console.log("check ", commonParams.limit, searchParams.get('limit'));
    

    const orderby = commonParams.voted === 'least' ? 'ASC' : 'DESC';
    setName(commonParams.name === 'Any' ? '' : commonParams.name);
    setParty(commonParams.party === 'Any' ? 'Any Party' : commonParams.party);
    setLimit(commonParams.limit);
    setFromDate(commonParams.fromDate);
    setToDate(commonParams.toDate);
    setQuery(commonParams.voted);
    setVoteCategory(capitalizeWords(commonParams.category));

    // Type-Specific Logic
    let url: string | undefined = undefined;

    //vars fo divisions
    let voteType: string | null = null;

    const contractParams: ContractParams = {
      awardedByParam: '',
      awardedToParam: '',
      groupByContractParam: false,
      awardedCountParam: '',
      contractFromDate: '',
      contractToDate: '',
      contractName: '',
      industry: '',
      valueFrom: 0,
      valueTo: MAX_CONTRACT_VALUE
    };

    const orgParams: OrgParams = {
      nameParam: '',
      donatedtoParam: '',
      awardedbyParam: '',
      minTotalDonationValue: 0,
      minContractCount: 0,
      orgType: "Any"
    };

    switch (typeParam.toLocaleLowerCase()) {
      case 'mp': {
        setType("MP");
        url = `${config.mpsApiUrl}insights/mpvotes?limit=${commonParams.limit}&orderby=${orderby}&partyIncludes=${commonParams.party}&fromDate=${commonParams.fromDate}&toDate=${commonParams.toDate}&category=${commonParams.category}&name=${commonParams.name}`;
        break;
      }
      case 'division': {
        setType("Division");
        url = `${config.mpsApiUrl}insights/divisionvotes?limit=${commonParams.limit}&orderby=${orderby}&fromDate=${commonParams.fromDate}&toDate=${commonParams.toDate}&category=${commonParams.category}&name=${commonParams.name}`;
        voteType = searchParams.get('votetype');
        setVoteType(voteType === 'for' ? 'on' : voteType === 'against' ? 'against' : 'on');
        if (voteType && (voteType === 'for' || voteType === 'against')) {
          const ayeOrNo = voteType === 'for' ? 'aye' : 'no';
          url = `${url}&ayeorno=${ayeOrNo}`;
        }
        break;
      }
      case 'contract': {

        contractParams.awardedByParam = searchParams.get('awardedby') || 'Any Party';
        contractParams.awardedToParam = searchParams.get('awardedto') || 'Any Organisation';
        contractParams.groupByContractParam = searchParams.get('groupbycontract') && searchParams.get('groupbycontract') === "true" ? true : false;
        contractParams.awardedCountParam = searchParams.get('awardedcount');
        contractParams.contractName = searchParams.get('contractname')||'';
        contractParams.valueFrom = searchParams.get('valuefrom') ? Number(searchParams.get('valuefrom' || 0)) : 0;
        contractParams.valueTo = searchParams.get('valueto') ? Number(searchParams.get('valueto' || MAX_CONTRACT_VALUE)) : MAX_CONTRACT_VALUE;
                
        setType("Contract");
        setGroupByContractCount(contractParams.groupByContractParam);
        setAwardedBy(contractParams.awardedByParam);
        setAwardedTo(contractParams.awardedToParam);
        setContractName(contractParams.contractName);
        setValueFrom(contractParams.valueFrom);
        setValueTo(contractParams.valueTo);

        url = `${config.mpsApiUrl}contracts?limit=${limit}&awardedBy=${contractParams.awardedByParam}&orgName=${contractParams.awardedToParam}&groupByContractCount=${contractParams.groupByContractParam}&limit=${limit}&contractname=${contractName}&valuefrom=${contractParams.valueFrom}&valueto=${contractParams.valueTo}`;

        if (contractParams.awardedCountParam) {
          setAwardedCount(Number(contractParams.awardedCountParam));
          url = `${url}&awardedCount=${contractParams.awardedCountParam}`;
        }

        break;
      }
      case 'org': {
        orgParams.nameParam = searchParams.get('name');
        orgParams.donatedtoParam = searchParams.get('donatedto') || 'Any Party';
        orgParams.awardedbyParam = searchParams.get('awardedby') || 'Any Party';        
        orgParams.minTotalDonationValue = Number(searchParams.get('minTotalDonationValue')||0);
        orgParams.minContractCount = Number(searchParams.get('minContractCount')||0);
        orgParams.orgType = searchParams.get('orgtype') || 'Any';

        setType("Organisation or Individual");
        setDontatedToParty(orgParams.donatedtoParam);
        setAwaredByParty(orgParams.awardedbyParam);
        setLimit(Number(commonParams.limit));
        setMinTotalDonationValue(orgParams.minTotalDonationValue);
        setMinContractCount(orgParams.minContractCount);
        setOrgType(orgParams.orgType);

        url = `${config.mpsApiUrl}orgs?limit=${commonParams.limit}&donatedTo=${orgParams.donatedtoParam}&awardedBy=${orgParams.awardedbyParam}&minTotalDonationValue=${orgParams.minTotalDonationValue}&minContractCount=${orgParams.minContractCount}&orgtype=${orgParams.orgType}`;

        if (orgParams.nameParam) {
          url = `${url}&name=${orgParams.nameParam}`;
          setOrgName(orgParams.nameParam);
        }
        break;
      }
      default: {
        console.log("Unknown type of ", typeParam);
      }
    }

    // Fetch and Process Data
    if (url) {
      const result: any = await ky(url).json();
      setData(result);
    }

    generateTableHeader({ typeParam, commonParams, voteType, contractParams, orgParams });
  }


  useEffect(() => {
    getData();
  }, []);

  /**
   * Set url in browser from fields set at query time 
   */
  const setUrlFromQueryFields = (nameParam: string, partyParam: string) => {
    const queryString = `?type=${type.toLowerCase()}&name=${nameParam}&party=${partyParam}&voted=${query}&votetype=${voteType}&category=${voteCategory}&fromdate=${fromDate}&todate=${toDate}&limit=${limit}`
    router.push(queryString, { scroll: false });
  }

  const onSearchDivisionsOrMps = async () => {

    setIsQuerying(true);
    setData(undefined);

    const nameParam = name || "Any";
    const partyParam = party.includes("Any") ? "Any" : party;

    setUrlFromQueryFields(nameParam, partyParam);

    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${partyParam}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${nameParam}`;

    if (type === 'Division' && voteType !== 'on') {
      const ayeOrNo = voteType === "for" ? "aye" : "no";
      url = `${url}&ayeorno=${ayeOrNo}`;
    }

    const commonParams: CommonParams = {
      name,
      party,
      limit,
      fromDate,
      toDate,
      category: voteCategory,
      voted: query
    }

    generateTableHeader({ typeParam: type, commonParams, voteType });

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
      const orgName = row._fields[0];
      router.push(`org?name=${orgName}`, { scroll: true });
    } else if (type === "Contract") {            
      router.push(`contract?supplier=${row._fields[1]}&title=${encodeURIComponent(row._fields[0])}&value=${row._fields[3]}&awardedby=${row._fields[2]}`, { scroll: true });
    } else {
      console.log("warning unknown type of ", type);
    }
  }

  const onChangeType = (value: string) => {
    setType(value);
  }

  const onChangeAwardedName = (value: string) => {
    setAwardedTo(value);
  }
  const onChangeAwardedCount = (value: number | undefined) => {
    setAwardedCount(value);
  }

  const onSearchContracts = async () => {

    setIsQuerying(true);
    setData(undefined);

    let queryString = `?type=${type.toLowerCase()}&awardedto=${awardedTo}&awardedby=${awardedBy}&groupbycontract=${groupByContractCount}&contractFromDate=${contractFromDate}&contractToDate=${contractToDate}&contractname=${contractName}&limit=${limit}&industry=${industry}&valuefrom=${valueFrom}&valueto=${valueTo}`

    if (awardedCount) {
      queryString = `${queryString}&awardedcount=${awardedCount}`;
    }

    router.push(queryString, { scroll: false });

    const contractParams: ContractParams = {
      awardedByParam: awardedBy,
      awardedToParam: awardedTo,
      groupByContractParam: groupByContractCount,
      awardedCountParam: awardedCount ? awardedCount.toString() : "0",
      contractFromDate: contractFromDate,
      contractToDate: contractToDate,
      contractName: contractName,
      industry: industry,
      valueFrom: valueFrom,
      valueTo: valueTo
    }

    generateTableHeader({ typeParam: type, contractParams });

    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${awardedTo}&awardedCount=${awardedCount}&awardedBy=${awardedBy}&limit=${limit}&groupByContractCount=${groupByContractCount}&contractFromDate=${contractFromDate}&contractToDate=${contractToDate}&contractName=${contractName}&industry=${industry}&valuefrom=${valueFrom}&valueto=${valueTo}`);
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

    let queryString = `?type=org&donatedto=${dontatedToParty}&awardedby=${awaredByParty}&limit=${limit}&minTotalDonationValue=${minTotalDonationValue}&minContractCount=${minContractCount}&orgtype=${orgType}`
    if (orgName) {
      queryString = `${queryString}&name=${orgName}`;
    }

    router.push(queryString, { scroll: false });

    const orgParams: OrgParams = {
      nameParam: orgName,
      donatedtoParam: dontatedToParty,
      awardedbyParam: awaredByParty,
      minTotalDonationValue: minTotalDonationValue,
      minContractCount: minContractCount,
      orgType: orgType
    }

    generateTableHeader({ typeParam: "org", orgParams });

    const result: any = await ky(`${config.mpsApiUrl}orgs?name=${orgName}&donatedTo=${dontatedToParty}&awardedBy=${awaredByParty}&limit=${limit}&minTotalDonationValue=${minTotalDonationValue}&minContractCount=${minContractCount}&orgtype=${orgType}`).json();

    setData(result);
  }

  const onToggleControls = () => {
    setIsControlsDown(!isControlsDown);
  }


  return (

    <div className="insights">

      <div>
        <div className="flex flex-col gap-2 items-baseline p-4 flex-wrap">

          <CustomChipSelect
            id="selectType"
            className="min-w-[210px]"
            value={type}
            onValueChange={onChangeType}
            options={types.map(str => ({ value: str.value, label: str.label, icon: str.icon }))}
          />

          <Separator />

          <Button
            variant='outline'            
            onClick={onToggleControls}            
            className='flex gap-2 w-full'
          >
            {`Controls (${types.find(i => i.value === type)?.fieldCount } fields)`}
            {isControlsDown ? <ArrowUp /> : <ArrowDown />}
          </Button>

          <Collapsible
            open={isControlsDown}
            className="flex w-full"
          >

            <CollapsibleContent className="flex flex-col w-full md:w-2/3 lg:w-1/2 xl:w-1/3 gap-2">

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
                  onChangeVoteCategory={setVoteCategory}
                />
              )}

              {type === "Contract" && (
                <div id="contracts">
                  <ContractInsights
                    awardedCount={awardedCount}
                    awardedName={awardedTo}
                    onChangeAwardedName={onChangeAwardedName}
                    onChangeAwardedCount={onChangeAwardedCount}
                    party={awardedBy}
                    onChangeParty={setAwardedBy}
                    onSearch={onSearchContracts}
                    groupByContractCount={groupByContractCount}
                    setGroupByContractCount={setGroupByContractCount}
                    contractFromDate={contractFromDate}
                    setContractFromDate={setContractFromDate}
                    contractToDate={contractToDate}
                    setContractToDate={setContractToDate}
                    onChangeContractName={setContractName}
                    contractName={contractName}
                    industry={industry}
                    setIndustry={setIndustry}
                    valueFrom={valueFrom}
                    valueTo={valueTo}
                    setValueFrom={setValueFrom}
                    setValueTo={setValueTo}
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
                  minTotalDonationValue={minTotalDonationValue}
                  setMinTotalDonationValue={setMinTotalDonationValue}
                  minContractCount={minContractCount}
                  setMinContractCount={setMinContractCount}
                  orgType={orgType}
                  setOrgType={setOrgType}
                />
              )}

              <div className='flex items-baseline gap-2'>

                <Label htmlFor="insightsLimit" className="min-w-[80px]">Limit</Label>

                <Input
                  id="insightsLimit"
                  className='w-[210px]'
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
                  type="number">
                </Input>
              </div>

            </CollapsibleContent>
          </Collapsible>

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

      {isQuerying && <NeoTable data={data} title={tableHeader} onRowClick={getDetails} isHtmlTitle={true} />}

    </div>
  );
}
