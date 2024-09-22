"use client"

import * as React from "react"
import ky from 'ky';
import { Party } from "../types";

import Image from 'next/image';

import ChipNavigation from "@/components/ui/chipNavigation";

import Search from "@/components/ui/search";

import { useEffect } from "react"
import { PartyCard } from "./partyCard";

export default function Home() {
    
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
  }, []);

  return (

    <div className="p-4">

      <Image
        className="absolute top-12 sm:top-28 left-10 sm:left-32 transform -translate-y-1/2"
        src="./handshake.svg"
        alt="Symbolic handshake representing connections between MPs and other entities" 
        width={40}
        height={40}
      />

      <Image
        className="absolute transform -translate-y-1/2 left-1/2 -translate-x-1/2"
        src="./gate.svg"
        alt="House of commons logo" 
        width={40}
        height={40}
      />

      <Image
        className="absolute top-12 sm:top-28 right-10 sm:right-32 transform -translate-y-1/2"
        src="./money.svg"
        alt="Money image representing donations made to political parties"
        width={40}
        height={40}
      />

      <div className="flex items-center justify-center space-x-4 p-6 mt-2">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 shadow-sm">Commons Connect</h1>
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-600 dark:text-gray-300 mb-4 italic">Connecting MPs, Votes, Donations and Contracts</h2>          
        </div>
      </div>

      <Search />

      <ChipNavigation />
      
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {parties && parties.filter(i => i.name !== "Speaker").map(i => <PartyCard key={i.name} party={i} />)}
      </div>
      
    </div>


  )
}
