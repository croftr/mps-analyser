"use client"

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ky from 'ky';
import DivisionTable from "./divisionTable";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import CustomSvg from '@/components/custom/customSvg';
import DivisionSvg from '@/components/custom/divisionSvg';

export default function Division() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {

  const router = useRouter()

  const [votedAye, setVotedAye] = useState<any[] | undefined>(undefined);
  const [votedNo, setVotedNo] = useState<any[] | undefined>(undefined);
  const [absent, setAbsent] = useState<any[] | undefined>(undefined);

  const [showVotedAye, setShowVotedAye] = useState(true);
  const [showVotedNo, setShowVotedNo] = useState(true);
  const [showAbsent, setShowAbsent] = useState(true);

  const [divisionDetails, setDivisionDetails] = useState<Record<string, any> | undefined>({});

  const searchParams = useSearchParams()

  const onQueryDivision = async (id: string) => {

    console.log("onQueryDivision ", id);


    setDivisionDetails(undefined);

    const result: any = await ky(`https://commonsvotes-api.parliament.uk/data/division/${id}.json`).json();

    setDivisionDetails(result);

    const ayesList: Array<any> = [];
    //@ts-ignore
    result.Ayes.forEach(i => ayesList.push({ id: i.MemberId, name: i.Name, party: i.Party }));
    setVotedAye(ayesList);

    const noList: Array<any> = [];
    //@ts-ignore
    result.Noes.forEach(i => noList.push({ id: i.MemberId, name: i.Name, party: i.Party }));
    setVotedNo(noList);

    const absentList: Array<any> = [];
    //@ts-ignore
    result.NoVoteRecorded.forEach(i => absentList.push({ id: i.MemberId, name: i.Name, party: i.Party }));
    setAbsent(absentList);

  }

  const onQueryMp = (id: number) => {
    console.log("go ", id);

    router.push(`mp?id=${id}`, { scroll: true });

  }

  useEffect(() => {

    const regex = /id=(\d+)/; // Match "id=" followed by digits
    const match = searchParams.toString().match(regex);

    if (match) {
      const paramId = match[1];
      console.log(paramId); // Output: 1815
      onQueryDivision(paramId);
    } else {
      console.error("ID not found in the string ", searchParams);
    }

  }, [searchParams])

  return (

    <section id="mpDetailsPage" className="flex flex-col items-center justify-between">

      <div className="header flex flex-col items-start justify-center p-4 rounded-md dark:bg-gray-800 bg-gray-100 dark:text-white gap-2">

        <div className="flex gap-2">
          <DivisionSvg className="min-w-[30px]" />
          <p className="text-lg">{divisionDetails?.Title}</p>
        </div>

        <div className="flex gap-2">
          <CustomSvg 
            className="min-w-[30px]" 
            path='M17 3v-2c0-.552.447-1 1-1s1 .448 1 1v2c0 .552-.447 1-1 1s-1-.448-1-1zm-12 1c.553 0 1-.448 1-1v-2c0-.552-.447-1-1-1-.553 0-1 .448-1 1v2c0 .552.447 1 1 1zm13 13v-3h-1v4h3v-1h-2zm-5 .5c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5-4.5 2.019-4.5 4.5zm11 0c0 3.59-2.91 6.5-6.5 6.5s-6.5-2.91-6.5-6.5 2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5zm-14.237 3.5h-7.763v-13h19v1.763c.727.33 1.399.757 2 1.268v-9.031h-3v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-9v1c0 1.316-1.278 2.339-2.658 1.894-.831-.268-1.342-1.111-1.342-1.984v-.91h-3v21h11.031c-.511-.601-.938-1.273-1.268-2z' />        
          <p className="text-xl font-semibold mb-2">{divisionDetails?.Date}</p>
        </div>
      </div>

      <div className="flex p-2 gap-4">
        <div className='flex items-center gap-2 gridCell'>
          <Switch id="vaexclude" checked={showVotedAye} onCheckedChange={() => setShowVotedAye(!showVotedAye)} />
          <Label htmlFor="vaexclude">Aye ({votedAye?.length || 0})</Label>
        </div>
        <div className='flex items-center gap-2 gridCell'>
          <Switch id="vaexclude" checked={showVotedNo} onCheckedChange={() => setShowVotedNo(!showVotedNo)} />
          <Label htmlFor="vaexclude">No ({votedNo?.length || 0})</Label>
        </div>
        <div className='flex items-center gap-2 gridCell'>
          <Switch id="vaexclude" checked={showAbsent} onCheckedChange={() => setShowAbsent(!showAbsent)} />
          <Label htmlFor="vaexclude">Absent ({absent?.length || 0})</Label>
        </div>
      </div>

      <div className="flex gap-8 flex-wrap justify-between w-full p-2">
        {showVotedAye && <DivisionTable data={votedAye} title="Voted Aye" onQueryMp={onQueryMp} />}
        {showVotedNo && <DivisionTable data={votedNo} title="Voted No" onQueryMp={onQueryMp} />}
        {showAbsent && <DivisionTable data={absent} title="were Absent" onQueryMp={onQueryMp} />}
      </div>
    </section>
  );
}
