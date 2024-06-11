'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { VOTING_CATEGORIES, EARLIEST_FROM_DATE, Party } from "../config/constants";
import ky from 'ky';
import { config } from '../app.config';
import NeoTable from '@/components/ui/neoTable';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const columns = [
  "partyName",
  "memberCount",
  "donationCount",
  "totalDonationValue"
]

export default function Donations() {

  const [donations, setDonations] = useState([]);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {

    const getParties = async () => {

      const donationsResponse: any = await ky(`${config.mpsApiUrl}donations`).json();
      setDonations(donationsResponse);
    }

    getParties();

  }, []);

  return (
    <div className="partiesPage">

      <div className="partiesPage__header">
        <h3>Total donations since 01-Jan-2000</h3>
      </div>

      {Array.isArray(donations) && (
        <Table>
          <TableCaption>donations</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((header, index) => (
                <TableHead key={`head-${index}`}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {donations && Array.isArray(donations) && donations.map((donation: any, rowIndex) => (
              <TableRow key={`row-${rowIndex}`}>

                {columns.map((column, cellIndex) => (
                   <TableCell key={`cell-${cellIndex}`} className="font-medium">{donation[columns[cellIndex]]}</TableCell>                  
                  // <TableCell key={`cell-${cellIndex}`} className="font-medium">{JSON.stringify(donation)}</TableCell>
                ))}

              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

    </div>
  );
}
