//@ts-nocheck
"use client"
import MpCard from '@/components/ui/MpCard';
import DivisionCard from '@/components/ui/DivisionCard';
import { config } from '../app.config';
import ky from 'ky';
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { ArrowUp } from "lucide-react"
import { ArrowDown } from "lucide-react"

import { Separator } from "@/components/ui/separator"

import CustomSvg from '@/components/custom/customSvg';
import MpSvg from '@/components/custom/mpSvg';
import DivisionSvg from '@/components/custom/divisionSvg';

import CustomSelect from "@/components/custom/customSelect";

import MpCardSkeleton from "./MpCardSkeleton";
import DivisionCardSkeleton from "./DivisionCardSkeleton";

import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible"

import { VOTING_CATEGORIES, PARTY_NAMES } from "../config/constants";

const skeletonArray = Array.from({ length: 100 }, (_, index) => index);

const types = [
  "MP",
  "Division"
]

const status = [
  "Active",
  "Inactive",
  "All"
]

const mpSortBy = [
  "Total Votes",
  "Voted Aye Count",
  "Voted No Count",
  "Time Served",
  "Name",
  "Party"
]

const mpFilterTypeKeys = [
  "Party",
  "Sex",
  "Year",
  "Votes"
]

const divisionFilterTypeKeys = [
  "Category",
  "Year"
]

