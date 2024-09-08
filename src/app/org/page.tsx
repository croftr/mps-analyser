'use client';

import { useState, useEffect, Suspense, ReactNode } from 'react';
import ky from 'ky';
import { config } from '../app.config';

import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { DataTable } from "@/components/ui/data-table";
import { NeoTable } from '@/components/ui/neoTable';

import { ArrowUp } from "lucide-react"
import { ArrowDown } from "lucide-react"

import { capitalizeWords, formatCurrency } from "@/lib/utils";

import { PARTY_COLOUR } from ".././../app/config/constants";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts';
import { ChartContainer } from '@/components/ui/chart' // Assuming you have this component

import { PieChart, Pie, Cell, Label } from 'recharts';


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


import {
  BriefcaseIcon,
  UsersIcon,
  BanIcon,
  ScaleIcon,
  HomeIcon,
  BoxIcon,
  Users2Icon,
  DollarSignIcon,
  FlagIcon,
  HelpCircleIcon,
  UserIcon
} from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent
} from "@/components/ui/collapsible"

type PartyCounts = Record<string, number>;

enum DonorStatusEnum {
  Company = "Company",
  UnincorporatedAssociation = "Unincorporated Association",
  ImpermissibleDonor = "Impermissible Donor",
  TradeUnion = "Trade Union",
  FriendlySociety = "Friendly Society",
  Trust = "Trust",
  LimitedLiabilityPartnership = "Limited Liability Partnership",
  PublicFund = "Public Fund",
  RegisteredPoliticalParty = "Registered Political Party",
  Other = "Other",
  Empty = "", // To handle the empty string case
  UnidentifiableDonor = "Unidentifiable",
  Individual = "Individual",
}

const donorStatusIcons: { [key in string]: JSX.Element } = {
  [DonorStatusEnum.Company]: <BriefcaseIcon />,
  [DonorStatusEnum.UnincorporatedAssociation]: <UsersIcon />,
  [DonorStatusEnum.ImpermissibleDonor]: <BanIcon />,
  [DonorStatusEnum.TradeUnion]: <ScaleIcon />,
  [DonorStatusEnum.FriendlySociety]: <HomeIcon />,
  [DonorStatusEnum.Trust]: <BoxIcon />,
  [DonorStatusEnum.LimitedLiabilityPartnership]: <Users2Icon />,
  [DonorStatusEnum.PublicFund]: <DollarSignIcon />,
  [DonorStatusEnum.RegisteredPoliticalParty]: <FlagIcon />,
  [DonorStatusEnum.Other]: <HelpCircleIcon />,
  [DonorStatusEnum.Empty]: <HelpCircleIcon />, // Default icon for empty string
  [DonorStatusEnum.UnidentifiableDonor]: <UserIcon />,
  [DonorStatusEnum.Individual]: <UserIcon />,
};

