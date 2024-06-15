// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from 'react';
import ky from 'ky';
import { config } from '../app.config';
import { DataTable } from "@/components/ui/data-table"; // Make sure you have this component
import { Skeleton } from "@/components/ui/skeleton";

const columns = [
  {
    accessorKey: 'partyName',
    header: 'Party Name',
  },
  {
    accessorKey: 'memberCount',
    header: 'Member Count',
  },
  {
    accessorKey: 'donationCount',
    header: 'Donation Count',
  },
  {
    accessorKey: 'totalDonationValue',
    header: 'Total Donation Value',
  },
];

export default function Donations() {
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onRowClick = (row) => {
    console.log("go ", row);    
  }

  useEffect(() => {
    const getDonations = async () => {
      try {
        const donationsResponse = await ky(`${config.mpsApiUrl}donations`).json();
        setDonations(donationsResponse);
      } catch (error) {
        console.error("Error fetching donations:", error);
        // Optionally, set an error state or display an error message
      } finally {
        setIsLoading(false);
      }
    };
    getDonations();
  }, []);

  const memoizedDonations = useMemo(() => donations, [donations]);
  return (

    <div className="overflow-y-hidden border border-gray-200 dark:border-gray-700 rounded-lg"> {/* Scrolling container for the body */}
      <h3>Total donations since 01-Jan-2000</h3>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          data={memoizedDonations}
          columns={columns}
          onRowClick={onRowClick}
        />
      )}
    </div>

  );

}

