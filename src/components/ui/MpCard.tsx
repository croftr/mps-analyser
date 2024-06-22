// @ts-nocheck
"use client"
import { useEffect } from 'react';

import Image from "next/image";

import * as React from 'react'

const male = <svg className="standalone-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><path d="M16 2v2h3.586l-3.972 3.972c-1.54-1.231-3.489-1.972-5.614-1.972-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.125-.741-4.074-1.972-5.614l3.972-3.972v3.586h2v-7h-7zm-6 20c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" /></svg>
const female = <svg className="standalone-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="24" viewBox="0 0 24 24"><path d="M21 9c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 4.632 3.501 8.443 8 8.941v2.059h-3v2h3v2h2v-2h3v-2h-3v-2.059c4.499-.498 8-4.309 8-8.941zm-16 0c0-3.86 3.14-7 7-7s7 3.14 7 7-3.14 7-7 7-7-3.14-7-7z" /></svg>

const MpCard = ({ onQueryMp, item = { startDate: { year: {} } } }) => {


  useEffect(() => {
    //get all mps     
  }, [item]);

  return (

    <div
      className="relative p-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onQueryMp(item.id)}
    >
      <div
        title={item.gender === "M" ? "Male" : "Female"}
        className="absolute top-2 right-2 flex items-center"
      >
        {item.gender === "M" ? male : female}
      </div>

      <h4 className="font-semibold text-lg mb-2">{item.name}</h4>

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
