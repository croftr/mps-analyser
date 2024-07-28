'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import ky from 'ky';
import { config } from '../app.config';

import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';


export default function Contract() {
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

  const [name, setName] = useState("")

  const getData = async () => {
    
    const supplierParam = searchParams.get('supplier');
    const titleParam = searchParams.get('title');
    const valueParam = searchParams.get('value');
    
    setName(`${supplierParam} ${titleParam} ${valueParam}`);
    
  }

  useEffect(() => {
    getData();
  }, [router, searchParams]);


  return (

    <div className="flex justify-center ring p-4">
      <h1>{name}</h1>
    </div>

  );

}

