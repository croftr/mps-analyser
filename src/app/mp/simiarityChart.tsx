"use client"

import { Bar, BarChart, XAxis, YAxis, Cell, Label, LabelList } from "recharts"

import { PARTY_COLOUR } from ".././../app/config/constants";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


interface MPData {
  name: string;
  party: string;
  score: number;
}

interface SimilarityChartProps {
  mpData: MPData[];
  comparedMpName?: string;
  type: 'Most' | 'Least';
  onQueryMpByName: (name: string) => void
}

export default function SimilarityChart({ mpData, onQueryMpByName }: SimilarityChartProps) {

  function CustomTick({ x, y, payload }: any) {

    const { value } = payload; 

    const party = mpData.find((entry) => entry.name === value)?.party; // Find the party from the mp name
      
    //@ts-ignore
    const foregroundColor = PARTY_COLOUR[party]?.foregroundColour || "black";
   
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={20} 
          y={0}
          dy={5}
          fill={foregroundColor}
          textAnchor="start"          
          style={{ overflow: "visible"}}
        >
          {value.split(" ").join("\n")}
        </text>
      </g>
    );
  }

  return (

    <ChartContainer config={{}} style={{ marginLeft: -50}}>
      <BarChart
        data={mpData}
        layout="vertical"
        margin={{ left: 0 }}
      >

        <XAxis dataKey="score" type="number" />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="score" layout="vertical" radius={5} onClick={onQueryMpByName} cursor="pointer">
          {mpData && mpData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PARTY_COLOUR[entry.party]?.backgroundColour || "var(--clr-primary)"}
            />              
          ))}
        </Bar>
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={ <CustomTick/> }        
        />
      </BarChart>
    </ChartContainer>

  )
}
