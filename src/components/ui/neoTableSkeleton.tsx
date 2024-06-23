"use client";
import { Skeleton } from "@/components/ui/skeleton";

function NeoTableSkeleton({ columns }: { columns: number }) {

    const generateSkeletons = (num: number) => {
        return Array.from({ length: num }, (_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
        ));
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
            <div className="animate-pulse"> {/* Apply pulse animation to the entire skeleton */}
                {/* Skeleton Title and Record Count */}
                <div className="flex mb-4 items-baseline">
                    <Skeleton className="h-8 w-1/3 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-4 ml-2 w-14 bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Skeleton Filter Input */}
                <div className="mb-4">
                    <Skeleton className="h-10 max-w-sm bg-gray-200 dark:bg-gray-700" />
                </div>

                {/* Table Skeleton */}
                <div className="overflow-x-auto">
                    <table className="divide-y divide-gray-200 dark:divide-gray-700 max-w-full w-full table-auto">
                        <thead>
                            <tr>
                                {/* Skeleton Table Headers */}
                                {Array.from({ length: columns }, (_, i) => (
                                    <th
                                        key={i}
                                        className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-100"
                                    >
                                        <Skeleton className="h-4" />
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        {/* Skeleton Table Body */}
                        <tbody>
                            {Array.from({ length: 10 }, (_, i) => (
                                <tr key={i}>
                                    {Array.from({ length: columns }, (_, j) => (
                                        <td
                                            key={j}
                                            className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                                        >
                                            <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default NeoTableSkeleton;