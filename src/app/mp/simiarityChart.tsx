"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Cell, Label, LabelList } from "recharts"
import { useState, useEffect } from "react";
import ky from "ky";

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
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

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

  const handleClick = (data: any, index: number) => {
    // Handle click event here
    console.log(`Clicked on bar: ${data.browser}, Visitors: ${data.visitors}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type} similar voting to {comparedMpName}
        </CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>

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
              <Bar dataKey="score" layout="vertical" radius={5} onClick={handleClick} cursor="pointer">
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
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  )
}
