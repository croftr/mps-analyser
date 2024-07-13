"use client"

import { Bar, BarChart, XAxis, YAxis, Cell, Label, LabelList } from "recharts"
import { useState, useEffect } from "react";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]


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
        color: "var(--clr-primary)",
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
                    fill={
                      activeIndex === index
                        ? (chartConfig[entry.name]?.color || chartConfig[entry.name]?.color) // If active, use primary color
                        : "var(--clr-primary)"
                    }
                  >
                    {/* Label inside the bar */}
                    <Label
                      value={entry.name}
                      position="top"
                      style={{ fill: 'white', fontSize: '0.8rem' }} // Customize as needed
                    />
                  </Cell>
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </div>

  )
}
