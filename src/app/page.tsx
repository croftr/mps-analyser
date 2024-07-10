"use client"

import * as React from "react"
import { Calendar } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"
import ky from 'ky';
import DivisionCard from "@/components/ui/DivisionCard";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect } from "react"

//not sure what the point of this is
const chartConfig = {
} satisfies ChartConfig

export default function Home() {

  interface Vote {
    DivisionId: number,
    Title: string
  }

  const [chartData, setChartData] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [recentVotes, setRecentVotes] = React.useState<Vote[] | undefined>();

  const getPartyCounts = async () => {

    const now = new Date(); // Get the current date and time
    const jsonDateString = now.toISOString(); // Format as ISO 8601 string
    console.log(jsonDateString);

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
    console.log(formattedDate);

    const result = await ky(`https://commonsvotes-api.parliament.uk/data/divisions.json/search?queryParameters.take=10&queryParameters.startDate=${formattedDate}`).json();
    console.log("result ", result);

    //@ts-ignore
    setRecentVotes(result);
    // if (Array.isArray(result) && result.length === 0) {
    //   //@ts-ignore
    //   setRecentVotes(result);
    // } else {

    //   //@ts-ignore
    //   result.forEach(item => {
    //     console.log("item ", item);

    //   })
    // }



    const data: Array<any> = [];

  }


  useEffect(() => {
    getPartyCounts();
    getRecentVotes();
  }, []);

  const onQueryDivision = async () => {

  }


  return (

    <div>

      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Current Mps</CardTitle>
          <CardDescription>House of commons</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
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
                innerRadius={60}
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
                            className="fill-muted-foreground"
                          >
                            Visitors
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
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            <Calendar className="h-4 w-4" />
            {`${new Date().toISOString()}`}
          </div>
        </CardFooter>
      </Card>

      {!recentVotes && <h1>getting data....</h1>}
      {recentVotes && recentVotes.length === 0 && <h1>No Votes in the past 2 months</h1>}      
      {recentVotes && recentVotes.length > 0 && (
        <div className="flex flex-col gap-2">
          <h1>Recent votes</h1>
          {recentVotes.map(i => <div className="p-2 ring" key={i.DivisionId}>{i.Title}</div>)}  
        </div>
        // recentVotes.map(i => <DivisionCard item={i} onQueryDivision={onQueryDivision} key={i.DivisionId} />)
        
      )}
    </div>


  )
}
