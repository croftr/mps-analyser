"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { useState, useEffect } from 'react';

import { getPartyColour } from ".././../app/config/constants";

import {
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

  const [chartHeight, setChartHeight] = useState(0);

  // Calculate dynamic height (adjust this calculation as needed)
  const barHeight = 40; // Desired bar height
  const margin = 20; // Total margin for the chart
  const calculatedHeight = mpData.length * barHeight + margin;

  // Use useEffect to update chartHeight when mpData changes
  useEffect(() => {
    setChartHeight(calculatedHeight);
  }, [mpData]);

  function CustomTick({ x, y, payload }: any) {

    const { value } = payload;
    const party = mpData.find((entry) => entry.name === value)?.party;

    let foregroundColor = "black";
    if (party) {
      foregroundColor = getPartyColour(party).foregroundColour;
    }

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={20}
          y={0}
          dy={5}
          fill={foregroundColor}
          textAnchor="start"
          style={{ overflow: "visible" }}
        >
          {value.split(" ").join("\n")}
        </text>
      </g>
    );
  }

  return (

    <div style={{ width: '100%', overflowX: 'auto' }}>
      <ResponsiveContainer width="100%" height={chartHeight}>

        <ChartContainer config={{}} style={{ marginLeft: -50 }}>
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
                  fill={getPartyColour(entry.party).backgroundColour || "var(--clr-primary)"}
                />
              ))}
            </Bar>
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              interval={0}
              tick={<CustomTick />}
            />
          </BarChart>
        </ChartContainer>
      </ResponsiveContainer>
    </div>

  )
}
