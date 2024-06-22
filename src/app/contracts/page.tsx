// @ts-nocheck
"use client"
import { useState } from "react";
import { NeoTable } from '@/components/ui/neoTable'

export default function Contracts() {

  const [contracts, setContracts] = useState([]);
  const [contractCount, setContractCount] = useState(1000);
  const [awardedToName, setAwardedToName] = useState("");
  const [type, setType] = useState("");

  const getContractsByCount = async () => {
    setType("count");
    // @ts-ignore
    setContracts(undefined)
    const result = await fetch(`https://mps-api-production-8da5.up.railway.app/contracts?awardedCount=${contractCount}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const getContractsByName = async () => {
    setType("name")
    // @ts-ignore
    setContracts(undefined)
    const result = await fetch(`https://mps-api-production-8da5.up.railway.app/contracts?orgName=${awardedToName}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const onGetDetails = (data:any) => {
    console.log("onGetDetails ", data);
    if (type === "count") {
      //TODO do we want any row click action for the counts?
    } else {
      window.open(data._fields[5], '_blank').focus();
    }    
  }

  return (
    <main className="flex flex-col p-8">
      <h1>contracts</h1>
      <div className="ring flex gap-4">
        <div className="flex flex-col">
          <input value={contractCount} onChange={(e) => setContractCount(Number(e.target.value))}></input>
          <label>Countract count</label>
        </div>
        <button onClick={getContractsByCount} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Contract by Count</button>
      </div>

      <div className="ring flex gap-4">
        <div className="flex flex-col">
          <input value={awardedToName} onChange={(e) => setAwardedToName(e.target.value)}></input>
          <label>Countract count</label>
        </div>
        <button onClick={getContractsByName} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Awarded to Name</button>
      </div>

      <div>

      {contracts && !contracts.map && <h1>No data</h1>}

        {!contracts && <progress value="" />}

        {contracts && <NeoTable data={contracts} title="contracts" onRowClick={type === "count" ? undefined : onGetDetails}/>} 
        
      </div>

    </main>
  );
}
