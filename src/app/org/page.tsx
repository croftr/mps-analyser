'use client';

import { useState, useEffect, Suspense } from 'react';
import ky from 'ky';
import { config } from '../app.config';

import TradeUnionIcon from './TradeUnionIcon';
import IndividualIcon from './IndividualIcon';
import CompanyIcon from './CompanyIcon';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { DataTable } from "@/components/ui/data-table";
import NeoTableSkeleton from '@/components/ui/neoTableSkeleton';
import { NeoTable } from '@/components/ui/neoTable';

import { ArrowUp } from "lucide-react"
import { ArrowDown } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible"

const TYPES = {
  ALL_PARTIES: "ALL_PARTIES",
  PARTY: "PARTY",
  DONAR: "DONAR"
};

enum DonationSourceType {
  TradeUnion = "Trade Union",
  Individual = "Individual",
  Company = "Company",
}

const donationSourceTypes: { [key in DonationSourceType]: JSX.Element } = {
  [DonationSourceType.TradeUnion]: <TradeUnionIcon />,
  [DonationSourceType.Individual]: <IndividualIcon />,
  [DonationSourceType.Company]: <CompanyIcon />,
};

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
  },
  {
    accessorKey: 'partyName',
    header: 'Party Name',
  },
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

  const [isContractsDown, setIsContractsDown] = useState(false);
  const [isDonationssDown, setIsDonationssDown] = useState(false);

  const [tableData, setTableData] = useState<Array<any>>([]);
  const [tableColumns, setTableColumns] = useState(donationColumns);
  const [isLoading, setIsLoading] = useState(true);

  const [tableText, setTableText] = useState("");

  const [type, setType] = useState(TYPES.DONAR)
  const [name, setName] = useState<string | null>("")
  const [contracts, setContracts] = useState<Array<any> | undefined>()

  const [donarStatus, setDonarStatus] = useState<DonationSourceType>(DonationSourceType.Company)

  const getData = async () => {

    const nameParam = searchParams.get('name');

    const donationsResponse: Array<any> = await ky(`${config.mpsApiUrl}donations?donar=${nameParam}`).json();

    const headerInfo = Array.isArray(donationsResponse) ? donationsResponse[0] : undefined;

    if (headerInfo) {
      setTableText(`Donation to ${donationsResponse[0].partyName} by ${headerInfo.donar} ${headerInfo.accountingUnitName}`)
      setDonarStatus(headerInfo.donorStatus);
    }

    setName(nameParam);
    setTableColumns(donarDetailsColumns);
    setTableData(donationsResponse);

    setContracts(undefined)
    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${nameParam}&limit=10000`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
    setIsLoading(false);
  }

  const showContract = (row: any) => {
    router.push(`contract?supplier=${row._fields[1]}&title=${row._fields[0]}&value=${row._fields[3]}&awardedby=${row._fields[2]}`, { scroll: true });
  }

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [router, searchParams]);

  const onToggleContracts = () => {
    setIsContractsDown(!isContractsDown);
  }

  const onToggleDonations = () => {
    setIsDonationssDown(!isDonationssDown);
  }

  const formatCurrency = (value: number = 0) => {
    return new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP',
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
    }).format(value);
  }

  return (

    <div className="flex flex-col justify-center p-4 gap-1">

      <div className="flex gap-2">
        <span>
          {type === TYPES.DONAR ? donationSourceTypes[donarStatus] ? donationSourceTypes[donarStatus] : (donarStatus) : type}
        </span>
        <span className='mb-2'>
          {name ? ( 
            <h4 className="font-semibold text-lg">{name}</h4>
          ) : (
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
          )}
        </span>
      </div>

      <div
        className="flex p-4 justify-between cursor-pointer 
          bg-white dark:bg-gray-800 shadow-md rounded-md 
          hover:bg-gray-100 dark:hover:bg-gray-700
          transition-colors duration-200 active:bg-gray-200 dark:active:bg-gray-600"
        onClick={onToggleContracts}
      >
        <div className="flex flex-col">
          <span className='flex gap-4'><span>{isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : contracts?.length || 0}</span> <span> Contracts Received</span></span>
          <span>Total value {formatCurrency(contracts?.map(i => i._fields[3]).reduce((sum, value) => sum + value, 0))}</span>
        </div>

        {isContractsDown ? <ArrowUp /> : <ArrowDown />}
      </div>

      <Collapsible
        open={isContractsDown}
        className="flex w-full"
      >
        <CollapsibleContent className="flex flex-col w-full gap-2">
          <NeoTable data={contracts} title="Contracts Received" onRowClick={showContract} />
        </CollapsibleContent>
      </Collapsible>

      <div
        className="flex p-4 justify-between cursor-pointer 
        bg-white dark:bg-gray-800 shadow-md rounded-md 
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200 active:bg-gray-200 dark:active:bg-gray-600"
        onClick={onToggleDonations}
      >
        <div className="flex flex-col">
          <span className='flex gap-4'><span>{isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : tableData?.length || 0}</span> <span> Donations Made</span></span>
          <span>Total value {formatCurrency(tableData.map(i => i.amount).reduce((sum, amount) => sum + amount, 0))}</span>
        </div>

        {isContractsDown ? <ArrowUp /> : <ArrowDown />}
      </div>

      <Collapsible
        open={isDonationssDown}
        className="flex w-full"
      >

        <CollapsibleContent className="flex flex-col w-full gap-2">
          <div>
            <div className="flex flex-col md:flex-row md:justify-between p-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tableText}</h2>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total donations since 01-Jan-2000</h3>
            </div>

            {isLoading ? (
              <NeoTableSkeleton columns={4} />
            ) : (
              <DataTable
                data={tableData}
                columns={tableColumns}
                onRowClick={() => { }}
              />
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

    </div>
  );

}

