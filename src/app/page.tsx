"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import ky from 'ky';
import { useRouter } from 'next/navigation'
import { Vote, Party } from "../types";
import DivisionSvg from "@/components/custom/divisionSvg";

import { VoteIcon } from "lucide-react";

import ChipNavigation from "@/components/ui/chipNavigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Search from "@/components/ui/search";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import { useEffect, useRef } from "react"
import { PartyCard } from "./partyCard";

//not sure what the point of this is
const chartConfig = {
} satisfies ChartConfig

export default function Home() {

  const mainContentRef = useRef<HTMLDivElement>(null); // Ref for the container element

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, []);

  const router = useRouter();

  const [chartData, setChartData] = React.useState([]);
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

    //@ts-ignore
    setChartData(data);

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

    <div className="p-4" >

      {/* <div id="chartcontainer" ref={mainContentRef} tabIndex={0}>

        <Card className="flex flex-col mb-4">
          <CardHeader className="items-center p-2">
            <CardTitle>Current Mps</CardTitle>
            <CardDescription>House of commons</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="members"
                  nameKey="party"
                  innerRadius={56}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {total}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-foreground"
                            >
                              Mps
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm p-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              <Calendar className="h-4 w-4" />
              {`${new Date().toLocaleDateString()}`}
            </div>
          </CardFooter>
        </Card>
      </div> */}

      <div className="flex items-center justify-center space-x-4 p-6">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 shadow-sm">Westminster Bubble</h1>
          <p className="text-lg sm:text-xl font-medium text-gray-600 dark:text-gray-300 italic">Connecting MPs, Votes, Donations and Contracts</p>
        </div>
      </div>

      <Search />

      <ChipNavigation />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {parties && parties.filter(i => i.name !== "Speaker").map(i => <PartyCard key={i.name} party={i} />)}
      </div>


      {recentVotes && recentVotes.length === 0 && <h1>No Votes in the past 2 months</h1>}
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
      )}
    </div>


  )
}
