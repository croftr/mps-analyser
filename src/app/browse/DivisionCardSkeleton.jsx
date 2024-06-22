"use client";
import { Skeleton } from "@/components/ui/skeleton";

const DivisionCardSkeleton = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 animate-pulse flex flex-col justify-between h-64">
      <div className="flex items-start gap-2">
        <Skeleton className="h-6 w-6 rounded-full" /> {/* Round SVG placeholder */}
        <Skeleton className="h-6 w-2/3" />            {/* Title placeholder */}
      </div>

      {/* Rest of the skeletons (category, date, grid) */}
      <Skeleton className="h-4 mt-2 w-1/2" /> 
      <Skeleton className="h-4 w-1/3" />

      <div className="mt-2 grid grid-cols-3 text-center text-sm border rounded-md border-gray-200 dark:border-gray-600">
        <Skeleton className="h-7 w-full col-span-1" />
        <Skeleton className="h-7 w-full col-span-1" />
        <Skeleton className="h-7 w-full col-span-1" />
        <Skeleton className="h-7 w-full col-span-1" />
        <Skeleton className="h-7 w-full col-span-1" />
        <Skeleton className="h-7 w-full col-span-1" />
      </div>
    </div>
  );
};

export default DivisionCardSkeleton;
