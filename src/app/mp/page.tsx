"use client"
import { useMpStore } from "@/lib/store";
import { useEffect, useState } from 'react'
import Image from 'next/image';
import { useSearchParams } from 'next/navigation'
import ky from 'ky';

export default function Home() {

  // const mpDetails = useMpStore(state => state.mp);

  const [mpDetails, setMpDetails] = useState<Record<string, any> | undefined>({}); 
  

  const searchParams = useSearchParams()

  const onQueryMp = async (id:string) => {

		setMpDetails(undefined);
	
		const result:any = await ky(`https://members-api.parliament.uk/api/Members/${id}`).json();

    console.log("result ", result);
    
		setMpDetails(result);

		// onGetVotingSummary(result?.value?.id);

	}

  useEffect(() => {
    const paramId = searchParams.toString().split("=")[1]
    console.log(paramId);

    onQueryMp(paramId)

  }, [ searchParams])

  return (
    <section id="mpDetailsPage" className="flex flex-col items-center justify-between p-24">
      <h1>mp details</h1>

      {mpDetails?.value?.nameDisplayAs}

      <div style={{ width: 200, height: 200, border: "2px solid"}}>
        {mpDetails?.value?.thumbnailUrl && (
          <Image
            className='mpDetails__image'            
            height={200}
            width={200}
            src={`${mpDetails?.value?.thumbnailUrl}`}
            alt="MP Thumbnail"
          />
        )}
      </div>

    </section>
  );
}
