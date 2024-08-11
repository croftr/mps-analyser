'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE } from "../config/constants";
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

const types = [
  { value: "MP", label: "MPs", icon: <User />, fieldCount: 7 },      
  { value: "Division", label: "Division", icon: <Vote />, fieldCount: 7 },
  { value: "Contract", label: "Contracts", icon: <Handshake />, fieldCount: 4 },
  { value: "Organisation or Individual", label: "Organisation or Individual", icon: <Building2 />, fieldCount: 4 },
  // { value: "Organisation or Individual", label: "Individual" },
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

//vars for contracts 
interface ContractParams {
  awardedByParam: string;
  awardedToParam: string;
  groupByContractParam: boolean;
  awardedCountParam?: string | null;
}
//vars for orgs
interface OrgParams {
  nameParam: string | null;
  donatedtoParam: string;
  awardedbyParam: string;
}

interface CommonParams {
  name: string;
  party: string;
  limit: number;
  fromDate: string; // Assuming date strings in ISO format (YYYY-MM-DD)
  toDate: string;   // Assuming date strings in ISO format (YYYY-MM-DD)
  category: string;
  voted: string;
}

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
  const [fromDate, setFromDate] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substr(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));

  //contracts
  const [awardedCount, setAwardedCount] = useState<number | undefined>();
  const [awardedTo, setAwardedTo] = useState("Any");
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

  function generateTableHeader(params: {
    typeParam: string;
    commonParams?: CommonParams;
    voteType?: string | null;
    contractParams?: ContractParams;
    orgParams?: OrgParams;
  }): void {

    let header = "";

    switch (params.typeParam.toLocaleLowerCase()) {
      case "mp":
        header = `${params.commonParams?.voted === "most" ? "MPs who voted most" : "MPs who voted least"}`;
        if (params.commonParams?.category !== 'Any') header += ` on ${params.commonParams?.category}`;
        if (params.commonParams?.party !== 'Any' && params.commonParams?.party !== 'Any Party') header += ` from the ${params.commonParams?.party}`;
        header += ` between ${params.commonParams?.fromDate} and ${params.commonParams?.toDate}`;
        if (params.commonParams?.name && params.commonParams?.name !== 'Any') {
          header = `MPs with ${params.commonParams.name} in thier name`;

          if (params.commonParams?.party && params.commonParams.party !== "Any Party" && params.commonParams.party !== "Any") {
            header += ` from the ${params.commonParams?.party} party`
          }

          header += ` who ${params.commonParams?.voted === "most" ? "voted most" : "voted least"}`;

          header += ` on ${params.commonParams?.category || "Any"} division`;

        }
        break;
      case "division":
        header = "Divisions"

        header += ` voted ${params.voteType ? params.voteType : ''} the ${params.commonParams?.voted}`;
        if (params.commonParams?.category !== 'Any') header += ` on ${params.commonParams?.category}`;
        header += ` between ${params.commonParams?.fromDate} and ${params.commonParams?.toDate}`;
        if (params.commonParams?.name && params.commonParams?.name !== 'Any') {

          header += ` with ${params.commonParams?.name} in the name`;
        }
        break;
      case "contract":

        if (params.contractParams?.groupByContractParam) {
          header = `Organisations awared more than ${params.contractParams.awardedCountParam || awardedCount} contracts`;
          if (params.contractParams.awardedByParam !== 'Any Party') header += ` by ${params.contractParams?.awardedByParam}`;
          if (params.contractParams?.awardedToParam && params.contractParams.awardedToParam !== 'Any') {
            header += ` with ${params.contractParams.awardedToParam} in their name`;
          }

          header += ". Grouped by organisation"
        } else {
          header = "Contracts awarded";
          if (params.contractParams?.awardedByParam !== 'Any Party') header += ` by ${params.contractParams?.awardedByParam}`;
          if (params.contractParams?.awardedToParam && params.contractParams?.awardedToParam !== 'Any') {
            header += ` to organisations with ${params.contractParams.awardedToParam} in thier name`;
          }
          if (params.contractParams?.awardedCountParam) {
            header += ` with value over £${params.contractParams.awardedCountParam}`;
          }

        }
        break;
      case "org":
        if (params.orgParams?.awardedbyParam && params.orgParams?.awardedbyParam !== "Any Party") {
          header = `Organisations awarded contracts by ${params.orgParams.awardedbyParam}`;
        } else {
          header = "Organisations and individuals";
        }

        if (params.orgParams?.donatedtoParam !== 'Any Party') {
          header += ` who donated to ${params.orgParams?.donatedtoParam}`;
        }

        if (params.orgParams?.nameParam) {
          header += `with ${params.orgParams.nameParam} in thier name`;
        }

        break;
    }
    
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
      limit: parseInt(searchParams.get('limit') || '100') || 100,
      fromDate: searchParams.get('fromdate') || EARLIEST_FROM_DATE,
      toDate: searchParams.get('todate') || new Date().toISOString().substr(0, 10),
      category: searchParams.get('category') || 'Any',
      voted: searchParams.get('voted') || 'most',
    };

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
      awardedCountParam: ''
    };

    const orgParams: OrgParams = {
      nameParam: '',
      donatedtoParam: '',
      awardedbyParam: '',
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
        contractParams.awardedToParam = searchParams.get('awardedto') || 'Any';
        contractParams.groupByContractParam = searchParams.get('groupbycontract') && searchParams.get('groupbycontract') === "true" ? true : false;
        contractParams.awardedCountParam = searchParams.get('awardedcount');


        setType("Contract");
        setGroupByContractCount(contractParams.groupByContractParam);
        setAwardedBy(contractParams.awardedByParam);
        setAwardedTo(contractParams.awardedToParam);

        url = `${config.mpsApiUrl}contracts?limit=${limit}&awardedBy=${contractParams.awardedByParam}&orgName=${contractParams.awardedToParam}&groupByContractCount=${contractParams.groupByContractParam}&limit=${limit}`;

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

        setType("Organisation or Individual");
        setDontatedToParty(orgParams.donatedtoParam);
        setAwaredByParty(orgParams.awardedbyParam);
        setLimit(Number(commonParams.limit));

        url = `${config.mpsApiUrl}orgs?limit=${commonParams.limit}&donatedTo=${orgParams.donatedtoParam}&awardedBy=${orgParams.awardedbyParam}`;

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
      router.push(`contract?supplier=${row._fields[1]}&title=${row._fields[0]}&value=${row._fields[3]}&awardedby=${row._fields[2]}`, { scroll: true });
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

    let queryString = `?type=${type.toLowerCase()}&awardedto=${awardedTo}&awardedby=${awardedBy}&groupbycontract=${groupByContractCount}&limit=${limit}`

    if (awardedCount) {
      queryString = `${queryString}&awardedcount=${awardedCount}`;
    }

    router.push(queryString, { scroll: false });

    const contractParams: ContractParams = {
      awardedByParam: awaredByParty,
      awardedToParam: awardedTo,
      groupByContractParam: groupByContractCount,
    }

    generateTableHeader({ typeParam: type, contractParams });

    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${awardedTo}&awardedCount=${awardedCount}&awardedBy=${awardedBy}&limit=${limit}&groupByContractCount=${groupByContractCount}`);
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

    let queryString = `?type=org&donatedto=${dontatedToParty}&awardedby=${awaredByParty}&limit=${limit}`
    if (orgName) {
      queryString = `${queryString}&name=${orgName}`;
    }

    router.push(queryString, { scroll: false });

    const orgParams: OrgParams = {
      nameParam: orgName,
      donatedtoParam: dontatedToParty,
      awardedbyParam: awaredByParty
    }

    generateTableHeader({ typeParam: "org", orgParams });

    const result: any = await ky(`${config.mpsApiUrl}orgs?name=${orgName}&donatedTo=${dontatedToParty}&awardedBy=${awaredByParty}&limit=${limit}`).json();

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

              <div className='flex items-baseline gap-2'>

                <Label htmlFor="insightsLimit" className="min-w-[80px]">limit</Label>

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

      {isQuerying && <NeoTable data={data} title={tableHeader} onRowClick={getDetails} />}

    </div>
  );
}
