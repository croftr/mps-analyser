"use client"

import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation'
import ky from 'ky';
import { config } from "../app.config";
import BarChart from "./BarChart.jsx";
import SimilarityChart from "./simiarityChart";

import MpCard from '@/components/ui/MpCard';

import {
  Party,
  EARLIEST_FROM_DATE,
  VOTING_CATEGORIES
} from "../config/constants";

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { NeoTable } from '@/components/ui/neoTable'

import CustomSvg from '@/components/custom/customSvg';

export default function Mp() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {

  const router = useRouter();

  const male = <CustomSvg path="M16 2v2h3.586l-3.972 3.972c-1.54-1.231-3.489-1.972-5.614-1.972-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.125-.741-4.074-1.972-5.614l3.972-3.972v3.586h2v-7h-7zm-6 20c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
  const female = <CustomSvg path="M21 9c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.632 3.501 8.443 8 8.941v2.059h-3v2h3v2h2v-2h3v-2h-3v-2.059c4.499-.498 8-4.309 8-8.941zm-16 0c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" />

  const [mpDetails, setMpDetails] = useState<Record<string, any> | undefined>({});
  const [synopsis, setSynopsis] = useState("");

  const [votefilterFrom, setVotefilterFrom] = useState(new Date(new Date(EARLIEST_FROM_DATE)).toISOString().substr(0, 10));
  const [votefilterTo, setVotefilterTo] = useState(new Date().toISOString().substr(0, 10));

  const [votefilterType, setVotefilterType] = useState("Any");
  const [filterInProgress, setFilterInProgress] = useState(false);
  const [votingSummary, setVotingSummary] = useState<any>(undefined);
  const [votingSimilarity, setVotingSimilarity] = useState();
  const [queryType, setQueryType] = useState("none");

  const [votefilterTitle, setVotefilterTitle] = useState("");

  //similarity params
  const [isExcludingParties, setIsExcludingParties] = useState(true);
  const [isIncludingParties, setIsIncludingParties] = useState(false);
  const [excludeParties, setExcludeParties] = useState("");
  const [includeParties, setIncludeParties] = useState("");
  const [limit, setLimit] = useState(10);
  

  enum SimilarityType {
    MOST = 'Most',
    LEAST = 'Least',
  }
  
  const [similarityType, setSimilarityType] = useState<SimilarityType>(SimilarityType.MOST); 

  const [progress, setProgress] = useState("");
  const [votingHistory, setVotingHistory] = useState();
  const [barChartData, setBarChartData] = useState();
  const searchParams = useSearchParams();
  const [similarityResult, setSimilarityResult] = useState([]);


  const [tableData, setTableData] = useState();
  const [tableTitle, setTableTitle] = useState("");

  const onApplyFilter = async () => {
    setFilterInProgress(true);
    const result = await ky(`${config.mpsApiUrl}votecounts?id=${mpDetails?.value?.id}&fromDate=${votefilterFrom}&toDate=${votefilterTo}&category=${votefilterType}&name=${votefilterTitle}`).json();
    setFilterInProgress(false);
    setVotingSummary(result);
  }

  const onToggleExcludeInclude = (type: string) => {
    console.log(type);
    if (type === "include") {
      setIsIncludingParties(!isIncludingParties);
      if (isExcludingParties) {
        setIsExcludingParties(false);
      }
    } else {
      setIsExcludingParties(!isExcludingParties);
      if (isIncludingParties) {
        setIsIncludingParties(false);
      }
    }
  }

  const onQueryMp = async (id: string) => {

    setMpDetails(undefined);

    const result: any = await ky(`https://members-api.parliament.uk/api/Members/${id}`).json();

    console.log("result ", result);

    setMpDetails(result);

    const synopsisResult: any = await ky(`https://members-api.parliament.uk/api/Members/${id}/Synopsis`).json();

    setSynopsis(synopsisResult.value);

    onGetVotingSummary(result.value.id);

  }

  const onChangeSummaryDatePicker = (type: string, value: string) => {
    console.log("check ", value);

    if (type === "from") {
      setVotefilterFrom(value);
      // setFromDate(value);
    } else {
      setVotefilterTo(value);
      // setToDate(value);
    }
  }

  const onGetVotingSummary = async (id: number, fromDate = EARLIEST_FROM_DATE, toDate = new Date().toISOString().substr(0, 10), divisionCategory = "Any", name = "Any") => {

    setFilterInProgress(true);

    const result = await ky(`${config.mpsApiUrl}votecounts?id=${id}&fromDate=${fromDate}&toDate=${toDate}&category=${divisionCategory}&name=${name}`).json();
    console.log('votecounts ', result);

    setFilterInProgress(false);
    setVotingSummary(result);
  }

  useEffect(() => {
    const paramId = searchParams.toString().split("=")[1]
    console.log(paramId);

    onQueryMp(paramId);

  }, [searchParams])

  const onGetVotingHistory = async (type: string) => {

    setQueryType("history");
    setTableData(undefined);
    setProgress("Analysing voting history...");

    //clear similarity to make space for voting history
    setVotingSimilarity(undefined);
    setBarChartData(undefined);
    //@ts-ignore
    setSimilarityResult(undefined);
    setVotingHistory(undefined);

    //TODO scroll to bottom probably should be for mobile only
    // setTimeout(
    //   () =>
    //     document
    //       .getElementsByClassName("container")[0]
    //       .scrollTo(0, document.body.scrollHeight),
    //   1
    // );

    try {
      const nameParam = votefilterTitle || "Any";
      const response = await ky(
        `${config.mpsApiUrl}votingDetailsNeo?id=${mpDetails?.value?.id}&type=${type}&fromDate=${votefilterFrom}&toDate=${votefilterTo}&category=${votefilterType}&name=${nameParam}`
      ).json();

      // @ts-ignore      
      console.log(response.records[0]);

      // @ts-ignore      
      setTableData(response.records);
      setTableTitle(`${mpDetails?.value?.nameDisplayAs} voted ${type === "votedAye" ? "Aye" : type === "votedNo" ? "No" : ""}`);
      // @ts-ignore
      setProgress(undefined);
    } catch (error) {
      // @ts-ignore
      setProgress(undefined);
      console.error(error);
      setVotingHistory(undefined);

    }
  };

  function darkenColor(hexColor: string, factor: number): string {
    // Ensure factor is between 0 and 1
    factor = Math.max(0, Math.min(1, factor));

    // Parse the hex color
    let r = parseInt(hexColor.slice(1, 3), 16);
    let g = parseInt(hexColor.slice(3, 5), 16);
    let b = parseInt(hexColor.slice(5, 7), 16);

    // Darken each RGB component proportionally
    r = Math.round(r * (1 - factor));  // Corrected this line
    g = Math.round(g * (1 - factor));  // Corrected this line
    b = Math.round(b * (1 - factor));  // Corrected this line

    // Convert back to hex string
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  const onGetVotingSimilarity = async (orderby: string) => {


    if (orderby === "ASCENDING") {
      setSimilarityType(SimilarityType.LEAST);      
    } else {
      setSimilarityType(SimilarityType.MOST);
    }
    setQueryType("similarity");
    setTableData(undefined);

    setProgress("Getting voting similarity...");
    //clear voting history to make space for similarity
    setVotingSimilarity(undefined);
    setVotingHistory(undefined);

    let queryParams = '';

    if (isExcludingParties && excludeParties) {
      queryParams = `&partyExcludes=${excludeParties}`;
    } else if (isIncludingParties && includeParties) {
      queryParams = `&partyIncludes=${includeParties}`;
    }

    const url = `${config.mpsApiUrl}votingSimilarityNeo?limit=${limit}&orderby=${orderby}&name=${mpDetails?.value?.nameDisplayAs}&id=${mpDetails?.value?.id}&fromDate=${votefilterFrom}&toDate=${votefilterTo}&category=${votefilterType}${queryParams}`;

    const result: Array<any> = await ky(url).json();

    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // @ts-ignore
    setVotingSimilarity(result);

    //TODO something not working getting the css variable for bar colour so using localstorage direct. fix this
    const chartData = {
      labels: [mpDetails?.value?.nameDisplayAs],
      datasets: [
        {
          label: "Voting Similarity",
          backgroundColor: result.map((_, index) => {

            const baseColor = isDarkMode ? "#980c4c" : "#a972cb";

            // Darken the first bar by 20%
            return index === 0 ? isDarkMode ? "#600b32" : "#6e0da9" : baseColor;
          }),
          // borderColor: result.map((_, index) => index === 0 ? '#FFF' : "#262a32"),
          borderColor: "#262a32",
          borderWidth: 2,
          indexAxis: "y",
          width: "40px",
          data: [1], // Start with the queried MP's score (1 for self-similarity)        
        },
      ],
    };
    //@ts-ignore
    setSimilarityResult(result);
    // @ts-ignore
    result.forEach((element) => {
      // @ts-ignore
      chartData.labels.push(element.name);
      // @ts-ignore
      chartData.datasets[0].data.push(element.score);
    });

    // @ts-ignore
    setBarChartData(chartData);
    // @ts-ignore
    setProgress(undefined);
  };

  const onRowClick = (row: any) => {
    console.log("click ", row);

    const id = row._fields[0].low

    router.push(`division?id=${id}`, { scroll: false });
  }

  const onQueryMpByName = async (data: any) => {
    console.log("check ", data);
    
    
    // setMpDetails(undefined);

    const result = await ky(`https://members-api.parliament.uk/api/Members/Search?Name=${data.name}`).json();

    //@ts-ignore
    router.push(`mp?id=${result.items[0]?.value?.id}`, { scroll: false });

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

      <div className="fieldsetsWrapper flex flex-col w-full"> {/* Flex container for fieldsets */}

        <fieldset className="border border-gray-200 pt-4 mb-4 relative p-2 w-full">
          <legend>
            <span className='flex'>
              <CustomSvg
                className='mr-2'
                path="M19 2c1.654 0 3 1.346 3 3v14c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-14c0-1.654 1.346-3 3-3h14zm5 3c0-2.761-2.238-5-5-5h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14zm-13 12h-2v3h-2v-3h-2v-3h6v3zm-2-13h-2v8h2v-8zm10 5h-6v3h2v8h2v-8h2v-3zm-2-5h-2v3h2v-3z"
              />
              Filters
            </span>

          </legend>

          <div className="flex flex-col gap-2">

            <div className="flex flex-col sm:flex-row gap-2 items-baseline">

              <label className="w-24 text-left sm:text-right" htmlFor="start">Between</label>

              <input
                type="date"
                id="start"
                min={EARLIEST_FROM_DATE}
                max={new Date().toISOString().substr(0, 10)}
                name="from-date"
                onChange={(e) => onChangeSummaryDatePicker("from", e.target.value)}
                value={votefilterFrom}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                px-4 py-2 rounded-md
                bg-gray-100 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200 ease-in-out"
              />

              <input
                type="date"
                min={EARLIEST_FROM_DATE}
                max={new Date().toISOString().substr(0, 10)}
                id="toDate"
                name="to-date"
                onChange={(e) => onChangeSummaryDatePicker("to", e.target.value)}
                value={votefilterTo}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                px-4 py-2 rounded-md
                bg-gray-100 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200 ease-in-out"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-baseline">
              <label className="w-24 text-left sm:text-right" htmlFor="divisionCategory fixedLabel">Division Type</label>
              <select
                value={votefilterType}
                onChange={(e) => setVotefilterType(e.target.value)}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                px-4 py-2 rounded-md
                bg-gray-100 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200 ease-in-out"
                name="divisionCategory"
              >
                {VOTING_CATEGORIES.map(i => (
                  <option
                    value={i}
                    key={i}
                  >
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <label className="w-24 text-left sm:text-right" htmlFor="title">Division  Title</label>
              <input
                type="search"
                placeholder="includes text"
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                px-4 py-2 rounded-md
                bg-gray-100 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200 ease-in-out"
                value={votefilterTitle}
                onChange={(e) => setVotefilterTitle(e.target.value)}
              />
            </div>

            <button
              className='text-primary border border-primary rounded'
              onClick={onApplyFilter}
            >
              Apply
            </button>
          </div>
        </fieldset>

        <fieldset className="border border-gray-200 pt-4 mb-4 relative p-2 w-full">
          <legend>
            <span className='flex'>
              <CustomSvg
                className='mr-2'
                path="M2 0v24h20v-24h-20zm18 22h-16v-15h16v15zm-3-4h-10v-1h10v1zm0-3h-10v-1h10v1zm0-3h-10v-1h10v1z"
              />
              Voting details
            </span>
          </legend>
          <div className='mpDetails__actions'>

            {votingSummary && (
              <div className='votingSummary'>
                <h4>
                  {mpDetails?.value.nameDisplayAs}
                </h4>

                <div className='mt-2 grid grid-cols-3 gap-px justify-items-center items-center'>
                  <button
                    className='text-primary border border-primary rounded w-full'
                    onClick={() =>
                      onGetVotingHistory("all")
                    }
                  >
                    Total
                  </button>
                  <button
                    className='text-primary border border-primary rounded w-full'
                    onClick={() =>
                      onGetVotingHistory("votedAye")
                    }
                  >
                    Aye
                  </button>
                  <button
                    className='text-primary border border-primary rounded w-full'
                    onClick={() =>
                      onGetVotingHistory("votedNo")
                    }
                  >
                    No
                  </button>

                  {!filterInProgress && (
                    <>
                      <span className='votingSummary__buttons__count'>
                        {filterInProgress ? 'a' : votingSummary?.total}
                      </span>
                      <span className='votingSummary__buttons__count'>
                        {votingSummary?.votedAye || 0}
                      </span>
                      <span className='votingSummary__buttons__count'>
                        {votingSummary?.votedNo || 0}
                      </span>
                    </>
                  )}
                </div>

                {filterInProgress && (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                    <progress value={0} />
                  </div>
                )}
              </div>
            )}
          </div>
        </fieldset>

        <fieldset className="border border-gray-200 pt-4 mb-4 relative p-2 w-full">
          <legend>
            <span className='flex'>
              <CustomSvg
                className='mr-2'
                path="M8 1c0-.552.448-1 1-1h6c.552 0 1 .448 1 1s-.448 1-1 1h-6c-.552 0-1-.448-1-1zm12.759 19.498l-3.743-7.856c-1.041-2.186-2.016-4.581-2.016-7.007v-1.635h-2v2c.09 2.711 1.164 5.305 2.21 7.502l3.743 7.854c.143.302-.068.644-.376.644h-1.497l-4.377-9h-3.682c.882-1.908 1.886-4.377 1.973-7l.006-2h-2v1.635c0 2.426-.975 4.82-2.016 7.006l-3.743 7.856c-.165.348-.241.708-.241 1.058 0 1.283 1.023 2.445 2.423 2.445h13.154c1.4 0 2.423-1.162 2.423-2.446 0-.35-.076-.709-.241-1.056z"
              />
              Voting analysis
            </span>
          </legend>
          <div>

            <div className="grid grid-cols-[100px_1fr] gap-4 items-baseline">

              <div className='flex items-center gap-2 gridCell'>
                <Switch id="vaexclude" checked={isExcludingParties} onCheckedChange={() => onToggleExcludeInclude("exclude")} />
                <Label htmlFor="vaexclude">Exclude</Label>
              </div>

              <select
                name="partiesToExclude"
                onChange={(e) => setExcludeParties(e.target.value)}
                value={excludeParties}
                disabled={!isExcludingParties}
                className="w-full md:w-1/3 xl:w-1/4
                px-4 py-2 rounded-md
                bg-gray-100 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200 ease-in-out gridCell"
              >
                {Object.keys(Party).map(i => (
                  <option
                    value={Party[i]}
                    key={Party[i]}
                  >
                    {Party[i]}
                  </option>
                ))}
              </select>

              <div className='flex items-center gap-2 gridCell'>
                <Switch id="vaInclude" checked={isIncludingParties} onCheckedChange={() => onToggleExcludeInclude("include")} />
                <Label htmlFor="vaInclude">Include</Label>
              </div>

              <select
                name="partiesToExclude"
                onChange={(e) => setIncludeParties(e.target.value)}
                value={includeParties}
                disabled={!isIncludingParties}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                px-4 py-2 rounded-md
                bg-gray-100 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200 ease-in-out gridCell"
              >
                {Object.keys(Party).map(i => (
                  <option
                    value={Party[i]}
                    key={Party[i]}
                  >
                    {Party[i]}
                  </option>
                ))}
              </select>

              <Label className="text-right" htmlFor="valimit">Limit</Label>
              <input
                id="valimit"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                type="number"
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4
                px-4 py-2 rounded-md
                bg-gray-100 dark:bg-gray-700 
                text-gray-800 dark:text-gray-200
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all duration-200 ease-in-out gridCell"
              />
            </div>

            <div className='flex flex-col gap-2 p-4'>
              <button
                className='text-primary border border-primary rounded'
                onClick={() => onGetVotingSimilarity('DESCENDING')}
              >
                Most Similar Voting Mps
              </button>

              <button
                className='text-primary border border-primary rounded'
                onClick={() => onGetVotingSimilarity('ASCENDING')}
              >
                Least Similar Voting Mps
              </button>
            </div>
          </div>
        </fieldset>

        <SimilarityChart 
          mpData={similarityResult} 
          comparedMpName={mpDetails?.value?.nameDisplayAs} 
          type={similarityType} 
          onQueryMpByName={onQueryMpByName}
        />
     

        {queryType === "history" && (
          <NeoTable data={tableData} title={tableTitle} onRowClick={onRowClick} />
        )}
        
        {queryType === "similarity" && barChartData && (
          <BarChart
            barChartData={barChartData}
            onQueryMpByName={onQueryMpByName}
          />
        )}
      </div>
    </section>
  );
}
