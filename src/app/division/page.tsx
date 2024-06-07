"use client"
import { useMpStore } from "@/lib/store";
import { Suspense, useEffect, useState } from 'react'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import ky from 'ky';

export default function Division() {


  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {

  // const mpDetails = useMpStore(state => state.mp);

  const [divisionDetails, setDivisionDetails] = useState<Record<string, any> | undefined>({});


  const searchParams = useSearchParams()

  const onQueryDivision = async (id: string) => {

    setDivisionDetails(undefined);

    const result: any = await ky(`https://commonsvotes-api.parliament.uk/data/division/${id}.json`).json();


    setDivisionDetails(result)
  }

  useEffect(() => {
    const paramId = searchParams.toString().split("=")[1]
    console.log(paramId);

    onQueryDivision(paramId)

  }, [searchParams])

  return (
    <section id="mpDetailsPage" className="flex flex-col items-center justify-between p-24">
      <h1>division details</h1>

      {JSON.stringify(divisionDetails)}

    </section>
  );
}
