'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE, Party } from "../config/constants";
import ky from 'ky';
import { config } from '../app.config';
import { NeoTable } from '@/components/ui/neoTable'

const types = [
  "MP",
  "Division"
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
  const [party, setParty] = useState("Any");
  const [voteType, setVoteType] = useState(voteTyps[0]);
  const [voteCategory, setVoteCategory] = useState(VOTING_CATEGORIES[0]);
  const [limit, setLimit] = useState(10);

  const [isQuerying, setIsQuerying] = useState(false);

  const onSearch = async () => {

    setIsQuerying(true);
    setData(undefined);
    setProgress(true);

    const nameParam = name || "Any";

    // @ts-ignore
    let url = `${config.mpsApiUrl}insights/${type === 'MP' ? 'mpvotes' : 'divisionvotes'}?limit=${limit}&orderby=${query === 'most' ? 'DESC' : 'ASC'}&partyIncludes=${party}&fromDate=${fromDate}&toDate=${toDate}&category=${voteCategory}&name=${nameParam}`;

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

  return (

    <div className="insights">

      <div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 mb-4 items-baseline p-4 flex-wrap">
          <div className='flex'>
            <label htmlFor="type" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">
              Which
            </label>
            <select
              id="type"
              className="select fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              name="type"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              {types.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>

          </div>

          <div className='flex'>
            <label htmlFor="name" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">
              {type === "MP" ? "Name" : "Title"}
            </label>
            <input
              id="name"  // Added for accessibility
              className="input fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              type="search"
              placeholder="includes text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {type === 'Division' && (
            <div className='flex'>
              <label htmlFor="voteCategory" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">
                type
              </label>
              <select
                id="voteCategory"  // Added id for accessibility
                className="select fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                name="voteCategory"
                onChange={(e) => setVoteCategory(e.target.value)}
                value={voteCategory}
              >
                {VOTING_CATEGORIES.map((value) => (
                  <option value={value} key={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )}

          {type === 'MP' && (

            <div className='flex'>
              <label htmlFor="partySelect" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">
                from
              </label>

              <select
                id="partySelect"
                className="select fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                name="party"
                onChange={(e) => setParty(e.target.value)}
                value={party}
              >
                {Object.values(Party)
                  .filter((i) => i !== "Unknown")
                  .map((i) => (
                    <option value={i} key={i}>
                      {i}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {type === 'Division' && (
            <div className='flex'>

              <label htmlFor="voteType" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">was voted</label>


              <select
                id="voteType"
                className="select fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                name="voteType"
                onChange={(e) => setVoteType(e.target.value)}
                value={voteType}
              >
                {voteTyps.map(i => (
                  <option value={i} key={i}>
                    {i}
                  </option>
                ))}
              </select>

            </div>
          )}
          <div className="flex">

            {type === 'Division' && <label htmlFor="leastMostSelct" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">the</label>}
            {type === 'MP' && <label htmlFor="leastMostSelct" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">voted the</label>}

            <select
              id="leastMostSelct"
              className="select fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              name="query"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            >
              {queries.map(query => (
                <option
                  value={query}
                  key={query}
                >
                  {query}
                </option>
              ))}
            </select>
          </div>

          {type === 'MP' && (
            <div className='flex'>

              <label htmlFor="categorySelect" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">on</label>

              <select
                id="categorySelect"
                className="select fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                name="voteCategory"
                onChange={(e) => setVoteCategory(e.target.value)}
                value={voteCategory}
              >
                {VOTING_CATEGORIES.map(value => (
                  <option
                    value={value}
                    key={value}
                  >
                    {value}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="fixedInput flex items-center">

            <label htmlFor="startSelect" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">Between</label>

            <input
              type="date"
              id="startSelect"
              name="from-date"
              className="min-w-[100px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
              value={fromDate}
            />

            <input
              type="date"
              id="toDate"
              name="to-date"
              className="ml-2 min-w-[100px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
              value={toDate}
            />

          </div>

          <div className='flex'>

            <label htmlFor="insightsLimit" className="min-w-[80px] md:min-w-0 pr-2 text-gray-700 dark:text-gray-300">limit</label>

            <input
              id="insightsLimit"
              className="input fixedInput min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
              type="number">
            </input>

          </div>

          <div className='w-full justify-center items-center' >
          <button
              className="w-full md:w-[700px] bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
              onClick={onSearch}
            >
              Go
            </button>
            </div>
        </div>

      </div>

      {isQuerying && <NeoTable data={data} title={"Insights"} onRowClick={getDetails} />}

    </div>


  );
}
