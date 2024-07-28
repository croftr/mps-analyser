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
import NeoTableSkeleton from '@/components/ui/neoTableSkeleton';
import { NeoTable } from '@/components/ui/neoTable';
import { Switch } from "@/components/ui/switch"

const TYPES = {
  ALL_PARTIES: "ALL_PARTIES",
  PARTY: "PARTY",
  DONAR: "DONAR"
};


// const donationSourceTypes = {
//   "Trade Union" : <TradeUnionIcon />,
//   "Individual" : <IndividualIcon />,
//   "Company" : <CompanyIcon />   
// }

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
  const pathname = usePathname();

  const [tableData, setTableData] = useState<Array<any>>([]);
  const [tableColumns, setTableColumns] = useState(donationColumns);
  const [isLoading, setIsLoading] = useState(true);

  const [showContracts, setShowContracts] = useState(false);
  const [showDonations, setShowDonations] = useState(false);

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
    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${nameParam}`);
    const contractsResult = await result.json();
    setContracts(contractsResult);



    setIsLoading(false);

  }

  useEffect(() => {
    setIsLoading(true);
    getData();
  }, [router, searchParams]);


  return (

    <div className="flex flex-col justify-center ring p-4">

      <h4 className="font-semibold text-lg mb-2">{name}</h4>

      <div className="flex gap-4 mb-4">
        <div className='flex gap-2'>
          <p>{contracts ? contracts.length : 0} Contracts Received</p>
          <Switch id="vaexclude" checked={showContracts} onCheckedChange={() => setShowContracts(!showContracts)} />
        </div>

        <div className='flex gap-2'>
          <p>{tableData ? tableData.length : 0} Donations Made</p>
          <Switch id="vaexclude" checked={showDonations} onCheckedChange={() => setShowDonations(!showDonations)} />
        </div>

      </div>


      {showContracts && <NeoTable data={contracts} title="Contracts Received" onRowClick={() => { }} />}

      {showDonations && (<div>
        <div className="flex flex-col md:flex-row md:justify-between p-4">
          <span className='flex gap-2'> {type === TYPES.DONAR ? donationSourceTypes[donarStatus] ? donationSourceTypes[donarStatus] : (donarStatus) : type} <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{tableText}</h2></span>
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
      </div>)}



    </div>

  );

}

