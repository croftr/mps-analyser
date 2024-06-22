//@ts-nocheck
"use client";
import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  data: any[];
  title: string; 
  onRowClick?: (row: any) => void; 
}

export function NeoTable({ data, title, onRowClick }: DataTableProps) {
  
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState<any[]>([]);

  useEffect(() => {
    console.log("neotable useeffect ");

    setIsLoading(false); // Simulating data loading (replace with your actual data fetching)
  }, [data]);

  const getValueForSorting = (row, id) => {
    const index = row.original._fieldLookup[id];
    const value = row.original._fields[index];

    // Handle cases where value might not exist or be in the expected format
    if (!value) return 0; // Or any default value you prefer for sorting
    if (value.low !== undefined) return value.low; // Handle numerical fields
    if (value.year) return new Date(value.year.low, value.month.low - 1, value.day.low); // Handle date fields

    return value.toString(); // Default to string comparison for other types
  };

  const columns = useMemo(() => {

    if (data && data.length > 0 && data[0].keys) {
      return data[0].keys.map((header) => ({
        header: header,        
        accessorFn: (row) => row._fields[row._fieldLookup[header]],
        cell: (info) => renderCell(info.getValue()),
        sortingFn: (rowA, rowB, id) => {
          const aValue = getValueForSorting(rowA, id);
          const bValue = getValueForSorting(rowB, id);

          if (typeof aValue === "number" && typeof bValue === "number") {
            return aValue - bValue; // Numerical sorting
          } else {
            return aValue === bValue ? 0 : aValue > bValue ? 1 : -1; // String comparison
          }
        },
      }));
    } else {
      return [];
    }
  }, [data]);

  const renderCell = (value) => {

    if (!value) {
      return ""
    }

    let renderedValue = value;

    if (value.low) {
      renderedValue = value.low;
    } else if (value.year) {
      const jsDate = new Date(value.year.low, value.month.low - 1, value.day.low);
      renderedValue = jsDate.toLocaleDateString();
    }

    return renderedValue.toString();
  };

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      sorting
    },
    enableSortingRemoval: false, 
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  return (
    <div>
      <h1>{title}</h1>
      <h1>{`${data ? data.length : "0"} records`}</h1>

      <div>
        <Input
          placeholder="Filter..."
          value={(globalFilter ?? "")}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm mb-4"
        />
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <div className="overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        onClick={header.column.getToggleSortingHandler()}
                        className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {header.column.getIsSorted() ? (
                          <span>
                            {header.column.getIsSorted() === "desc" ? " 🔽" : " 🔼"}
                          </span>
                        ) : null}
                      </th>
                    ))}
                  </tr>
                ))}

              </thead>
              <TableBody className="overflow-auto">
                {table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id} 
                    onClick={() => onRowClick?.(row.original)}                     
                    className={`hover:bg-gray-100 dark:hover:bg-gray-800 ${
                      onRowClick ? "cursor-pointer" : ""
                    }`} 
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => (
                      <TableCell key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm font-medium dark:text-white">
                        {renderCell(cell.row.original._fields[cellIndex])}
                      </TableCell>
                    ))}
                  </tr>
                ))}
              </TableBody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
}
