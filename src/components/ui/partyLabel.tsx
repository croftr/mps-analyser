"use client"
import * as React from 'react'
import { PARTY_COLOUR } from ".././../app/config/constants";

const PartyLabel = ({ partyName = "" }) => {

    const getPartyAbbreviation = (name: string): string => {
        const partyAbbreviations: Record<string, string> = {
            "Scottish National Party": "SNP",
            "Liberal Democrat": "Lib Dem",
            "Democratic Unionist Party": "DUP",
            "Reform UK": "Reform",
            "Ulster Unionist Party": "UNP",
            "Traditional Unionist Voice": "TUV",
            "Social Democratic and Labour Party": "SDLP",
            "Social Democratic & Labour Party": "SDLP",
            "Workers Party of Britain": "Workers Party"
        };

        return name?.startsWith("Speaker") ? "Speaker" : partyAbbreviations[name || ""] || name || ""; // Handle undefined party
    };
    return (
        <span
            className="inline-flex items-center justify-center rounded-full px-2 py-1 text-xs font-medium mt-2 mb-1" // Added Tailwind classes
            style={{
                backgroundColor: PARTY_COLOUR[partyName]?.backgroundColour,
                color: PARTY_COLOUR[partyName]?.foregroundColour,
            }}
        >
            {getPartyAbbreviation(partyName)}
        </span>
    )
}

export default PartyLabel;
