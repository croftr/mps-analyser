import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,    
} from "@/components/ui/tooltip";

interface TooltipProps {
    side?: "top" | "right" | "bottom" | "left"; 
}

interface SvgWithTooltipProps extends Pick<TooltipProps, 'side'> {
    width?: number;         // Optional width for the SVG (default: 24)
    height?: number;        // Optional height for the SVG (default: 24)
    path: string;          // The SVG path data (required)
    tooltipContent: React.ReactNode; // The content of the tooltip (required)
    className?: string;     // Additional CSS classes for styling
}

function SvgWithTooltip({
    width = 24,
    height = 24,
    path,
    tooltipContent,
    side = "right", 
    className,
}: SvgWithTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip >
                <TooltipTrigger>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`standalone-svg ${className}`}
                        width={width}
                        height={height}
                        viewBox={`0 0 ${width} ${height}`}
                    >
                        <path d={path} />
                    </svg>
                </TooltipTrigger>
                <TooltipContent side={side} className="bg-slate-100 text-gray-800 dark:bg-slate-800 dark:text-gray-100">
                    {tooltipContent}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export default SvgWithTooltip;
