// @ts-nocheck
"use client"
import MpCard from '@/components/ui/MpCard';
import { config } from './app.config';

import ky from 'ky';
import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';
    
const EARLIEST_FROM_DATE = "2003-11-12";

export default function Home() {

  const router = useRouter()


  const [mps, setMps] = useState([])

  const getMps = async ()  => {
    const result = await fetch("https://mps-api-production-8da5.up.railway.app/searchMps?party=Any");
    const mpsResult = await result.json();

    setMps(mpsResult);

  }

  useEffect(() => {
    getMps();    
}, []);

    
  const onQueryMp = async (id:number) => {
    router.push(`/mp?id=${id}`, { scroll: false });
    // const mp = await ky.get(`${config.apiUrl}/mp/${id}`).json();
    console.log(id);
  }

  return (
    <main className="grid min-h-screen p-24 gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 place-items-center"> 
        {mps && mps.map(mp =>  <MpCard key={(mp.id)} onQueryMp={onQueryMp} item={mp} />  )}    
    </main>
  );
}
