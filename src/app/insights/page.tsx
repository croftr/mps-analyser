'use client';
import { useSearchParams } from 'next/navigation';
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

  const searchParams = useSearchParams();
  const [paramId, setParamId] = useState("");

  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [columns, setColumns] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [progress, setProgress] = useState(false);
  const [fromDate, setFromDate] = useState(new Date(EARLIEST_FROM_DATE).toISOString().substr(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().substr(0, 10));

  const [type, setType] = useState(types[0]);
  const [query, setQuery] = useState(queries[0]);
  const [party, setParty] = useState("Any");
  const [voteType, setVoteType] = useState(voteTyps[0]);
  const [voteCategory, setVoteCategory] = useState(VOTING_CATEGORIES[0]);
  const [limit, setLimit] = useState(10);


  useEffect(() => {
    if (searchParams) {
      const newParamId = searchParams.toString().split("=")[1];
      setParamId(newParamId);
    }
  }, [searchParams]);

  const onSearch = async () => {
    setColumns([]);
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

  return (

    <div className="insights">

      <div className="wrapper">

        <div className="insights__query">

          <span className='fixedLabel'>Which</span>

          <select
            className="select fixedInput"
            name="type"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            {types.map(type => (
              <option
                value={type}
                key={type}
              >
                {type}
              </option>
            ))}
          </select>

          <span className='fixedLabel'>{type === "MP" ? "Name" : "Title"}</span>

          <input
            className="input fixedInput"
            type="search"
            placeholder="includes text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {type === 'Division' && (
            <>
              <span className='fixedLabel'>type</span>

              <select
                className="select fixedInput"
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

          {type === 'MP' && (
            <span className='fixedLabel'>from</span>
          )}

          {type === 'MP' && (

            <select
              className="select fixedInput"
              name="party"
              onChange={(e) => setParty(e.target.value)}
              value={party}
            >
              {Object.values(Party).filter(i => i !== "Unknown").map(i => (
                <option
                  value={i}
                  key={i}
                >
                  {i}
                </option>
              ))}
            </select>


          )}


          {type === 'MP' ? <span className='fixedLabel'>voted the</span> : <span className='fixedLabel'>was voted</span>}

          {type === 'Division' && (
            <select
              className="select fixedInput"
              name="voteType"
              onChange={(e) => setVoteType(e.target.value)}
              value={voteType}
            >
              {voteTyps.map(i => (
                <option
                  value={i}
                  key={i}
                >
                  {i}
                </option>
              ))}
            </select>
          )}

          {type === 'Division' && <span className='fixedLabel'>the</span>}

          <select
            className="select fixedInput"
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
                className="select fixedInput"
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

          <div style={{ padding: 0, paddingLeft: 0 }} className="datePicker fixedInput select">

            <input
              type="date"
              id="start"
              name="from-date"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setFromDate(e.target.value)}
              value={fromDate}
            />

            {/* <label for="start" style={{ marginLeft: 8, marginRight: 8 }}>and:</label> */}
            <input
              style={{ marginLeft: 8 }}
              type="date"
              id="toDate"
              name="to-date"
              min={EARLIEST_FROM_DATE}
              max={new Date().toISOString().substr(0, 10)}
              onChange={(e) => setToDate(e.target.value)}
              value={toDate}
            />
          </div>

          <button
            className='button fixedButton'
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

      <NeoTable data={data} title={"Insights"} />

    </div>


  );
}
