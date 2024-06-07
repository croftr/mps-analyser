'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const searchParams = useSearchParams();
  const [paramId, setParamId] = useState("");

  useEffect(() => {
    if (searchParams) { 
      const newParamId = searchParams.toString().split("=")[1];
      setParamId(newParamId);
    }
  }, [searchParams]); 

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1>insights</h1>
      {paramId && <h2>{paramId}</h2>}
      {!paramId && <h2>nope</h2>}
    </main>
  );
}
