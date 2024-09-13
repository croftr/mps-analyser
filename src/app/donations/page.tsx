//@ts-nocheck
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
import PartyLabel from '@/components/ui/partyLabel';
import { convertNeo4jDateToString } from '@/lib/utils';

const donationColumns = [
  {
    accessorKey: 'partyName',
    header: 'Party Name',
  },
  {
    accessorKey: 'donationCount',
    header: 'Donations',
  },
  {
    accessorKey: 'totalDonationValue',
    header: 'Total Value',
  },
];

const partyDonarColumns = [
  {
    accessorKey: 'donar',
    header: 'Donar',
  },
  {
    accessorKey: 'donatedCout',
    header: 'Donations',
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
  "Trade Union": <TradeUnionIcon />,
  "Individual": <IndividualIcon />,
  "Company": <CompanyIcon />
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
  const [lastUpdated, setLastUpdated] = useState("")

  const omRowClick = (row: any) => {        
    router.push(`org?name=${encodeURIComponent(row.original.donar)}`)
  }

  const onQueryForParty = async (row: any, updateUrl = true) => {

    if (updateUrl) {
      router.push(`?party=${row.original.partyName}`, { scroll: true });
    }

    const donationsResponse = await ky(`${config.mpsApiUrl}donations?partyname=${row.original.partyName}`).json();

    setTableColumns(partyDonarColumns);
    //@ts-ignore
    setTableData(donationsResponse);
    setTableText(row.original.partyName)
    setType(TYPES.PARTY);

    setIsLoading(false);

  }

  const onQueryForPartyDonar = async (row, updateUrl = true) => {
    router.push(`org?name=${encodeURIComponent(row.original.donar)}`)
  }

  const refreshData = async () => {

    setTableText(undefined);    

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
        const donationsResponse: any = await ky(`${config.mpsApiUrl}donations`).json();
        setTableData(donationsResponse);
        setTableText("All parties");

        const metadataResponse: any = await ky(`${config.mpsApiUrl}metadata`).json();
        const formattedDateString = convertNeo4jDateToString(metadataResponse.donationsLastUpdate);
        setLastUpdated(formattedDateString);

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
        <span className='flex items-center gap-2'> {type === TYPES.DONAR ? donationSourceTypes[donarStatus] ? donationSourceTypes[donarStatus] : (donarStatus) : ""}
          <h2 className="font-semibold text-gray-900 dark:text-white">Donations to</h2>
          {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : type === TYPES.ALL_PARTIES ? tableText : <PartyLabel partyName={tableText} />}
          
        </span>
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total donations since 01-Jan-2000</h3>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Last updated {lastUpdated}</h3>
        </div>

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

