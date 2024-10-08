'use client';

import { useState, useEffect, Suspense } from 'react';
import ky from 'ky';
import { config } from '../app.config';

import { Handshake } from "lucide-react"

import { useSearchParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { formatCurrency } from "@/lib/utils";
import { Badge } from '@/components/ui/badge';

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
  const [title, setTitle] = useState<string | null>("");
  const [awardedTo, setAwardedTo] = useState<string | null>("");
  const [value, setValue] = useState(0);

  const [contract, setContract] = useState<Array<any>>();

  const getData = async () => {

    const titleParam: string | null = searchParams.get('title');
    const supplierParam: string | null = searchParams.get('supplier');
    const valueParam: number = Number(searchParams.get('value'));

    setTitle(titleParam);
    setAwardedTo(supplierParam);
    setValue(valueParam);

    const response: Array<any> = await ky(`${config.mpsApiUrl}contracts/details?title=${encodeURIComponent(titleParam || "")}&supplier=${encodeURIComponent(supplierParam || "")}&value=${valueParam}`).json();

    if (!response || !response[0] || !response[0]._fields || !response[0]._fields[0] || !response[0]._fields[0].properties) {
      setContract([])
      return <div>No contract details available.</div>; // Or a more informative message/component
    }

    setContract(response)
    setName(`${supplierParam} ${titleParam} ${valueParam}`);

  }

  useEffect(() => {

    getData();
  }, [router, searchParams]);

  return (

    <div className="flex flex-col justify-center p-4 gap-6 mb-10">

      <div className="flex items-center justify-center gap-4 text-lg font-semibold">

        <div className="flex">
          <div className="nameItem flex-1 flex items-center justify-end gap-2 relative overflow-hidden hidden md:flex"> {/* Hide on smaller screens, show on medium and larger */}
            <span className="truncate">{title}</span>
            <div className="h-6 border-l border-gray-300"></div>
          </div>

          <div className="headerItem flex-1 mt-2 rounded-full p-4 ring-1 flex flex-col items-center min-w-40 mr-4 ml-4">
            <Handshake className="h-6 w-6 relative arrow-container" />
            <span className="font-medium">
              {formatCurrency(value)}
            </span>
          </div>

          <div className="nameItem flex-1 flex items-center justify-start gap-2 relative overflow-hidden hidden md:flex"> {/* Hide on smaller screens, show on medium and larger */}
            <div className="h-6 border-l border-gray-300"></div>
            <span className="truncate">{awardedTo}</span>
          </div>
        </div>
      </div>

      {!contract && (<div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400 m-auto mt-5"></div>)}

      {contract && contract[0] && (
        <div className="ring-1 rounded-md p-4">
          <h2 className="text-xl font-semibold mb-2">{contract[0]._fields[0].properties.Title}</h2>
          <div className="grid grid-cols-2 gap-y-2">

            <div className="font-medium">Awarded to:</div>
            <a className='text-primary hover:underline' href="#" onClick={() => router.push(`org?name=${encodeURIComponent(awardedTo || "")}`)}>{awardedTo}</a>

            {/* <div className='description col-span-2 p-2'>{contract[0]._fields[0].properties.Description}</div> */}

            <div className='description col-span-2 p-2 dark:bg-gray-800 bg-gray-100'>{contract[0]._fields[0].properties.Description}</div>

            <div className="font-medium">Industry:</div>
            <div>{contract[0]._fields[0].properties.Industry}</div>

            <div className="font-medium">Categories:</div>
            <div className="flex flex-wrap gap-2">
              {contract[0]._fields[0].properties.Categories.map((i: string) => (
                <Badge key={i}>{i}</Badge>
              ))}
            </div>
            <div className="font-medium">Awarded Value:</div>
            <div className="font-semibold">
              {formatCurrency(contract[0]._fields[0].properties.AwardedValue)}
            </div>

            <div className="font-medium">Awarded Date:</div>
            <div>
              {new Date(
                contract[0]._fields[0].properties.AwardedDate.year.low,
                contract[0]._fields[0].properties.AwardedDate.month.low - 1, // Months are 0-indexed
                contract[0]._fields[0].properties.AwardedDate.day.low
              ).toLocaleDateString('en-GB')}
            </div>

            <div className="font-medium">Published Date:</div>
            <div>
              {new Date(
                contract[0]._fields[0].properties.PublishedDate.year.low,
                contract[0]._fields[0].properties.PublishedDate.month.low - 1,
                contract[0]._fields[0].properties.PublishedDate.day.low
              ).toLocaleDateString('en-GB')}
            </div>

            <div className="font-medium">Supplier:</div>
            <div>{contract[0]._fields[0].properties.Supplier}</div>

            <div className="font-medium">Location:</div>
            <div>{contract[0]._fields[0].properties.Location}</div>
          </div>

          <a
            href={contract[0]._fields[0].properties.Link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-primary hover:underline"
          >
            View full details
          </a>
        </div>
      )}
    </div>
  );

}

