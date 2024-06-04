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

export default function NeoTable({ data, title }) {

  useEffect(() => {
    console.log("neoTable ", data);

  }, [data]);


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

    return renderdValue.toString();
  }

  return (
    <div>
      <h1>{title}</h1>
      <h1>{`${data ? data.length : "0"} records`}</h1>
      <Table>
        <TableCaption>{title}</TableCaption>
        <TableHeader>
          <TableRow>
            {data && data[0]?.keys.map((header, index) => (
              <TableHead key={`head-${index}`}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && Array.isArray(data) && data.map((contract: any, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>

              {data && data[0]?.keys.map((header, cellIndex) => (
                <TableCell key={`cell-${cellIndex}`} className="font-medium">{renderCell(contract._fields[contract._fieldLookup[contract.keys[cellIndex]]])}</TableCell>
              ))}

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

  );
}
