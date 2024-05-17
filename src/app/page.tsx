// @ts-nocheck
"use client"
import MpCard from '@/components/ui/MpCard';
import { config } from './app.config';

import ky from 'ky';
import { useEffect, useState } from 'react';

const EARLIEST_FROM_DATE = "2003-11-12";

export default function Home() {

  const [mps, setMps] = useState([])

  const getMps = async ()  => {
    const result = await fetch("https://mps-api-production-8da5.up.railway.app/searchMps?party=Any");
    const mpsResult = await result.json();

    console.log("check ", mpsResult);
    
    setMps(mpsResult);

  }

  useEffect(() => {
    getMps();    
}, []);

    
  const onQueryMp = async (id:number) => {
    // const mp = await ky.get(`${config.apiUrl}/mp/${id}`).json();
    console.log(id);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {mps && mps.map(mp =>  <MpCard key={(mp.id)} onQueryMp={onQueryMp} item={mp} />  )}    
    </main>
  );
}
