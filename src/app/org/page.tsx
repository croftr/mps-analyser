'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import ky from 'ky';
import { config } from '../app.config';

import TradeUnionIcon from './TradeUnionIcon'; 
import IndividualIcon from './IndividualIcon'; 
import CompanyIcon from './CompanyIcon'; 

import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { DataTable } from "@/components/ui/data-table";

const donationSourceTypes = {
  "Trade Union" : <TradeUnionIcon />,
  "Individual" : <IndividualIcon />,
  "Company" : <CompanyIcon />   
}

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


export default function Org() {
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

  const [tableData, setTableData] = useState<Array<any>>([]);
  const [tableColumns, setTableColumns] = useState(donationColumns);
  const [isLoading, setIsLoading] = useState(true);
  const [tableText, setTableText] = useState("");
  
  const [donarStatus, setDonarStatus] = useState("")

  const [name, setName] = useState<string|null>("")

  const getData = async () => {
    
    const nameParam = searchParams.get('name');

    const donationsResponse:Array<any> = await ky(`${config.mpsApiUrl}donations?donar=${nameParam}`).json();

    const headerInfo = Array.isArray(donationsResponse) ? donationsResponse[0] : undefined;

    if (headerInfo) {
      setTableText(`Donation to ${donationsResponse[0].partyName} by ${headerInfo.donar} ${headerInfo.accountingUnitName}`)
    }

    setDonarStatus(headerInfo.donorStatus);
    setTableColumns(donarDetailsColumns);
    setTableData(donationsResponse);

    console.log("response ", donationsResponse);
    

    setName(nameParam);
    
  }

  useEffect(() => {
    getData();
  }, [router, searchParams]);


  return (

    <div className="flex flex-col justify-center ring p-4">
      <h1>{name}</h1>

      <DataTable
          data={tableData}
          columns={tableColumns}
          onRowClick={() => {}}          
        />

    </div>

  );

}

