'use client';

import { useState, useEffect, Suspense } from 'react';
import ky from 'ky';
import { config } from '../app.config';

import { Handshake } from "lucide-react"

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

  const [name, setName] = useState("");
  const [contract, setContract] = useState<Array<any>>([]);

  const getData = async () => {
    
    const titleParam = searchParams.get('title');
    const supplierParam = searchParams.get('supplier');    
    const valueParam = searchParams.get('value');

    const response: Array<any> = await ky(`${config.mpsApiUrl}contracts/details?title=${titleParam}&supplier=${supplierParam}&value=${valueParam}`).json();
        
    //@ts-ignore
    setContract(response)

    setName(`${supplierParam} ${titleParam} ${valueParam}`);
    
  }

  useEffect(() => {
    getData();
  }, [router, searchParams]);


  return (

    <div className="flex flex-col justify-center ring p-4 gap-6">
      <span className='flex gap-2'><Handshake /><h1>{name}</h1></span>

      <div>
      {contract&& <pre>{JSON.stringify(contract[0], null, 2)}</pre>}
      </div>
      
    </div>

  );

}

