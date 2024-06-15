// @ts-nocheck
"use client"
import { useEffect, useState } from "react";

import { NeoTable } from '@/components/ui/neoTable'


export default function Contracts() {

  const [contracts, setContracts] = useState([]);
  const [contractCount, setContractCount] = useState(1000);
  const [awardedToName, setAwardedToName] = useState("");

  const getContractsByCount = async () => {
    // @ts-ignore
    setContracts(undefined)
    const result = await fetch(`https://mps-api-production-8da5.up.railway.app/contracts?awardedCount=${contractCount}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const getContractsByName = async () => {
    // @ts-ignore
    setContracts(undefined)
    const result = await fetch(`https://mps-api-production-8da5.up.railway.app/contracts?orgName=${awardedToName}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
  }

  const renderCell = (value) => {
    let renderdValue = value;

    if (value.low) {
      renderdValue = value.low;
    } else if (value.year) {
      const jsDate = new Date(
        value.year.low,
        value.month.low - 1, // Months are 0-indexed in JS (0 = January)
        value.day.low
      );
      renderdValue = jsDate.toLocaleDateString();
    }

    return renderdValue;
  }

  useEffect(() => {
    // getContracts();
  }, []);

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

        {contracts && <NeoTable data={contracts} title="contracts"/>} 
        

      </div>

    </main>
  );
}
