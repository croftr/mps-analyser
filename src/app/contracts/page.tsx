// @ts-nocheck
"use client"
import { useState } from "react";
import { NeoTable } from '@/components/ui/neoTable'
import { config } from "../app.config";

import { Button } from "@/components/ui/button";

export default function Contracts() {

  const [contracts, setContracts] = useState(undefined);
  const [isQuerying, setIsQuerying] = useState(undefined);
  const [contractCount, setContractCount] = useState();
  const [awardedToName, setAwardedToName] = useState("");
  const [type, setType] = useState("");

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

  const onRunQuery = async () => {
    setIsQuerying(true);
    setType("name")
    // @ts-ignore
    setContracts(undefined)
    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${awardedToName}&awardedCount=${contractCount}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const onGetDetails = (data: any) => {
    console.log("onGetDetails ", data);
    if (type === "count") {
      //TODO do we want any row click action for the counts?
    } else {
      window.open(data._fields[5], '_blank').focus();
    }
  }

  return (
    <main className="flex flex-col p-8">

      <div className="flex gap-4">
        <label>more than</label>

        <input value={contractCount} onChange={(e) => setContractCount(Number(e.target.value))} placeholder="contracts awarded"></input>
        {/* <h1>contracts awarded</h1> */}
        {/* <Button onClick={getContractsByCount}>Contract by Count</Button>         */}

        <label>to</label>
        <input value={awardedToName} onChange={(e) => setAwardedToName(e.target.value)} placeholder=" organisation name"></input>

      </div>

      <Button onClick={onRunQuery}>Go</Button>

      <div>

        {contracts && !contracts.map && <h1>No data</h1>}

        {isQuerying && <NeoTable data={contracts} title="contracts" onRowClick={type === "count" ? undefined : onGetDetails} />}

      </div>

    </main>
  );
}
