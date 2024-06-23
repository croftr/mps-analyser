"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"; // Assuming you have these Shadcn components


function DivisionTableSkeleton() {
  return (
    <div className="ring animate-pulse">
      {/* Title and Record Count Skeleton */}
      <div className="flex justify-between p-4 bg-primary text-white">
        <Skeleton className="h-6 w-28" /> {/* Adjust width as needed */}
        <Skeleton className="h-6 w-16" />
      </div>

      <hr />

      {/* Filter Input Skeleton */}
      <div className="mb-4">
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Table Skeleton */}
      <Table>
        <TableCaption>
          <Skeleton className="h-6" /> 
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100">
              <Skeleton className="h-4" />
            </TableHead>
            <TableHead className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100">
              <Skeleton className="h-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 20 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                <Skeleton className="h-4 w-full" />
              </TableCell>
              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                <Skeleton className="h-4 w-full" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default DivisionTableSkeleton;
