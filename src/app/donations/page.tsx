// @ts-nocheck
'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import ky from 'ky';
import { config } from '../app.config';
import { DataTable } from "@/components/ui/data-table"; // Make sure you have this component

import TradeUnionIcon from './TradeUnionIcon'; 
import IndividualIcon from './IndividualIcon'; 
import CompanyIcon from './CompanyIcon'; 

import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import NeoTableSkeleton from '@/components/ui/neoTableSkeleton';

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
    accessorKey: 'donar',
    header: 'Donar',
  },
  {
    accessorKey: 'donatedCout',
    header: 'Donation Count',
  },
  {
    accessorKey: 'totalDonationValue',
    header: 'Total Value',
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
    accessorKey: 'amount',
    header: 'Amount',
  }
]

const TYPES = {
  ALL_PARTIES: "ALL_PARTIES",
  PARTY: "PARTY",
  DONAR: "DONAR"
};

const donationSourceTypes = {
  "Trade Union" : <TradeUnionIcon />,
  "Individual" : <IndividualIcon />,
  "Company" : <CompanyIcon />   
}


export default function Donations() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}



function PageContent() {

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState(donationColumns);
  const [isLoading, setIsLoading] = useState(true);
  const [tableText, setTableText] = useState("");
  const [type, setType] = useState(TYPES.ALL_PARTIES)
  const [donarStatus, setDonarStatus] = useState("")


  const onQueryForParty = async (row, updateUrl = true) => {

    if (updateUrl) {      
      router.push(`?party=${row.original.partyName}`, { scroll: true });
    }

    const donationsResponse = await ky(`${config.mpsApiUrl}donations?partyname=${row.original.partyName}`).json();

    setTableColumns(partyDonarColumns);
    setTableData(donationsResponse);
    setTableText(`Donations to ${row.original.partyName}`)
    setType(TYPES.PARTY);

    setIsLoading(false);

  }

  const onQueryForPartyDonar = async (row, updateUrl = true) => {

    if (updateUrl) {            
      router.push(`?party=${tableText.split(" ")[2]}&donar=${row.original.donar}`, { scroll: true });
    }

    const donationsResponse = await ky(`${config.mpsApiUrl}donations?donar=${row.original.donar}`).json();
    const headerInfo = Array.isArray(donationsResponse) ? donationsResponse[0] : undefined;

    if (headerInfo) {
      setTableText(`Donation to ${donationsResponse[0].partyName} by ${headerInfo.donar} ${headerInfo.accountingUnitName}`)
    }

    setDonarStatus(headerInfo.donorStatus);
    setTableColumns(donarDetailsColumns);
    setTableData(donationsResponse);

    setType(TYPES.DONAR);

    setIsLoading(false);
  }

  const refreshData = async () => {

    setIsLoading(true);

    const partyName = searchParams.get('party');
    const donar = searchParams.get('donar');
    
    if (donar && partyName && partyName !== "all") {
      setTableColumns(donarDetailsColumns);        
      onQueryForPartyDonar({ original: { donar } }, false);
    } else if (partyName && partyName !== "all") {
      setTableColumns(partyDonarColumns);
      onQueryForParty({ original: { partyName } }), false;
    } else {

      try {

        setType(TYPES.ALL_PARTIES);
        setTableColumns(donationColumns);
        const donationsResponse = await ky(`${config.mpsApiUrl}donations`).json();
        setTableData(donationsResponse);
        setTableText("Donations to all parties")
      } catch (error) {
        console.error("Error fetching donations:", error);
        // Optionally, set an error state or display an error message
      } finally {
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    refreshData();
  }, [pathname, router, searchParams]);

  const memoizedDonations = useMemo(() => tableData, [tableData]);

  return (

    <div className="overflow-y-hidden">

      <div className="flex flex-col md:flex-row md:justify-between p-4">        
        <span className='flex gap-2'> {type === TYPES.DONAR ? donationSourceTypes[donarStatus] ? donationSourceTypes[donarStatus] : (donarStatus) : "" } <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tableText}</h2></span>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total donations since 01-Jan-2000</h3>
      </div>


      {isLoading ? (
        <NeoTableSkeleton columns={4} />
      ) : (
        <DataTable
          data={memoizedDonations}
          columns={tableColumns}
          onRowClick={
            type === TYPES.ALL_PARTIES
              ? onQueryForParty
              : type === TYPES.PARTY
              ? onQueryForPartyDonar
              : undefined
          }          
        />
      )}
    </div>

  );

}

