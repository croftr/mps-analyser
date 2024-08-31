"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { WholeWord } from "lucide-react"

interface ToggleButtonProps {
    isTrue: boolean;
    toggleIsTrue: () => void;
    label?: string
  }

export default function ToggleButton({ isTrue, toggleIsTrue, label="Toggle Button" }: ToggleButtonProps) {

    return (
        <div>
            <div className="flex items-center space-x-2 mt-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={isTrue ? "default" : "outline"}
                                onClick={toggleIsTrue}
                            >
                                <WholeWord />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}