const donarDetailsColumns = [
  {
    accessorKey: 'partyName',
    header: 'Party',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
  {
    accessorKey: 'receivedDate',
    header: 'Date',
  },
  {
    accessorKey: 'donationType',
    header: 'Type',
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
  const [isNamesDown, setIsNamesDown] = useState(false);

  const [tableData, setTableData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [name, setName] = useState<string | null>("")
  const [contracts, setContracts] = useState<Array<any> | undefined>()
  const [similarCompanies, setSimilarCompanies] = useState<Array<any> | undefined>()

  const [donorStatus, setDonarStatus] = useState<DonorStatusEnum>()

  const [contractCountChart, setContractCountChart] = useState<any>();
  const [donationCountChart, setDonationCountChart] = useState<any>();

  const chartConfig = {
  } satisfies ChartConfig

  const getData = async () => {

    const nameParam = searchParams.get('name');

    const donationsResponse: Array<any> = await ky(`${config.mpsApiUrl}donations?donar=${nameParam}`).json();

    const headerInfo = Array.isArray(donationsResponse) ? donationsResponse[0] : undefined;

    if (headerInfo) {
      if (headerInfo.donationType === "Impermissible Donor" || headerInfo.donorStatus === "Unidentifiable Donor") {
        setDonarStatus(DonorStatusEnum.UnidentifiableDonor);
      } else {
        setDonarStatus(headerInfo.donorStatus);
      }

      setTableData(donationsResponse);
    } else {
      //no header means its been given a contract but has no donation data so it must be an organisation 
      setDonarStatus(DonorStatusEnum.Company);
    }

    if (nameParam) {
      setName(capitalizeWords(nameParam));
    }

    setContracts(undefined)
    const result = await fetch(`${config.mpsApiUrl}contracts?orgName=${nameParam}&isawaredtoknown=true&limit=10000`);
    const contractsResult = await result.json();
    setContracts(contractsResult);
    setIsLoading(false);

    setSimilarCompanies(undefined)
    const companyResult = await fetch(`${config.mpsApiUrl}orgs/similar?name=${nameParam}`);
    const contractsResultJson = await companyResult.json();
    setSimilarCompanies(contractsResultJson);

    chartSummaryData(contractsResult, donationsResponse);

  }

  const showContract = (row: any) => {
    router.push(`contract?supplier=${row._fields[1]}&title=${encodeURIComponent(row._fields[0])}&value=${row._fields[2]}&awardedby=${row._fields[1]}`, { scroll: true });
  }

  const onQueryCompany = (row: any) => {
    router.push(`org?name=${row._fields[0]}`, { scroll: true });
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

  const onToggleNames = () => {
    setIsNamesDown(!isNamesDown);
  }

  const chartSummaryData = (contractsResult: Array<any>, donationsResponse: Array<any>): void => {

    console.log("go ", donationsResponse);

    const partyContractCounts: PartyCounts = {};
    const partyDonationCounts: PartyCounts = {};

    contractsResult?.forEach(i => {
      const contractParties = i._fields[1];

      contractParties.forEach((party: string) => {
        if (partyContractCounts[party]) {
          partyContractCounts[party] = partyContractCounts[party] + 1;
        } else {
          partyContractCounts[party] = 1;
        }
      });
    })

    donationsResponse?.forEach(i => {

      if (partyDonationCounts[i.partyName]) {
        partyDonationCounts[i.partyName] = partyDonationCounts[i.partyName] + 1;
      } else {
        partyDonationCounts[i.partyName] = 1;
      }
    });

    console.log("partyCounts ", partyContractCounts);

    const contractChartData = Object.entries(partyContractCounts).map(([name, contracts]) => ({ name, contracts, fill: PARTY_COLOUR[name].backgroundColour }));
    const donarChartData = Object.entries(partyDonationCounts).map(([name, donations]) => ({ name, donations, fill: PARTY_COLOUR[name].backgroundColour }));

    console.log("chartData ", donarChartData);

    setContractCountChart(contractChartData);
    setDonationCountChart(donarChartData);

  }

  return (

    <div className="flex flex-col justify-center p-4 gap-2 mb-2">

      <div className="flex flex-col ml-1 mb-2">

        <div className="flex gap-2">
          <span>{donorStatus ? donorStatusIcons[donorStatus] || <HelpCircleIcon /> : <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg"></div>}</span>
          <span>
            {name ? (
              <h4 className="font-semibold text-lg mb-2">{name}</h4>
            ) : (
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md"></div>
            )}
          </span>
        </div>

        {name && donorStatus !== DonorStatusEnum.UnidentifiableDonor && (
          <div className="flex flex-col gap-1">
            <div className="flex">
              <span className="dark:text-white">{tableData[0]?.donorStatus}</span>
            </div>
            <div className="flex">
              <span className="dark:text-white">{tableData[0]?.accountingUnitName}</span>
              <span className="dark:text-white ml-2">{tableData[0]?.postcode}</span>
            </div>
          </div>
        )}

        {name && donorStatus === DonorStatusEnum.UnidentifiableDonor && (
          <div className="flex flex-col gap-1">
            <div className="flex">
              <span className="dark:text-white">It has not been possible to identify these donars or organisations</span>
            </div>
            <div className="flex">
              <span className="dark:text-white">Expanding the details will give more information</span>
            </div>
          </div>
        )}

        {!name && (
          <div className="flex flex-col gap-1 mt-4">
            <div className="flex">
              <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div> {/* Placeholder for donorStatus */}
            </div>
            <div className="flex">
              <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div> {/* Placeholder for accountingUnitName */}
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse ml-2"></div> {/* Placeholder for postcode */}
            </div>
          </div>
        )}
      </div>

      {contractCountChart && (
        <div className='flex flex-col gap-4 mb-4'>
          <div>
            <Card>
              <CardHeader className="items-center pb-0">
                <CardDescription>Contracts received by party</CardDescription>
              </CardHeader>
              <CardContent className="pb-1">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto max-h-[250px]"
                >
                  <BarChart
                    width={500} // Adjust width as needed
                    height={300} // Adjust height as needed
                    data={contractCountChart}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contracts" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>


          <div>
            <Card>
              <CardHeader className="pb-0">
                <CardDescription>Donations madeby party</CardDescription>
              </CardHeader>
              <CardContent className="pb-1">
                <ChartContainer config={chartConfig}>
                  <BarChart
                    width={500} // Adjust width as needed
                    height={300} // Adjust height as needed
                    data={donationCountChart}
                  >

                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="donations" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <div className='flex flex-col gap-4 mb-4'>
            
            <div>
              <Card>
                <CardHeader className="items-center pb-0">
                  <CardDescription>Contracts Received by Party</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={chartConfig} // Assuming you have a suitable chartConfig for contracts
                    className="mx-auto aspect-square max-h-[250px]"
                  >
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="contracts" hideLabel />} />
                      <Pie data={contractCountChart} dataKey="contracts">
                        <LabelList
                          dataKey="name" // Assuming 'name' holds the party name in contractCountChart
                          className="fill-background"
                          stroke="none"
                          fontSize={12}
                          formatter={(value: string) => value} // Directly display the party name
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader className="pb-0">
                  <CardDescription>Donations Made by Party</CardDescription>
                </CardHeader>
                <CardContent className="pb-1">
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent nameKey="donations" hideLabel />} />
                      <Pie data={donationCountChart} dataKey="donations">
                        <LabelList
                          dataKey="name" // Assuming 'name' holds the party name in donationCountChart
                          className="fill-background"
                          stroke="none"
                          fontSize={12}
                          formatter={(value: string) => value} // Directly display the party name
                        />
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
      }

      {donorStatus !== DonorStatusEnum.Individual && (
        <div
          className="flex p-4 justify-between cursor-pointer 
        bg-white dark:bg-gray-800 shadow-md rounded-md 
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200 active:bg-gray-200 dark:active:bg-gray-600"
          onClick={onToggleContracts}
        >
          <div className="flex flex-col">
            <span className='flex'><div className='w-[150px]'> Contracts Received:</div> <span>{isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : contracts?.length || 0}</span></span>
            <div className='flex'><div className='w-[150px]'>Total value:</div> {contracts?.length ? formatCurrency(contracts?.map(i => i._fields[2]).reduce((sum, value) => sum + value, 0)) : 0}</div>
          </div>

          {isContractsDown ? <ArrowUp /> : <ArrowDown />}
        </div>
      )}

      <Collapsible
        open={isContractsDown}
        className="flex w-full"
      >
        <CollapsibleContent className="flex flex-col w-full gap-2">
          <NeoTable
            data={contracts}
            isShowingHeader={false}
            title="Contracts Received"
            onRowClick={showContract}
          />
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
          <span className='flex'><div className='w-[150px]'> Donations Made:</div> <span>{isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : tableData?.length || 0}</span> </span>
          <div className="flex"><div className='w-[150px]'>Total value:</div> {tableData.length ? formatCurrency(tableData.map(i => i.amount).reduce((sum, amount) => sum + amount, 0)) : 0}</div>
        </div>

        {isContractsDown ? <ArrowUp /> : <ArrowDown />}
      </div>

      <Collapsible
        open={isDonationssDown}
        className="flex w-full"
      >
        <CollapsibleContent className="flex flex-col w-full gap-2">
          <DataTable
            data={tableData}
            isShowingHeader={true}
            columns={donarDetailsColumns}
            onRowClick={() => { }}
          />
        </CollapsibleContent>
      </Collapsible>

      <div
        className="flex p-4 justify-between cursor-pointer 
        bg-white dark:bg-gray-800 shadow-md rounded-md 
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200 active:bg-gray-200 dark:active:bg-gray-600"
        onClick={onToggleNames}
      >
        <div className="flex flex-col">
          <span className='flex'><div className='w-[150px]'>Similar Names:</div> <span>{!similarCompanies ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400"></div> : similarCompanies?.length || 0}</span></span>
        </div>

        {isContractsDown ? <ArrowUp /> : <ArrowDown />}
      </div>

      <Collapsible
        open={isNamesDown}
        className="flex w-full"
      >
        <CollapsibleContent className="flex flex-col w-full gap-2">
          <NeoTable
            data={similarCompanies}
            title="Similar names"
            onRowClick={onQueryCompany}
            isShowingHeader={false}
          />
        </CollapsibleContent>
      </Collapsible>



    </div>
  );

}

