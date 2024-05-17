"use client"
import { useMpStore } from "@/lib/store";

import Image from 'next/image';

export default function Home() {

  const mpDetails = useMpStore(state => state.mp);

  return (
    <section id="mpDetailsPage" className="flex flex-col items-center justify-between p-24">
      <h1>mp details</h1>

      {mpDetails?.nameDisplayAs}

      <div style={{ width: 200, height: 200, border: "2px solid"}}>
        {mpDetails?.thumbnailUrl && (
          <Image
            className='mpDetails__image'            
            height={200}
            width={200}
            src={`${mpDetails?.thumbnailUrl}`}
            alt="MP Thumbnail"
          />
        )}
      </div>

    </section>
  );
}
