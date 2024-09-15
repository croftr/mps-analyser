"use client"
import * as React from 'react'
import { getPartyColour } from ".././../app/config/constants";

const PartyLabel = ({ partyName = "" }) => {

    const getPartyAbbreviation = (name: string): string => {
        console.log("check ", name);
      
        // Remove "deregistered" and everything after it
        const cleanedName = name.replace(/ deregistered.*/i, ''); // Case-insensitive match
      
        const partyAbbreviations: Record<string, string> = {
          "Scottish National Party": "SNP",
          "Liberal Democrat": "Lib Dem",
          "Democratic Unionist Party": "DUP",
          "Reform UK": "Reform",
          "Ulster Unionist Party": "UNP",
          "Traditional Unionist Voice": "TUV",
          "Social Democratic and Labour Party": "SDLP",
          "Social Democratic & Labour Party": "SDLP",
          "Workers Party of Britain": "Workers Party",
          "UK Independence Party": "UKIP",
          "The Peace Party  Nonviolence Justice Environment": "The Peace Party",
          "Alliance  Alliance Party of Northern Ireland" : "Alliance",
          "Mebyon Kernow  The Party for Cornwall" : "Mebyon Kernow",
          "The Buckinghamshire Campaign for Democracy" : "Buckinghamshire Campaign",
          "The Socialist Party of Great Britain" : "The Socialist Party",
          "Solihull and Meriden Residents Association" : "Solihull and Meriden",
          "The Official Monster Raving Loony Party" : "Monster Raving Loony Party",
          "Both Unions Party of Northern Ireland" : "Both Unions Party",
          "The Independent Group for Change": "Independent Group for Change"
        };
      
        return cleanedName?.startsWith("Speaker") ? "Speaker" 
               : partyAbbreviations[cleanedName || ""] || cleanedName || "";
      };    
    return (
        <span
            className="inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium mt-2 mb-1" // Added Tailwind classes
            style={{
                backgroundColor: getPartyColour(partyName).backgroundColour,
                color: getPartyColour(partyName).foregroundColour,
            }}
        >
            {getPartyAbbreviation(partyName)}
        </span>
    )
}

export default PartyLabel;
