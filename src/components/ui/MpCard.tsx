// @ts-nocheck
"use client"
import * as React from 'react'
import Image from "next/image";
import CustomSvg from '../custom/customSvg';

import { PARTY_COLOUR } from ".././../app/config/constants";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const active = <CustomSvg path="M9 16.2L4.8 12l-1.4 1.4L9 19.2l12-12-1.4-1.4L9 16.2z" />

interface MpCardProps {
  onQueryMp?: (item: any) => void;
  item: {
    id: number;
    name: string;
    party: string;
    isActive: boolean;
    startDate: any; // Keep as 'any' for flexibility
    endDate: any;   // Keep as 'any' for flexibility
  };
  isFormatedDates?: boolean;       // Optional flag for date formatting (defaults to false)
  isDisplayingTable?: boolean;     // Optional flag for table display (defaults to true)
  className?: string
}

const MpCard = ({ onQueryMp, item, isFormatedDates = false, isDisplayingTable = true, className }: MpCardProps) => {

  return (

    <div
      className={`${className} relative p-4 pb-2 pt-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer`}
      onClick={() => onQueryMp(item.id)}
    >

      <TooltipProvider>
        <div className="flex items-start">
          <Tooltip>
            <TooltipTrigger>
              {item.isActive ? <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span> : <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>}
            </TooltipTrigger>
            <TooltipContent>
              {item.isActive ? <p>Active</p> : <p>Inactive</p>}
            </TooltipContent>
          </Tooltip>
          <h4 className="font-semibold text-lg mb-2">{item.name}</h4>
        </div>
      </TooltipProvider>

      <div className="relative mb-1 aspect-square"> {/* Added aspect-square */}
        <Image
          className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
          fill
          src={`https://members-api.parliament.uk/api/Members/${item.id}/Thumbnail`}
          alt="MpImage"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className='flex items-baseline gap-4'>
        <span
          className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium mt-2 mb-1" // Added Tailwind classes
          style={{
            backgroundColor: PARTY_COLOUR[item.party]?.backgroundColour,
            color: PARTY_COLOUR[item.party]?.foregroundColour,
          }}
        >
          {item.party}
        </span>

        {isFormatedDates && <p className="font-medium">{new Date(item.startDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
        {!isFormatedDates && <p className="text-sm text-gray-500">{item.startDate.day.low}/{item.startDate.month.low}/{item.startDate.year.low}</p>}

      </div>

      {isDisplayingTable && (<div className="mt-2 grid grid-cols-3 text-center text-sm border rounded-md border-gray-400 dark:border-gray-600">
        <span className="py-1 border-b border-r border-gray-400 dark:border-gray-600">Votes</span>
        <span className="py-1 border-b border-r border-gray-400 dark:border-gray-600">Aye</span>
        <span className="py-1 border-b border-gray-600 last:border-r dark:border-gray-600">No</span>
        <span className="py-1"> {item.totalVotes} </span>
        <span className="py-1 border-r border-l border-gray-400 dark:border-gray-600"> {item.ayeVotes} </span>
        <span className="py-1"> {item.noVotes} </span>
      </div>)}


    </div>

  )
}

export default MpCard;
