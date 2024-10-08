"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ky from "ky";
import { config } from "../app.config";
import CustomSelect from "@/components/custom/customSelect";
import SimilarityChart from "./simiarityChart";

import MpCard from "@/components/ui/MpCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Party,
  EARLIEST_FROM_DATE,
  VOTING_CATEGORIES,
} from "../config/constants";

import { NeoTable } from "@/components/ui/neoTable";

import CustomSvg from "@/components/custom/customSvg";

// Interface for MP data
interface MpDetails {
  value?: {
    id: number;
    nameDisplayAs: string;
    latestParty?: {
      name: string;
    };
    latestHouseMembership: {
      membershipStatus?: {
        statusIsActive: boolean;
      };
      membershipStartDate: string;
      membershipEndDate: string;
    };
  };
}

// Interface for voting summary data
interface VotingSummary {
  total?: number;
  votedAye?: number;
  votedNo?: number;
}

// Interface for table data
interface TableData {
  _fields: any[]; // Adjust this type according to your actual data structure
}

type VotingHistoryType = "all" | "votedAye" | "votedNo" | undefined;

const votingHistoryTypes: Record<string, VotingHistoryType> = {
  ALL: "all",
  AYE: "votedAye",
  NO: "votedNo",
};

export default function Mp() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {

  const router = useRouter();

  const [mpDetails, setMpDetails] = useState<MpDetails | undefined>();
  const [votingSummary, setVotingSummary] = useState<VotingSummary | undefined>(undefined);
  const [tableData, setTableData] = useState<TableData[] | undefined>();
  const [similarityResult, setSimilarityResult] = useState([]);

  const [synopsis, setSynopsis] = useState("");

  const [votefilterFrom, setVotefilterFrom] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substring(0, 10));
  const [votefilterTo, setVotefilterTo] = useState(new Date().toISOString().substring(0, 10));

  const [votefilterType, setVotefilterType] = useState("Any");
  const [filterInProgress, setFilterInProgress] = useState(false);
  const [queryType, setQueryType] = useState("none");

  const [votefilterTitle, setVotefilterTitle] = useState("");

  const [includeOrExcludeParties, setIncludeOrExcludeParties] = useState("All Parties");
  const [limit, setLimit] = useState(10);
  const [isFilterChanged, setIsFilterChanged] = useState(false);

  const [votingHistoryType, setVotingHistoryType] = useState<VotingHistoryType>(undefined);

  type FilterOption = "Include" | "Exclude";
  const [includeOrExclude, setIncludeOrExclude] = useState<FilterOption>("Include");

  enum SimilarityType {
    MOST = 'Most',
    LEAST = 'Least',
  }

  const [similarityType, setSimilarityType] = useState<SimilarityType>(SimilarityType.MOST);
  const searchParams = useSearchParams();
  const [tableTitle, setTableTitle] = useState("");

  const onApplyFilter = async () => {
    setIsFilterChanged(false);
    setFilterInProgress(true);
    setVotingHistoryType(undefined);

    const result = await ky(`${config.mpsApiUrl}votecounts?id=${mpDetails?.value?.id}&fromDate=${votefilterFrom}&toDate=${votefilterTo}&category=${votefilterType}&name=${votefilterTitle}`).json();
    setFilterInProgress(false);
    //@ts-ignore
    setVotingSummary(result);
  }

  const onQueryMp = async (id: string) => {

    setMpDetails(undefined);

    const result: any = await ky(`https://members-api.parliament.uk/api/Members/${id}`).json();

    setMpDetails(result);

    const synopsisResult: any = await ky(`https://members-api.parliament.uk/api/Members/${id}/Synopsis`).json();

    setSynopsis(synopsisResult.value);

    onGetVotingSummary(result.value.id);

    onGetVotingSimilarity('DESCENDING', result); // Fetch most similar MPs by default

  }

  const onChangeSummaryDatePicker = (type: string, value: string) => {
  
    setIsFilterChanged(true);

    if (type === "from") {
      setVotefilterFrom(value);
    } else {
      setVotefilterTo(value);
    }
  }

  const onGetVotingSummary = async (id: number, fromDate = EARLIEST_FROM_DATE, toDate = new Date().toISOString().substring(0, 10), divisionCategory = "Any", name = "Any") => {

    setFilterInProgress(true);
    const result = await ky(`${config.mpsApiUrl}votecounts?id=${id}&fromDate=${fromDate}&toDate=${toDate}&category=${divisionCategory}&name=${name}`).json();
    setFilterInProgress(false);

    //@ts-ignore
    setVotingSummary(result);
  }

  useEffect(() => {
    const paramId = searchParams.toString().split("=")[1];

    onQueryMp(paramId);

  }, [searchParams]);

  const onGetVotingHistory = async (type: VotingHistoryType) => {

    setQueryType("history");
    setTableData(undefined);

    setVotingHistoryType(type);

    try {
      const nameParam = votefilterTitle || "Any";

      const response = await ky(
        `${config.mpsApiUrl}votingDetails?id=${mpDetails?.value?.id}&type=${type}&fromDate=${votefilterFrom}&toDate=${votefilterTo}&category=${votefilterType}&name=${nameParam}`
      ).json();

      // @ts-ignore      
      setTableData(response.records);

      setTableTitle(`${type === "votedAye" ? "Voted Aye" : type === "votedNo" ? "Voted No" : "All Votes"}`);

    } catch (error) {
      console.error(error);
      // @ts-ignore
      setSimilarityResult(undefined);
    }
  };


  const onGetVotingSimilarity = async (orderby: string, mpData: any = mpDetails) => {

    if (orderby === "ASCENDING") {
      setSimilarityType(SimilarityType.LEAST);
    } else {
      setSimilarityType(SimilarityType.MOST);
    }

    setQueryType("similarity");
    setTableData(undefined);

    let queryParams = '';

    if (includeOrExclude === "Exclude" && includeOrExcludeParties) {
      if (includeOrExcludeParties !== "All Parties") {
        queryParams = `&partyExcludes=${includeOrExcludeParties}`;
      } else {
        //@ts-ignore
        setSimilarityResult([]);
        return [];
      }

    } else if (includeOrExclude === "Include" && includeOrExcludeParties !== "All Parties") {
      queryParams = `&partyIncludes=${includeOrExcludeParties}`;
    }
    const url = `${config.mpsApiUrl}votingSimilarity?limit=${limit}&orderby=${orderby}&name=${mpData?.value?.nameDisplayAs}&id=${mpData?.value?.id}&fromDate=${votefilterFrom}&toDate=${votefilterTo}&category=${votefilterType}${queryParams}`;
    const result: [] = await ky(url).json();
    setSimilarityResult(result);
  };

  const onRowClick = (row: any) => {
    const id = row._fields[0].low
    router.push(`division?id=${id}`, { scroll: true });
  }

  const onQueryMpByName = async (data: any) => {
    const result = await ky(`https://members-api.parliament.uk/api/Members/Search?Name=${data.name}`).json();
    //@ts-ignore
    router.push(`mp?id=${result.items[0]?.value?.id}`, { scroll: true });
  }

  const onChangeVoteTitle = (value: string) => {
    setIsFilterChanged(true);
    setVotefilterTitle(value);
  }

  const onChangeVoteCategory = (value: string) => {
    setIsFilterChanged(true);
    setVotefilterType(value)
  }

  const onIncludeOrExclude = (value: string) => {
    //@ts-ignore
    setIncludeOrExclude(value);
  }

  return (
    <section id="mpDetailsPage" className="flex flex-col w-full justify-around p-4 gap-4 flex-wrap">

      <div className="flex w-full gap-4">
        {mpDetails && mpDetails.value && mpDetails.value.id && (
          <MpCard
            item={{
              id: mpDetails?.value.id,
              name: mpDetails?.value.nameDisplayAs,
              party: mpDetails?.value?.latestParty?.name,
              isActive: mpDetails?.value?.latestHouseMembership.membershipStatus?.statusIsActive,
              startDate: new Date(mpDetails?.value?.latestHouseMembership?.membershipStartDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
              endDate: new Date(mpDetails?.value?.latestHouseMembership?.membershipEndDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
            }}
            onQueryMp={undefined}
            isDisplayingTable={false}
            isFormatedDates={true}
          />
        )}

        <div className='flex-1'>
          <div dangerouslySetInnerHTML={{ __html: synopsis }} />
        </div>
      </div>

      <div className="fieldsetsWrapper flex flex-col w-full">

        <fieldset className="border border-gray-200 mb-4 relative p-2 w-full">
          <legend>
            <span className='flex'>
              <CustomSvg
                className='mr-2'
                path="M5.829 6c-.412 1.165-1.524 2-2.829 2-1.656 0-3-1.344-3-3s1.344-3 3-3c1.305 0 2.417.835 2.829 2h13.671c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5h-4.671c-.412 1.165-1.524 2-2.829 2-1.305 0-2.417-.835-2.829-2h-4.671c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5h13.671c.412-1.165 1.524-2 2.829-2 1.656 0 3 1.344 3 3s-1.344 3-3 3c-1.305 0-2.417-.835-2.829-2h-13.671c-2.484 0-4.5-2.016-4.5-4.5s2.016-4.5 4.5-4.5h4.671c.412-1.165 1.524-2 2.829-2 1.305 0 2.417.835 2.829 2h4.671c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5h-13.671zm6.171 5c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z"
              />
              Voting similariy with other Mps
            </span>
          </legend>

          <div className="flex flex-col items-baseline">

            <div className='flex items-baseline p-2 gap-2'>

              <span>Comparing</span>
              <Input
                className='w-20'
                id="valimit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                type="number"
              />
              <span>Mps</span>
            </div>

            <div className="w-4/5 max-w-[400px] flex flex-col justify-start gap-2">
              <CustomSelect
                id="includeExclude"
                value={includeOrExclude}
                onValueChange={onIncludeOrExclude}
                options={["Include", "Exclude"].map(i => { return { label: i, value: i } })}
              />

              <CustomSelect
                id="vaexclude"
                value={includeOrExcludeParties}
                onValueChange={setIncludeOrExcludeParties}
                options={[{ value: "All Parties", label: "All Parties" }].concat(Object.keys(Party).map(i => { return { value: Party[i], label: Party[i] } }))}
              />
            </div>
          </div>

          <div className='flex gap-2 p-4 justify-center'>

            <Button
              className='border border-primary rounded'
              variant={similarityType === "Most" ? "default" : "outline"}
              onClick={() => onGetVotingSimilarity('DESCENDING')}
            >
              Most Similar
            </Button>

            <Button
              className='border border-primary rounded'
              variant={similarityType === "Least" ? "default" : "outline"}
              onClick={() => onGetVotingSimilarity('ASCENDING')}
            >
              Least Similar
            </Button>
          </div>

          <SimilarityChart
            mpData={similarityResult}
            comparedMpName={mpDetails?.value?.nameDisplayAs}
            type={similarityType}
            onQueryMpByName={onQueryMpByName}
          />
        </fieldset>

        <fieldset className="border border-gray-200 pt-4 mb-4 relative p-2 w-full">
          <legend>
            <span className='flex'>
              <CustomSvg
                className='mr-2'
                path="M2 0v24h20v-24h-20zm18 22h-16v-15h16v15zm-3-4h-10v-1h10v1zm0-3h-10v-1h10v1zm0-3h-10v-1h10v1z"
              />
              Voting History
            </span>
          </legend>

          <div className="w-4/5 flex flex-col justify-start gap-2">
            <div className="flex flex-col sm:flex-row gap-2 items-baseline">
              <Label className='min-w-[60px]' htmlFor="betweenStart">Between</Label>
              <input
                type="date"
                id="start"
                min={EARLIEST_FROM_DATE}
                max={new Date().toISOString().substring(0, 10)}
                name="from-date"
                onChange={(e) => onChangeSummaryDatePicker("from", e.target.value)}
                value={votefilterFrom}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                  px-4 py-2 rounded-md
                  bg-background 
                  border-input  // Use the custom border color class
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-custom-outline 
                  transition-all duration-200 ease-in-out"
              />

              <input
                type="date"
                min={EARLIEST_FROM_DATE}
                max={new Date().toISOString().substring(0, 10)}
                id="toDate"
                name="to-date"
                onChange={(e) => onChangeSummaryDatePicker("to", e.target.value)}
                value={votefilterTo}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                  px-4 py-2 rounded-md
                  bg-background 
                  border-input  // Use the custom border color class
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-custom-outline 
                  transition-all duration-200 ease-in-out"
              />
            </div>

            <div className="flex sm:flex-row gap-2 items-baseline">

              <Label className='min-w-[60px]' htmlFor="divisionCategory">Category</Label>

              <CustomSelect
                id="divisionCategory"
                value={votefilterType}
                onValueChange={onChangeVoteCategory}
                options={VOTING_CATEGORIES.map(i => { return { value: i, label: i } })}
              />

            </div>

            <div className="flex sm:flex-row gap-2 items-baseline">
              <Label className='min-w-[60px]' htmlFor="titleFilter">Title</Label>
              <Input
                id="titleFilter"
                type="search"
                placeholder="includes text"
                value={votefilterTitle}
                onChange={(e) => onChangeVoteTitle(e.target.value)}
              />
            </div>

          </div>

          <Button
            variant={isFilterChanged ? "default" : "outline"}
            disabled={!isFilterChanged}
            className='w-full mt-2'
            onClick={onApplyFilter}
          >
            Apply
          </Button>


          <div className='mpDetails__actions'>

            {votingSummary && (
              <div className='votingSummary'>
                <div className='mt-2 grid grid-cols-3 gap-2 justify-items-center items-center'>
                  <Button
                    className='w-full'
                    variant={votingHistoryType ===  votingHistoryTypes.ALL ? "default" : "outline"}
                    onClick={() =>
                      onGetVotingHistory(votingHistoryTypes.ALL)
                    }
                  >
                    Total
                  </Button>
                  <Button
                    variant={votingHistoryType ===  votingHistoryTypes.AYE ? "default" : "outline"}
                    className='w-full'
                    onClick={() =>
                      onGetVotingHistory(votingHistoryTypes.AYE)
                    }
                  >
                    Aye
                  </Button>
                  <Button
                    className='w-full'
                    variant={votingHistoryType ===  votingHistoryTypes.NO ? "default" : "outline"}
                    onClick={() =>
                      onGetVotingHistory(votingHistoryTypes.NO)
                    }
                  >
                    No
                  </Button>                  

                  <span className='h-8'>
                    {filterInProgress ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : votingSummary?.total || 0}
                  </span>
                  <span className='h-8'>
                    {filterInProgress ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : votingSummary?.votedAye || 0}
                  </span>
                  <span className='h-8'>
                    {filterInProgress ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : votingSummary?.votedNo || 0}
                  </span>
                </div>

              </div>
            )}
          </div>
        </fieldset>

        {queryType === "history" && (
          <NeoTable data={tableData} title={tableTitle} onRowClick={onRowClick} />
        )}

      </div>
    </section>
  );
}
