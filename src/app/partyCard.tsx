import * as React from "react";
import { Party } from "../types";
import { useRouter } from 'next/navigation'

import { Card, CardContent } from "@/components/ui/card";
import PartyLabel from "@/components/ui/partyLabel";

export function PartyCard({ party }: { party: Party }) {

  const router = useRouter();

  const getPartyMps = () => {
    router.push(`browse?type=MP&party=${party.name}`, { scroll: true });
  }
  return (
    <Card 
      onClick={getPartyMps}
      className="cursor-pointer">
      <CardContent className="flex items-baseline gap-4 p-3">
        <div className="flex-1 min-w-[100px]">
          <PartyLabel partyName={party.name} />
        </div>
        <span>{party.total} MP&apos;s</span>
      </CardContent>
    </Card>
  );
}