const mpFilterTypeValues = {
  Party: PARTY_NAMES,
  Sex: ["Any", "M", "F"],
  Year: ["Any", 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  Votes: ["Any", "> 100", "> 200", "> 300", "> 400", "> 500", "> 600", "> 700", "> 800", "> 900", "> 1000"]
}

const divisionFilterTypeValues = {
  Category: VOTING_CATEGORIES,
  Year: ["Any", 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
}

const divisionSortBy = [
  "Title",
  "Voted Aye Count",
  "Voted No Count",
  "Total Votes",
  "Date"
]

const EARLIEST_FROM_DATE = "2003-11-12";

export default function Browse() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  //toolbar options
  const [type, setType] = useState("MP's");
  const [sortBy, setSortBy] = useState("Name");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [name, setName] = useState("");
  const [statusValue, setStatusValue] = useState("Active");

  const [filterTypeOptions, setFilterTypeOptions] = useState(mpFilterTypeValues[mpFilterTypeKeys[0]]);
  const [filterTypeKey, setFilterTypeKey] = useState(mpFilterTypeKeys[0]);
  const [filterTypeValue, setFilterTypeValue] = useState("Any");
  const [filterTypeKeys, setFilterTypeKeys] = useState(mpFilterTypeKeys);

  const [isOpen, setIsOpen] = useState(false)
  const [isControlsDown, setIsControlsDown] = useState(false);

  const [buttonHighlight, setButtonHighlight] = useState(false);

  //mps
  const [mps, setMps] = useState();
  const [filteredMps, setFilteredMps] = useState();

  //divisions
  const [divisions, setDivisions] = useState();
  const [filteredDivisions, setFilteredDivisions] = useState();

  const onSearchMps = async ({ searchKey, searchValue, searchName }) => {

    let paramKey = searchKey || filterTypeKey;
    let paramValue = searchValue || filterTypeValue || "Any";

    if (filterTypeKey.endsWith(":")) {
      paramKey = filterTypeKey.slice(0, -1);
    }
    if (filterTypeKey === "Year:" && filterTypeValue === "Any") {
      paramValue = 0
    }

    setDivisions(undefined);
    setFilteredDivisions(undefined);

    let url = `${config.mpsApiUrl}searchMps?${paramKey.toLowerCase()}=${paramValue}&status=${statusValue}`;

    if (searchName) {
      url = `${url}&name=${searchName}`
    }

    const result = await ky(url).json();

    setMps(result);
    setFilteredMps(result);
  };


  const onSearchDivisions = async ({ category = filterTypeValue, year, searchName }) => {

    setMps(undefined);
    setFilteredMps(undefined);

    //only set url when user changes value from dropdown not when value is triggered from deep link urfl 
    let url

    if (year) {
      url = `${config.mpsApiUrl}searchDivisions?year=${year}`;
    } else {
      url = `${config.mpsApiUrl}searchDivisions?category=${category}`;
    }

    if (searchName) {
      url = `${url}&name=${searchName}`
    }

    const result = await ky(url).json();

    setDivisions(result);
    setFilteredDivisions(result);
  }

  const onToggleSortDirection = () => {
    const newDirection = sortDirection === "ASC" ? "DESC" : "ASC";
    setSortDirection(newDirection);
    onChangeSortBy(sortBy, newDirection);
  }

  const removeAllQueryParams = (exclusions: Array<string> = []) => {

    const params = new URLSearchParams(searchParams);

    // Get all existing query parameter names
    const currentParams = Array.from(params.keys());

    // Filter parameters to remove (not in exclusions)
    const paramsToRemove = currentParams.filter(param => !exclusions.includes(param));

    // Delete the filtered parameters
    paramsToRemove.forEach(param => params.delete(param));

    return params; // Return the modified URLSearchParams object
  };

  const onChangeType = (value, changeUrl = true) => {

    //if this is called from deep link url then dont change the url 
    if (changeUrl) {
      removeAllQueryParams();
      router.push(`browse/?type=${value}`, { scroll: true });
    }

    setType(value);
    setFilterTypeValue("Any")
    setName("")


    if (value !== type) {
      if (value.startsWith('MP')) {

        setSortBy("Name");
        setFilterTypeKeys(mpFilterTypeKeys);
        setFilterTypeKey(mpFilterTypeKeys[0])
        setFilterTypeOptions(mpFilterTypeValues[mpFilterTypeKeys[0]])

        if (changeUrl) {
          onSearchMps({ party: "Any", searchKey: mpFilterTypeKeys[0], searchValue: "Any" });
        }

      } else {

        setSortBy("Title");
        setFilterTypeKeys(divisionFilterTypeKeys);
        setFilterTypeKey(divisionFilterTypeKeys[0])
        setFilterTypeOptions(divisionFilterTypeValues[divisionFilterTypeKeys[0]])

        if (changeUrl) {
          onSearchDivisions({ category: "Any" });
        }

      }
    }
  }

  const onChangeMpParty = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?party=${encodeURIComponent(value)}&status=${statusValue}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();
      setMps(result);
      setFilteredMps(result);

    }
  }

  const sortDivisions = (
    value: string,
    direction: "ASC" | "DESC"
  ) => {

    const compareFunctions: Record<string, (a: Division, b: Division) => number> = {
      Title: (a, b) => a.title.localeCompare(b.title),
      "Voted Aye Count": (a, b) => a.ayeCount - b.ayeCount,
      "Voted No Count": (a, b) => a.noCount - b.noCount,
      "Total Votes": (a, b) => (a.noCount + a.ayeCount) - (b.noCount + b.ayeCount),
      Date: (a, b) => compareNeoDates(a.date, b.date),
    };

    const compareFn = compareFunctions[value];

    if (!compareFn) {
      throw new Error(`Invalid sort value: ${value}`);
    }

    const sortedDivisions = [...divisions].sort(compareFn);
    return direction === "DESC" ? sortedDivisions.reverse() : sortedDivisions;
  }

  const sortMps = (value: string, direction: "ASC" | "DESC") => {

    const compareFunctions: Record<string, (a: MP, b: MP) => number> = {
      Name: (a, b) => a.name.localeCompare(b.name),
      Party: (a, b) => a.party.localeCompare(b.party),
      "Time Served": (a, b) => compareNeoDates(a.startDate, b.startDate),
      "Total Votes": (a, b) => a.totalVotes - b.totalVotes,
      "Voted Aye Count": (a, b) => a.ayeVotes - b.ayeVotes,
      "Voted No Count": (a, b) => a.noVotes - b.noVotes,
    };

    const compareFn = compareFunctions[value];

    // Handle the case where the value doesn't match any of the keys
    if (!compareFn) {
      throw new Error(`Invalid sort value: ${value}`);
    }

    const sortedMps = [...mps].sort(compareFn);
    return direction === "DESC" ? sortedMps.reverse() : sortedMps;
  }

  const onChangeSortBy = (value, direction = sortDirection) => {

    setSortBy(value);

    if (type.startsWith("MP")) {
      const sortedMps = sortMps(value, direction);
      setFilteredMps(sortedMps);
    } else {
      const sortedDivisions = sortDivisions(value, direction);
      setFilteredDivisions(sortedDivisions);
    }

  }

  const getMps = useCallback(async ({ party = "Any", year = 0, sex = "Any", searchName, status = "All" }) => {

    let url = `${config.mpsApiUrl}searchMps?party=${encodeURIComponent(party||"Any")}&year=${year || 0}&sex=${sex || "Any"}&status=${status || "Active"}`

    if (searchName) {
      url = `${url}&name=${searchName}`
    }

    const result = await fetch(url);

    const mpsResult = await result.json();
    setMps(mpsResult);
    setFilteredMps(mpsResult);
  }, []);

  useEffect(() => {

    let type, divisionCategory, party, year, sex, searchName, status;

    //set vaues from url params if loading for the first time 
    if ((!mps || !mps.length) && (!divisions || !divisions.length)) {

      type = searchParams.get('type');

      if (type) {
        setType(type);
        onChangeType(type, false);

        if (type.startsWith("MP")) {
          party = searchParams.get('party');

          if (party) {
            setFilterTypeKey("Party")
            setFilterTypeValue(party);
          }

          sex = searchParams.get('sex');

          if (sex) {
            setFilterTypeValue(sex);
            onChangeFilterTypeKey("Sex")
          }

          status = searchParams.get('status');

          if (status) {
            setStatusValue(status);
          }

        } else if (type.startsWith("Division")) {

          divisionCategory = searchParams.get('category') || searchParams.get('Category');;

          if (divisionCategory) {
            setFilterTypeKey("category")
            setFilterTypeValue(divisionCategory);
          }

        }
      }

      year = searchParams.get('year');

      if (year) {
        setFilterTypeValue(year);
        onChangeFilterTypeKey("Year")
      }

      searchName = searchParams.get("name");

      if (searchName) {
        setName(searchName);
      }

      if (type?.startsWith("MP")) {
        getMps({ party, year, sex, searchName, status });
      } else if (type.startsWith("Division")) {
        onSearchDivisions({ category: divisionCategory || "Any", year, searchName });
      }
    }
  }, []);

  const compareNeoDates = (date1, date2) => {

    // Compare years
    if (date1.year.low !== date2.year.low) {
      return date1.year.low - date2.year.low;
    }

    // Compare months
    if (date1.month.low !== date2.month.low) {
      return date1.month.low - date2.month.low;
    }

    // Compare days
    return date1.day.low - date2.day.low;
  }

  const onAddQueryParamToUrl = ({ key, value }: { key: string; value: string }) => {
    const params = new URLSearchParams(searchParams);

    // Exclusive query types
    const exclusiveKeys = ["year", "votes", "sex", "category", "party"];

    // Delete other exclusive params if a new one is added
    if (exclusiveKeys.includes(key.toLowerCase())) {
      exclusiveKeys.forEach(
        (exclKey) => exclKey !== key.toLowerCase() && params.delete(exclKey)
      );
    }

    // Special handling for "name"
    if (key.toLowerCase() === "name" && !value) {
      params.delete("name");
    } else {
      params.set(key.toLowerCase(), value);
    }

    const newSearchParams = params.toString();
    router.push(`${pathname}?${newSearchParams}`, { scroll: true });
  };

  const onChangeDivisionCategory = async (value) => {

    setDivisions(undefined);
    setFilteredDivisions(undefined);

    let url = `${config.mpsApiUrl}searchDivisions?category=${value}`;
    if (name) {
      url = `${url}&name=${name}`
    }

    const result = await ky(url).json();

    setDivisions(result);
    setFilteredDivisions(result);

    onAddQueryParamToUrl({ key: "category", value });

  }

  const onChangeDivisionYear = async (value) => {

    setDivisions(undefined);
    setFilteredDivisions(undefined);

    const result = await ky(`${config.mpsApiUrl}searchDivisions?year=${value}`).json();

    setDivisions(result);
    setFilteredDivisions(result);

  }

  const onChangeFilterTypeKey = (value) => {

    setFilterTypeKey(value);

    if (type.startsWith("MP")) {
      setFilterTypeOptions(mpFilterTypeValues[value]);
    } else {
      setFilterTypeOptions(divisionFilterTypeValues[value]);
    }
  }


  const onChangeMpSex = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?sex=${value}&status=${statusValue}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);

    }
  }

  const onChangeMpYear = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?year=${value === "Any" ? 0 : value}&status=${statusValue}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);

    }
  }

  const onChangeFilterTypeValue = (value) => {
    
    setFilterTypeValue(value);

    if (type.startsWith("MP")) {
      if (filterTypeKey.startsWith("Party")) {
        onChangeMpParty(value);
      } else if (filterTypeKey === "Sex") {
        onChangeMpSex(value);
      } else if (filterTypeKey === "Year") {
        onChangeMpYear(value);
      } else if (filterTypeKey === "Votes") {
        onChangeMpVotes(value);
      }
    } else {
      if (filterTypeKey.toLocaleLowerCase() === "category") {
        onChangeDivisionCategory(value);
      } else if (filterTypeKey === "Year") {
        onChangeDivisionYear(value);
      } else {
        console.log("unknown div type ", filterTypeKey);
      }
    }

    onAddQueryParamToUrl({ key: filterTypeKey, value });
  }

  const onQueryMp = async (id: number) => {
    router.push(`/mp?id=${id}`, { scroll: true });    
  }

  const onQueryDivision = async (id) => {
    router.push(`/division?id=${id}`, { scroll: true });
  }

  const applyName = type => {
    onAddQueryParamToUrl({ key: "name", value: name });
    type.startsWith("MP") ? onSearchMps({ searchName: name }) : onSearchDivisions({ searchName: name });
    setButtonHighlight(false);
  }

  const onChangeName = value => {
    setName(value);
    setButtonHighlight(true);
  }

  const onChangeMpVotes = async (value) => {

    if (value !== filterTypeValue) {
      setMps(undefined);
      setFilteredMps(undefined);

      let url = `${config.mpsApiUrl}searchMps?votes=${value === "Any" ? 0 : value}&status=${statusValue}`;
      if (name) {
        url = `${url}&name=${name}`
      }

      const result = await ky(url).json();

      setMps(result);
      setFilteredMps(result);

    }
  }

  const onChangeStatus = async (value) => {

    onAddQueryParamToUrl({ key: "status", value });
    setStatusValue(value);

    let url = `${config.mpsApiUrl}searchMps?${filterTypeKey.toLowerCase()}=${filterTypeValue}&status=${value}`;

    if (name) {
      url = `${url}&name=${name}`
    }

    const result = await ky(url).json();

    setMps(result);
    setFilteredMps(result);
  }

  const onToggleControls = () => {
    setIsControlsDown(!isControlsDown);
  }


  return (
    <>
      <div className="w-full flex justify-between p-3 flex-wrap gap-2">
        <div className="flex items-center w-full justify-between md:w-2/3 lg:w-1/2 xl:w-1/3">

          <span className="w-[100px] flex gap-3">

            <span className='ml-2'>
              {type.includes("MP") && (
                <MpSvg className='' />
              )}
              {type.includes("Division") && (
                <DivisionSvg className='' />
              )}
            </span>

            <Badge variant={(filteredMps && filteredMps.length) || (filteredDivisions && filteredDivisions.length) ? "default" : "secondary"}>
              {type.startsWith("MP") && filteredMps && filteredMps.length}
              {type.startsWith("Division") && filteredDivisions && filteredDivisions.length}
              {!filteredMps && !filteredDivisions && <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div>}
            </Badge>
          </span>

          <div style={{ width: 150 }}>
            <CustomSelect
              id="selectType"
              value={type}
              onValueChange={onChangeType}
              options={types.map(str => ({ value: `${str}'s`, label: `${str}'s`, }))}
            />
          </div>

          <Button
            variant='outline'
            onClick={onToggleControls}
            className='flex gap-2'
          >
            Filters
            {isControlsDown ? <ArrowUp /> : <ArrowDown />}
          </Button>
        </div>

        <Collapsible
          open={isControlsDown}
          onOpenChange={setIsOpen}
          className="flex w-full"
        >

          <CollapsibleContent className="flex flex-col w-full md:w-2/3 lg:w-1/2 xl:w-1/3 gap-2">

            <div className="flex gap-2 items-baseline">

              <CustomSelect
                value={filterTypeKey}
                onValueChange={onChangeFilterTypeKey}
                options={filterTypeKeys.map(str => ({ value: str, label: str }))}
              />

              <CustomSelect
                value={filterTypeValue}
                onValueChange={onChangeFilterTypeValue}
                options={filterTypeOptions.map(str => ({ value: str, label: str }))}
              />

            </div>

            <div className="flex gap-2 items-baseline pl-3">
              <Label htmlFor="party">{type.startsWith("MP") ? "Name" : "Title"}</Label>
              <Input
                type="search"
                title="name"
                placeholder={type.startsWith("MP") ? 'filter by MP name' : 'filter by division title'}
                value={name}
                onChange={(e) => onChangeName(e.target.value)}
              />

              <Button
                variant={buttonHighlight ? "default" : "outline"}
                className='button iconbutton'
                onClick={() => applyName(type)}
              >
                Apply
              </Button>
            </div>

            {type.startsWith("MP") && (
              <div className="flex gap-2 items-baseline pl-3">

                <Label htmlFor="soryBy">Status</Label>
                <CustomSelect
                  value={statusValue}
                  onValueChange={onChangeStatus}
                  options={status.map(str => ({ value: str, label: str }))}
                />
              </div>
            )}

            <div className="flex gap-2 pl-3 w-full justify-between">

              <div className="flex items-baseline flex-1">
                <Label htmlFor="soryBy" className='min-w-[46px]'>Sort</Label>
                <CustomSelect
                  value={sortBy}
                  onValueChange={onChangeSortBy}
                  options={type.startsWith("MP") ? mpSortBy.map(str => ({ value: str, label: str })) : divisionSortBy.map(str => ({ value: str, label: str }))}
                />
              </div>

              <Button
                variant="outline"
                className="min-w-[71px]"
                onClick={onToggleSortDirection}
              >
                {sortDirection === "ASC" && (
                  <CustomSvg
                    path='M6 3l-6 8h4v10h4v-10h4l-6-8zm16 14h-8v-2h8v2zm2 2h-10v2h10v-2zm-4-8h-6v2h6v-2zm-2-4h-4v2h4v-2zm-2-4h-2v2h2v-2z"'
                  />
                )}

                {sortDirection === "DESC" && (
                  <CustomSvg
                    path='M6 21l6-8h-4v-10h-4v10h-4l6 8zm16-4h-8v-2h8v2zm2 2h-10v2h10v-2zm-4-8h-6v2h6v-2zm-2-4h-4v2h4v-2zm-2-4h-2v2h2v-2z'
                  />
                )}
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

      </div>

      <main className="grid p-1 gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7">

        {type.startsWith("MP") && !filteredMps && skeletonArray.map((item, index) => <MpCardSkeleton key={'skel-' + index} />)}
        {type.startsWith("Division") && !filteredDivisions && skeletonArray.map((item, index) => <DivisionCardSkeleton key={'skel' + index} />)}

        {Boolean(divisions && divisions.length) && filteredDivisions
          .filter((item, index, self) =>
            index === self.findIndex(t => t.id === item.id)  // Keep only the first occurrence of an id
          )
          .map(i => (
            <DivisionCard item={i} onQueryDivision={onQueryDivision} key={i.id} />
          ))}

        {Boolean(mps && mps.length) && filteredMps.map(i => (
          <MpCard item={i} onQueryMp={onQueryMp} key={i.id} />
        ))}
      </main>
    </>

  );
}


