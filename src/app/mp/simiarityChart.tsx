"use client"

import { Bar, BarChart, XAxis, YAxis, Cell, Label, LabelList } from "recharts"
import { useState, useEffect } from "react";

import { PARTY_COLOUR } from ".././../app/config/constants";
// import { PARTY_COLOUR } from "@config/constants";


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
  comparedMpName: string;
  type: 'Most' | 'Least';
  onQueryMpByName: (name: string) => void
}

export default function SimilarityChart({ mpData, comparedMpName, type, onQueryMpByName }: SimilarityChartProps) {

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartConfig: ChartConfig = mpData?.reduce(
    (config, entry) => {
      config[entry.name] = {
        label: entry.name,
        // Set the fill color to your primary color CSS variable
        color: PARTY_COLOUR[entry.party]?.backgroundColour || "var(--clr-primary)", 
      };
      return config;
    },
    {} as ChartConfig
  ) || {};


  return (
      <div>

        {mpData && (
          <ChartContainer config={chartConfig}>
            <BarChart
              data={mpData}              
              layout="vertical"
              margin={{ left: 0 }}
            >
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <XAxis dataKey="score" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="score" layout="vertical" radius={5} onClick={onQueryMpByName} cursor="pointer">
                {mpData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PARTY_COLOUR[entry.party]?.backgroundColour || "var(--clr-primary)"}                     
                 / >
                 
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </div>

  )
}
