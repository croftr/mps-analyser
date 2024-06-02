"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import ky from 'ky';
import { config } from "../app.config";

import {
  Party,  
  EARLIEST_FROM_DATE,
  VOTING_CATEGORIES
} from "../config/constants";

import Switch from "@/components/ui/switch";

export default function Mp() {

  const male = <svg className="standalone-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><path d="M16 2v2h3.586l-3.972 3.972c-1.54-1.231-3.489-1.972-5.614-1.972-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.125-.741-4.074-1.972-5.614l3.972-3.972v3.586h2v-7h-7zm-6 20c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" /></svg>
  const female = <svg className="standalone-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><path d="M21 9c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.632 3.501 8.443 8 8.941v2.059h-3v2h3v2h2v-2h3v-2h-3v-2.059c4.499-.498 8-4.309 8-8.941zm-16 0c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" /></svg>

  const [mpDetails, setMpDetails] = useState<Record<string, any> | undefined>({});

  const [votefilterFrom, setVotefilterFrom] = useState("");
  const [votefilterTo, setVotefilterTo] = useState("");
  const [votefilterType, setVotefilterType] = useState("");
  const [votefilterTitle, setVotefilterTitle] = useState("");
  const [filterInProgress, setFilterInProgress] = useState(false);
  const [votingSummary, setVotingSummary] = useState();
  const [votingSimilarity, setVotingSimilarity] = useState();
  
	//similarity params
	const [isExcludingParties, setIsExcludingParties] = useState(true);
	const [isIncludingParties, setIsIncludingParties] = useState(false);
	const [excludeParties, setExcludeParties] = useState("");
	const [includeParties, setIncludeParties] = useState("");
	const [limit, setLimit] = useState(10);

  const [progress, setProgress] = useState("");
  const [votingHistory, setVotingHistory] = useState();
  const [barChartData, setBarChartData] = useState();
  const searchParams = useSearchParams();

  const onApplyGlobalFilter = () => {
    console.log("apply filter");
    
  }

  const onApplyFilter = async () => {
    setFilterInProgress(true);
    
    // await onApplyGlobalFilter(mpDetails?.value?.id, votefilterFrom, votefilterTo, votefilterType, votefilterTitle);
    setFilterInProgress(false);
  }

  const onToggleExcludeInclude = (type:string) => {
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

  }

  const onChangeSummaryDatePicker = (type: string, value: string) => {
    if (type === "from") {
      setVotefilterFrom(value);
      // setFromDate(value);
    } else {
      setVotefilterTo(value);
      // setToDate(value);
    }
  }

  useEffect(() => {
    const paramId = searchParams.toString().split("=")[1]
    console.log(paramId);

    onQueryMp(paramId)

  }, [searchParams])


  const onGetVotingSimilarity = async (orderby:string) => {
		setProgress("Getting voting similarity...");
		//clear voting history to make space for similarity
		setVotingHistory(undefined);

		setTimeout(
			() =>
				document
					.getElementsByClassName("container")[0]
					.scrollTo(0, document.body.scrollHeight),
			100
		);

		let queryParams = '';

		if (isExcludingParties && excludeParties) {
			queryParams = `&partyExcludes=${excludeParties}`;
		} else if (isIncludingParties && includeParties) {
			queryParams = `&partyIncludes=${includeParties}`;
		}

		const url = `${config.mpsApiUrl}votingSimilarityNeo?limit=${limit}&orderby=${orderby}&name=${mpDetails?.value?.nameDisplayAs}&id=${mpDetails?.value?.id}&fromDate=${votefilterFrom}&toDate=${votefilterTo}&category=${votefilterType}${queryParams}`;

		const result = await ky(url).json();

    // @ts-ignore
		setVotingSimilarity(result);

		//TODO something not working getting the css variable for bar colour so using localstorage direct. fix this
		const chartData = {
			labels: [],
			datasets: [
				{
					label: "Voting Similarity",
					backgroundColor:
						window.localStorage.getItem("theme") ===
							"light-mode"
							? "#a972cb"
							: "#980c4c",
					borderColor: "#262a32",
					borderWidth: 2,
					// barThickness: 5,
					indexAxis: "y",
					width: "40px",
					data: [],
				},
			],
		};

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


  return (
    <section id="mpDetailsPage" className="flex justify-around p-4">

      <div className="p-4 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">

        <div className="flex items-center relative pr-8">

          <div
            title={mpDetails?.value?.gender === "M" ? "Male" : "Female"}
            className="absolute top-2 right-2 flex items-center"
          >
            {mpDetails?.value?.gender === "M" ? male : female}
          </div>

          <div className="relative w-20 h-20 rounded-full overflow-hidden mr-4">
            {mpDetails?.value?.thumbnailUrl && (
              <Image
                src={mpDetails?.value?.thumbnailUrl}
                alt={`${mpDetails?.value?.nameDisplayAs} Thumbnail`}
                fill
              />
            )}
          </div>
          <div>

            <h2 className="text-xl font-bold text-gray-600">{mpDetails?.value?.nameDisplayAs}</h2>

            <dd className="mt-1 text-sm text-gray-900">
              <span
                className={`px-2 py-1 rounded-full text-white text-xs font-medium uppercase tracking-wide ${mpDetails?.value?.latestParty?.backgroundColour}`}
                style={{ backgroundColor: `#${mpDetails?.value?.latestParty?.backgroundColour}`, color: `${mpDetails?.value?.latestParty?.foregroundColour}` }}
              >
                {mpDetails?.value?.latestParty?.name}
              </span>
            </dd>
            <p className="text-gray-600 mt-1">{mpDetails?.value?.latestHouseMembership?.membershipFrom}</p>
          </div>
        </div>

        <div className="bg-white shadow-md dark:bg-gray-800 dark:text-white rounded-md p-6">

          <h2 className="text-lg font-semibold mb-2">House Membership</h2>

          <div className="grid grid-cols-2 gap-4">

            <div>
              <p className="text-gray-600">Start Date:</p>
              <p className="font-medium">{new Date(mpDetails?.value?.latestHouseMembership?.membershipStartDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div>
              <p className="text-gray-600">End Date:</p>
              <p className="font-medium">{new Date(mpDetails?.value?.latestHouseMembership?.membershipEndDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-600">End Reason:</p>
              <p className="font-medium">{mpDetails?.value?.latestHouseMembership?.membershipEndReasonNotes}</p>
            </div>

            <div className="col-span-2">
              <p className="text-gray-600">Status:</p>
              {Boolean(mpDetails?.value?.latestHouseMembership.membershipStatus?.statusIsActive) ? <p className="font-medium text-green-500">{mpDetails?.value?.latestHouseMembership.membershipStatus?.statusDescription}</p> : <p className="font-medium text-red-400">{mpDetails?.value?.latestHouseMembership.membershipStatus?.statusDescription}</p>}


            </div>

          </div>
        </div>

      </div>

      <div className="fieldsetsWrapper">

        <fieldset>

          <legend>

            <svg
              style={{ position: "relative", top: 0, marginRight: 4 }}
              className="standalone-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path d="M19 2c1.654 0 3 1.346 3 3v14c0 1.654-1.346 3-3 3h-14c-1.654 0-3-1.346-3-3v-14c0-1.654 1.346-3 3-3h14zm5 3c0-2.761-2.238-5-5-5h-14c-2.762 0-5 2.239-5 5v14c0 2.761 2.238 5 5 5h14c2.762 0 5-2.239 5-5v-14zm-13 12h-2v3h-2v-3h-2v-3h6v3zm-2-13h-2v8h2v-8zm10 5h-6v3h2v8h2v-8h2v-3zm-2-5h-2v3h2v-3z" />
            </svg>
            <span style={{ position: "relative", top: -6 }}>
              Filters
            </span>

          </legend>


          <div className="filterWrapper" style={{ paddingBottom: 8, display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="datePicker">

              <label style={{ marginRight: 36 }} htmlFor="start">Between:</label>
              <input
                type="date"
                id="start"
                min={EARLIEST_FROM_DATE}
                max={new Date().toISOString().substr(0, 10)}
                name="from-date"
                onChange={(e) => onChangeSummaryDatePicker("from", e.target.value)}
                value={votefilterFrom}
              />

              <input
                style={{ marginLeft: 8 }}
                type="date"
                min={EARLIEST_FROM_DATE}
                max={new Date().toISOString().substr(0, 10)}
                id="toDate"
                name="to-date"
                onChange={(e) => onChangeSummaryDatePicker("to", e.target.value)}
                value={votefilterTo}
              />
            </div>

            <div className="filterCategory__wrapper">
              <label style={{ marginRight: 4 }} htmlFor="divisionCategory fixedLabel">Division Type:</label>
              <select
                value={votefilterType}
                onChange={(e) => setVotefilterType(e.target.value)}
                className="select insights__select"
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

            <div className="browse__toolbar__inputwrapper">
              <label htmlFor="title">Division  Title:</label>
              <input
                type="search"
                placeholder="includes text"
                className='input'
                value={votefilterTitle}
                onChange={(e) => setVotefilterTitle(e.target.value)}
              />
            </div>

            <button
              className='button'
              onClick={onApplyFilter}
            >
              Apply
            </button>


          </div>

        </fieldset>

        <fieldset>
          <legend>
            <svg
              style={{ position: "relative", top: 0, marginRight: 4 }}
              className="standalone-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path d="M2 0v24h20v-24h-20zm18 22h-16v-15h16v15zm-3-4h-10v-1h10v1zm0-3h-10v-1h10v1zm0-3h-10v-1h10v1z" />
            </svg>
            <span style={{ position: "relative", top: -6 }}>
              Voting details
            </span>
          </legend>
          <div className='mpDetails__actions'>

            {/* {votingSummary && (
              <div className='votingSummary'>
                <h4>
                  {displayName(details.value.nameDisplayAs)}
                </h4>

                <div className='votingSummary__buttons'>
                  <button
                    className='button votingButton'
                    onClick={() =>
                      onGetVotingHistory("all")
                    }
                  >
                    Total
                  </button>
                  <button
                    className='button'
                    onClick={() =>
                      onGetVotingHistory("votedAye")
                    }
                  >
                    Aye
                  </button>
                  <button
                    className='button'
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
                    <progress value={null} />
                  </div>
                )}
              </div>
            )} */}
          </div>
        </fieldset>

        <fieldset>
          <legend>

            <svg
              style={{ position: "relative", top: 0, marginRight: 4 }}
              className="standalone-svg"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24">
              <path d="M8 1c0-.552.448-1 1-1h6c.552 0 1 .448 1 1s-.448 1-1 1h-6c-.552 0-1-.448-1-1zm12.759 19.498l-3.743-7.856c-1.041-2.186-2.016-4.581-2.016-7.007v-1.635h-2v2c.09 2.711 1.164 5.305 2.21 7.502l3.743 7.854c.143.302-.068.644-.376.644h-1.497l-4.377-9h-3.682c.882-1.908 1.886-4.377 1.973-7l.006-2h-2v1.635c0 2.426-.975 4.82-2.016 7.006l-3.743 7.856c-.165.348-.241.708-.241 1.058 0 1.283 1.023 2.445 2.423 2.445h13.154c1.4 0 2.423-1.162 2.423-2.446 0-.35-.076-.709-.241-1.056z" />
            </svg>
            <span style={{ position: "relative", top: -6 }}>
              Voting analysis
            </span>

          </legend>

          <div className='mpDetails__actions'>

            <div className="mpDetails__toggle-wrapper">

              <div className="mpDetails__label">
                <Switch onToggle={() => onToggleExcludeInclude("exclude")} isChecked={isExcludingParties} label="Exclude"/>                
              </div>

              <select
                className="mpDetails__select select"
                name="partiesToExclude"
                onChange={(e) => setExcludeParties(e.target.value)}
                value={excludeParties}
                disabled={!isExcludingParties}
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
            </div>

            <div className="mpDetails__toggle-wrapper">
              <div className="mpDetails__label">
                <Switch onToggle={() => onToggleExcludeInclude("include")} isChecked={isIncludingParties} label="Include" />                
              </div>

              <select
                className="mpDetails__select select"
                name="partiesToExclude"
                onChange={(e) => setIncludeParties(e.target.value)}
                value={includeParties}
                disabled={!isIncludingParties}
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

            </div>

            <div className="mpDetails__toggle-wrapper">

              <label className="mpDetails__label">Limit</label>

              <input
                className="mpDetails__select input"
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                type="number">
              </input>

            </div>

            <button
              className='button'
              onClick={() => onGetVotingSimilarity('DESCENDING')}
            >
              Most Similar Voting Mps
            </button>

            <button
              className='button'
              onClick={() => onGetVotingSimilarity('ASCENDING')}
            >
              Least Similar Voting Mps
            </button>
          </div>

        </fieldset> 

      </div>

    </section>
  );
}
