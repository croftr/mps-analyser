"use client"

import * as React from "react"
import ky from 'ky';
import { useRouter } from 'next/navigation'
import { Vote, Party } from "../types";
import DivisionSvg from "@/components/custom/divisionSvg";

import Image from 'next/image';

import ChipNavigation from "@/components/ui/chipNavigation";

import Search from "@/components/ui/search";


import { useEffect } from "react"
import { PartyCard } from "./partyCard";

export default function Home() {

  const router = useRouter();
  
  const [total, setTotal] = React.useState(0);
  const [recentVotes, setRecentVotes] = React.useState<Vote[] | undefined>();
  const [parties, setParties] = React.useState<Party[] | undefined>();

  const getPartyCounts = async () => {

    const now = new Date(); // Get the current date and time
    const jsonDateString = now.toISOString(); // Format as ISO 8601 string

    const result = await ky(`https://members-api.parliament.uk/api/Parties/StateOfTheParties/1/${jsonDateString}`).json();

    const data: Array<any> = [];

    //@ts-ignore
    result.items.forEach(item => {
      const record = { party: item.value.party.name, members: item.value.total, fill: `#${item.value.party.backgroundColour}` }
      data.push(record);
    })


    const totalMembers = data.reduce((sum, party) => sum + party.members, 0);

    setTotal(totalMembers);

  }

  const getRecentVotes = async () => {

    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 2);

    const year = oneMonthAgo.getFullYear();
    const month = (oneMonthAgo.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = oneMonthAgo.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    const result = await ky(`https://commonsvotes-api.parliament.uk/data/divisions.json/search?queryParameters.take=10&queryParameters.startDate=${formattedDate}`).json();

    //@ts-ignore
    setRecentVotes(result);
    const data: Array<any> = [];

  }

  const getParties = async () => {

    const now = new Date();
    const formattedDate = now.toUTCString();

    const result = await ky(`https://members-api.parliament.uk/api/Parties/StateOfTheParties/1/${formattedDate}`).json();

    const partiesArray: Array<Party> = []

    //@ts-ignore
    result.items.forEach(item => {

      const party: Party = {
        name: item.value.party.name,
        foregroundColour: item.value.party.foregroundColour,
        backgroundColour: item.value.party.backgroundColour,
        total: item.value.total,
      }
      partiesArray.push(party);
    });

    setParties(partiesArray);
  }

  useEffect(() => {
    getPartyCounts();
    getParties();
    getRecentVotes();    
  }, []);

  const onQueryDivision = async (id: number) => {
    router.push(`division?id=${id}`, { scroll: true });
  }

  return (

    <div className="p-4">

      <Image
        className="absolute top-12 sm:top-28 left-10 sm:left-32 transform -translate-y-1/2"
        src="./handshake.svg"
        alt="Handshake"
        width={40}
        height={40}
      />

      <Image
        className="absolute transform -translate-y-1/2 left-1/2 -translate-x-1/2"
        src="./gate.svg"
        alt="Center Image"
        width={40}
        height={40}
      />

      <Image
        className="absolute top-12 sm:top-28 right-10 sm:right-32 transform -translate-y-1/2"
        src="./money.svg"
        alt="Money"
        width={40}
        height={40}
      />

      <div className="flex items-center justify-center space-x-4 p-6 mt-2">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 shadow-sm">Comons Connect</h1>
          <p className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-300 italic">Connecting MPs, Votes, Donations and Contracts</p>
        </div>
      </div>

      <Search />

      <ChipNavigation />
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {parties && parties.filter(i => i.name !== "Speaker").map(i => <PartyCard key={i.name} party={i} />)}
      </div>


      {/* {recentVotes && recentVotes.length === 0 && <h1>No Votes in the past 2 months</h1>}
      {recentVotes && recentVotes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="mt-4 text-xl md:text-2xl font-bold text-gray-900 dark:text-white text-center md:text-left">
            Recent Votes
          </h3>
          {recentVotes.map(i => (
            <div className="mt-2" key={i.DivisionId}>

              <div className="p-4 bg-white shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 cursor-pointer flex flex-col justify-between" onClick={() => onQueryDivision(i.DivisionId)}>
                <div className="flex align-top gap-2">
                  <div>
                    <DivisionSvg />
                  </div>

                  <h4 className="text-xl font-semibold dark:text-white line-clamp-3" style={{}}>
                    {i.Title}
                  </h4>
                </div>

                <span className="font-medium text-gray-400 dark:text-gray-500">{i.Date}</span>

              </div>

            </div>))}
        </div>
      )} */}
    </div>


  )
}
