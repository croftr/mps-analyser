//@ts-nocheck
"use client";
import * as React from 'react';
import {
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import PartyLabel from "@/components/ui/partyLabel";
import { capitalizeWords } from "@/lib/utils";

interface DataTableProps {
    data: any[]; // Assuming your data is an array of objects
    columns: any[]; // Make sure to define the correct types for your columns
    onRowClick: Function;
}

export function DataTable({ data, columns, onRowClick }: DataTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableSortingRemoval: false,
    });

    //@ts-ignore
    const renderCellContent = (cell) => {
        // Get the actual value from the cell
        let cellValue = cell.getValue(); // Use the getValue() method        

        if (!cellValue) {
            return "";
        }

        // Check if the column header indicates currency
        if (cell.column.columnDef.header.toLowerCase() === "party name") {
            return <PartyLabel partyName={cellValue} />
        } else if (cell.column.columnDef.header.toLowerCase().includes("amount") || cell.column.columnDef.header.toLowerCase().includes("value")) {

            if (typeof cellValue === "number") {
                cellValue = `£${cellValue.toLocaleString()}`;
            } else if (typeof cellValue === "string") {
                const parsedValue = parseFloat(cellValue);
                if (!isNaN(parsedValue)) {
                    cellValue = `£${parsedValue.toLocaleString()}`;
                }
            }
        } else if (cell.column.columnDef.header.toLowerCase().includes("date")) {            

            const year = cellValue.year.low;
            const month = cellValue.month.low - 1; // JavaScript months are 0-indexed
            const day = cellValue.day.low;
            return `${year}/${month}/${day}`;
        }

        return capitalizeWords(cellValue.toString());
    };


    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    onClick={header.column.getToggleSortingHandler()}
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer select-none"
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    {header.column.getIsSorted() ? (
                                        <span>
                                            {header.column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼'}
                                        </span>
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                    {table.getRowModel().rows.map((row) => (
                        <tr
                        className={`${onRowClick ? "hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" : ""} ${onRowClick === undefined && 'no-hover'}`} 
                            onClick={onRowClick ? () => onRowClick(row) : () => {}}
                            key={row.id}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                                    {renderCellContent(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
