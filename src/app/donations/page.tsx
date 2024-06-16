// @ts-nocheck
'use client';

import { useState, useEffect, useMemo } from 'react';
import ky from 'ky';
import { config } from '../app.config';
import { DataTable } from "@/components/ui/data-table"; // Make sure you have this component
import { Skeleton } from "@/components/ui/skeleton";

const donationColumns = [
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

const partyDonarColumns = [
  {
    accessorKey: 'partyName',
    header: 'Party Name',
  },
  {
    accessorKey: 'donar',
    header: 'Member Count',
  },
  {
    accessorKey: 'donatedCout',
    header: 'Donated Count',
  },
  {
    accessorKey: 'totalDonationValue',
    header: 'Total Donation Value',
  }
]

const donarDetailsColumns = [
  {
    accessorKey: 'donationType',
    header: 'Type',
  },
  {
    accessorKey: 'receivedDate',
    header: 'Date',
  },
  {
    accessorKey: 'partyName',
    header: 'Donated to',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  }
]

const TYPES = {
  ALL_PARTIES: "ALL_PARTIES",
  PARTY: "PARTY",
  DONAR: "DONAR" 
};

export default function Donations() {

  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState(donationColumns);
  const [isLoading, setIsLoading] = useState(true);
  const [tableText, setTableText] = useState("");
  const [type, setType] = useState(TYPES.ALL_PARTIES)
  

  const onQueryForParty = async (row) => {
    
    const donationsResponse = await ky(`${config.mpsApiUrl}donations?partyname=${row.original.partyName}`).json();

    setTableColumns(partyDonarColumns);
    setTableData(donationsResponse);
    setTableText(`Donations to ${row.original.partyName}`)
    setType(TYPES.PARTY);
    
  }

  const onQueryForPartyDonar = async (row) => {

    const donationsResponse = await ky(`${config.mpsApiUrl}donations?donar=${row.original.donar}`).json();    
    const headerInfo = Array.isArray(donationsResponse) ? donationsResponse[0] : undefined;

    if (headerInfo) {
      setTableText(`Donation by ${headerInfo.donar} ${headerInfo.accountingUnitName} ${headerInfo.donorStatus} ${headerInfo.postcode} `)
    }

    setTableColumns(donarDetailsColumns);
    setTableData(donationsResponse);    
    
    setType(TYPES.DONAR);    
  }


  useEffect(() => {
    const getDonations = async () => {
      try {
        const donationsResponse = await ky(`${config.mpsApiUrl}donations`).json();
        setTableData(donationsResponse);
        setTableText("Donations to all parties")
      } catch (error) {
        console.error("Error fetching donations:", error);
        // Optionally, set an error state or display an error message
      } finally {
        setIsLoading(false);
      }
    };
    getDonations();
  }, []);

  const memoizedDonations = useMemo(() => tableData, [tableData]);
  return (

    <div className="overflow-y-hidden border border-gray-200 dark:border-gray-700 rounded-lg"> {/* Scrolling container for the body */}
      <h3>Total donations since 01-Jan-2000</h3>
      <h3>{tableText}</h3>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <DataTable
          data={memoizedDonations}
          columns={tableColumns}
          onRowClick={type === TYPES.ALL_PARTIES ? onQueryForParty : onQueryForPartyDonar}
        />
      )}
    </div>

  );

}

