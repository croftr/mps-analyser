'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import ky from 'ky';
import { config } from '../app.config';

import TradeUnionIcon from './TradeUnionIcon'; 
import IndividualIcon from './IndividualIcon'; 
import CompanyIcon from './CompanyIcon'; 

import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';


const donationSourceTypes = {
  "Trade Union" : <TradeUnionIcon />,
  "Individual" : <IndividualIcon />,
  "Company" : <CompanyIcon />   
}

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

  const [name, setName] = useState<string|null>("")

  const getData = async () => {
    
    const nameParam = searchParams.get('name');

    setName(nameParam);
    
  }

  useEffect(() => {
    getData();
  }, [router, searchParams]);


  return (

    <div className="overflow-y-hidden border border-gray-200 dark:border-gray-700 rounded-lg ring">

      <h1>{name}</h1>
    </div>

  );

}

