"use client";
import { Skeleton } from "@/components/ui/skeleton";

const MpCardSkeleton = () => {
  return (
    <div className="relative p-4 border border-gray-200 rounded-md animate-pulse">
      <div className="absolute top-2 right-2">
        <Skeleton className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      <Skeleton className="h-6 w-2/3 mb-2 bg-gray-200 dark:bg-gray-700" />

      <div className="relative mb-1 aspect-square">
        <Skeleton className="h-full w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
      </div>

      <Skeleton className="h-4 w-1/2 mb-1 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700" />

      <div className="mt-8 grid grid-cols-3 text-center border rounded-md border-gray-200">
        <Skeleton className="h-5 w-full col-span-1 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-5 w-full col-span-1 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-5 w-full col-span-1 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-5 w-full col-span-1 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-5 w-full col-span-1 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-5 w-full col-span-1 bg-gray-200 dark:bg-gray-700" />
      </div>
    </div>
  );
};

export default MpCardSkeleton;

