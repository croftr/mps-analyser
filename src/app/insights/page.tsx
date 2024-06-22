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

  const [data, setData] = useState([]);
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

  const onSearch = async () => {

    setData([]);
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
      router.push(`mp?id=${id}`, { scroll: false });
    } else {
      const id = row._fields[2].low;
      router.push(`division?id=${id}`, { scroll: false });
    }
  }

  return (

    <div className="insights">
      <div className="wrapper">
        <div className="insights__query">

          <label htmlFor="type" className="fixedLabel min-w-[50px] text-right pr-2 text-gray-700 dark:text-gray-300">
            Which
          </label>
          <select
            id="type" // Added id for accessibility
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

          <label htmlFor="name" className="fixedLabel min-w-[50px] text-right pr-2 text-gray-700 dark:text-gray-300">
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

          {type === 'Division' && (
            <>
              <label htmlFor="voteCategory" className="fixedLabel min-w-[50px] text-right pr-2 text-gray-700 dark:text-gray-300">
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
            </>
          )}

          {type === 'MP' && (
            <span className="fixedLabel min-w-[50px] text-right pr-2 text-gray-700 dark:text-gray-300">
              from
            </span>
          )}

          {type === 'MP' && (
            <select
              id="party" // Added id for accessibility
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
          )}

          <span className="fixedLabel min-w-[50px] text-right pr-2 text-gray-700 dark:text-gray-300">
            {type === 'MP' ? "voted the" : "was voted"}
          </span>

          {type === 'Division' && (
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
          )}

          {type === 'Division' && <span className='fixedLabel'>the</span>}

          <select
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

          {type === 'MP' && (
            <>
              <span className='fixedLabel'>on</span>

              <select
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
            </>
          )}

          <label className='fixexLabel' htmlFor="start">Between</label>

          <div className="datePicker fixedInput flex items-center">
            <input
              type="date"
              id="start"
              name="from-date"
              className="min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
              value={fromDate}
            />

            <input
              type="date"
              id="toDate"
              name="to-date"
              className="ml-2 min-w-[150px] w-auto max-w-[250px] bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
              value={toDate}
            />
          </div>

          <button
            className="button fixedButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={onSearch}
          >
            Go
          </button>

        </div>

        <div className="wrapper">
          <div className="insights__config">
            <label>Limit</label>

            <input
              className="input"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              onKeyDown={(e) => { if (e.key === 'Enter') onSearch() }}
              type="number">
            </input>

            <button
              // style={{ width: '100%' }}
              className='button'
              onClick={onSearch}
            >
              Go
            </button>
          </div>
        </div>

      </div>

      <NeoTable data={data} title={"Insights"} onRowClick={getDetails} />

    </div>


  );
}
