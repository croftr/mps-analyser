// @ts-nocheck
"use client"
import { useState } from "react";
import { NeoTable } from '@/components/ui/neoTable'
import { config } from "../app.config";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"

export default function Contracts() {

  const [contracts, setContracts] = useState(undefined);
  const [isQuerying, setIsQuerying] = useState(undefined);
  const [contractCount, setContractCount] = useState();
  const [awardedToName, setAwardedToName] = useState("");
  const [type, setType] = useState("");
  const [tableHeader, setTableHeader] = useState("");

  const onRunQuery = async () => {
    setIsQuerying(true);
    setType("name")
    // @ts-ignore
    setContracts(undefined)

    if (contractCount) {
      setTableHeader("Grouping contracts by organisation");
    } else {
      setTableHeader("Showing individual contracts");
    }

    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${awardedToName}&awardedCount=${contractCount}`);
    
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const getContractsByCount = async () => {
    setIsQuerying(true);
    setType("count");
    // @ts-ignore
    setContracts(undefined)

    const result = await fetch(`${config.mpsApiUrl}contracts?awardedCount=${contractCount}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const getContractsByName = async () => {
    setIsQuerying(true);
    setType("name")
    // @ts-ignore
    setContracts(undefined)
    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${awardedToName}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const onGetDetails = (data: any) => {
    console.log("check ",data);
    
    if (type === "count") {
      //TODO do we want any row click action for the counts?
    } else {
      window.open(data._fields[5], '_blank').focus();
    }
  }

  return (
    <main className="flex flex-col p-2">

      <div className="flex flex-col sm:flex-row gap-4 items-center mb-5">
        <div className="flex w-full sm:w-auto items-center">
          <Label htmlFor="contractsAwarded" className="mr-2 whitespace-nowrap">More than</Label>
          <Input id="contractsAwarded" type="number"  value={contractCount} onChange={(e) => setContractCount(Number(e.target.value))} placeholder="contracts" />
        </div>
        <div className="flex w-full sm:w-auto items-center">
          <Label htmlFor="orgName" className="mr-2 text-right sm:text-left whitespace-nowrap">awarded to</Label>
          <Input id="orgName" className="w-full" value={awardedToName} onChange={(e) => setAwardedToName(e.target.value)} placeholder="organisation" />
        </div>
        <Button
          onClick={onRunQuery}
          className="w-full"
        >
          Go
        </Button>
      </div>




      <div>
        {contracts && !contracts.map && <h1>No data</h1>}
        {isQuerying && <NeoTable data={contracts} title={tableHeader} onRowClick={type === "count" ? undefined : onGetDetails} />}
      </div>

    </main>
  );
}
