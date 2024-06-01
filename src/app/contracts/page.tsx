// @ts-nocheck
"use client"
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function Contracts() {

  const [contracts, setContracts] = useState([]);
  const [contractCount, setContractCount] = useState(1000);

  const getContracts = async () => {
    // @ts-ignore
    setContracts(undefined)
    const result = await fetch(`https://mps-api-production-8da5.up.railway.app/contracts?awardedCount=${contractCount}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
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
        <button onClick={getContracts} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">go</button>
      </div>
      <div>

        {!contracts && <progress value="" />}

        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              {contracts && contracts[0]?.keys.map((header, index) => (
                <TableHead key={`head-${index}`}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts?.map((contract: any, index) => (
              <TableRow key={`row-${index}`}>
                <TableCell className="font-medium">{contract._fields[contract._fieldLookup["org.Name"]]}</TableCell>
                <TableCell className="font-medium">{contract._fields[contract._fieldLookup["contractCount"]].low}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

    </main>
  );
}
