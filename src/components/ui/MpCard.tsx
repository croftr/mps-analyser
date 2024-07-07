// @ts-nocheck
"use client"
import * as React from 'react'
import Image from "next/image";
import CustomSvg from '../custom/customSvg';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const male = <CustomSvg tooltipContent="male" path="M16 2v2h3.586l-3.972 3.972c-1.54-1.231-3.489-1.972-5.614-1.972-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.125-.741-4.074-1.972-5.614l3.972-3.972v3.586h2v-7h-7zm-6 20c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
const female = <CustomSvg tooltipContent="female" path="M21 9c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.632 3.501 8.443 8 8.941v2.059h-3v2h3v2h2v-2h3v-2h-3v-2.059c4.499-.498 8-4.309 8-8.941zm-16 0c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" />

const active = <CustomSvg path="M9 16.2L4.8 12l-1.4 1.4L9 19.2l12-12-1.4-1.4L9 16.2z" />



const MpCard = ({ onQueryMp, item = { startDate: { year: {} } } }) => {

  return (

    <div
      className="relative p-4 pt-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onQueryMp(item.id)}
    >
      <div
        title={item.gender === "M" ? "Male" : "Female"}
        className="absolute top-2 right-2 flex items-center"
      >
        {item.gender === "M" ? male : female}
      </div>

      <TooltipProvider>
        <div className="flex items-start">
          <Tooltip>
            <TooltipTrigger>
              {item.isActive ? <span class="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span> : <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>}              
            </TooltipTrigger>
            <TooltipContent>
            {item.isActive ? <p>Active</p> : <p>Inactive</p> }
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

      <span className="block truncate text-gray-600 dark:text-gray-300">{item.party}</span>
      <p className="text-sm text-gray-500">{item.startDate.day.low}/{item.startDate.month.low}/{item.startDate.year.low}</p>

      <div className="mt-2 grid grid-cols-3 text-center text-sm border rounded-md border-gray-400 dark:border-gray-600">
        <span className="py-1 border-b border-r border-gray-400 dark:border-gray-600">Votes</span>
        <span className="py-1 border-b border-r border-gray-400 dark:border-gray-600">Aye</span>
        <span className="py-1 border-b border-gray-600 last:border-r dark:border-gray-600">No</span>
        <span className="py-1"> {item.totalVotes} </span>
        <span className="py-1 border-r border-l border-gray-400 dark:border-gray-600"> {item.ayeVotes} </span>
        <span className="py-1"> {item.noVotes} </span>
      </div>

    </div>

  )
}

export default MpCard;
