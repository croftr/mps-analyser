//@ts-nocheck
"use client";
import { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import NeoTableSkeleton from "./neoTableSkeleton";

interface DataTableProps {
  data: any[] | undefined;
  title: string;
  onRowClick?: (row: any) => void;
}

export function NeoTable({ data, title, onRowClick }: DataTableProps) {

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({});


  useEffect(() => {
    // Initial column visibility setup
    const initialVisibility = {};
    if (data && data.length > 0 && data[0].keys) {
      data[0].keys.forEach((header) => {
        initialVisibility[header] = !header.toLowerCase().includes("id");
      });
    }
    setColumnVisibility(initialVisibility);
  }, [data]);

  const getValueForSorting = (row, id) => {
    const index = row.original._fieldLookup[id];
    const value = row.original._fields[index];

    // Handle cases where value might not exist or be in the expected format
    if (!value) return 0; // Or any default value you prefer for sorting
    if (value.low !== undefined) return value.low; // Handle numerical fields
    if (value.year)
      return new Date(
        value.year.low,
        value.month.low - 1,
        value.day.low
      ); // Handle date fields

    return value.toString(); // Default to string comparison for other types
  };

  const formatHeader = (value: string) => {
    
    if (value.toLowerCase().includes("nameDisplayAs")) {
      return "count"
    } else if (value.toLowerCase().includes("unitname")) {
      return "name"
    } 

    return value.split(".").pop() || value
  }

  const columns = useMemo(() => {
    if (data && data.length > 0 && data[0].keys) {
      return data[0].keys.map((header) => ({
        id: header,
        header: () => formatHeader(header),
        accessorFn: (row) => row._fields[row._fieldLookup[header]],
        cell: (info) => renderCell(info.getValue()),
        sortingFn: (rowA, rowB, id) => {
          const aValue = getValueForSorting(rowA, id);
          const bValue = getValueForSorting(rowB, id);

          if (
            typeof aValue === "number" &&
            typeof bValue === "number"
          ) {
            return aValue - bValue; // Numerical sorting
          } else {
            return aValue === bValue
              ? 0
              : aValue > bValue
                ? 1
                : -1; // String comparison
          }
        },
        isVisible: !header.includes("ID"),
      }));
    } else {
      return [];
    }
  }, [data]);

  const renderCell = (value) => {
    if (!value) {
      return "";
    }

    let renderedValue = value;

    if (value.low) {
      renderedValue = value.low;
    } else if (value.year) {
      const jsDate = new Date(
        value.year.low,
        value.month.low - 1,
        value.day.low
      );
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
    getPaginationRowModel: undefined,
    state: {
      globalFilter,
      sorting,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    enableSortingRemoval: false,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
  });

  return (

    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md overflow-x-auto">

      {data && (
        <>
          <div className="flex mb-4 items-baseline">
            <h1 className="text-2xl font-semibold dark:text-white">{title}</h1>
            <span className="text-gray-600 dark:text-gray-400 ml-2">
              {`(${data.length} records)`}
            </span>
          </div>

          <div className="mb-4">
            <Input
              placeholder="Filter..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm dark:bg-gray-700 dark:focus:ring-gray-500 dark:border-gray-600" // Dark mode input styling
            />
          </div>
        </>
      )}

      {!data ? (
        <NeoTableSkeleton columns={10} />
      ) : data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200 dark:divide-gray-700 max-w-full w-full table-auto">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:bg-gray-800 dark:text-gray-100 cursor-pointer select-none"
                    >
                      {flexRender(
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

            <TableBody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row.original)}
                  className={`hover:bg-gray-100 dark:hover:bg-gray-700 ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {row.getVisibleCells().map((cell, visibleCellIndex) => {
                    const originalCellIndex = row.getAllCells().findIndex(
                      (c) => c.id === cell.id
                    );
                    return (
                      <TableCell
                        key={cell.id}
                        className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white whitespace-normal break-words"
                      >
                        {renderCell(row.original._fields[originalCellIndex])}
                      </TableCell>
                    );
                  })}
                </tr>
              ))}
            </TableBody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 dark:text-gray-400">
          No data returned
        </div>
      )}
    </div>
  );
}
