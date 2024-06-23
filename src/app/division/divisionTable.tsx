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
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import DivisioSkeletonTable from "./divisionSkeletonTable";


interface DivisionTableProps {
    data: { party: string; name: string }[] | undefined;
    title: string;
    onQueryMp: (id: number) => void;
}

export default function DivisionTable({ data, title, onQueryMp }: DivisionTableProps) {

    const [sorting, setSorting] = useState<any[]>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const columns = useMemo(
        () => [
            {
                header: "Party",
                accessorKey: "party",
            },
            {
                header: "Name",
                accessorKey: "name",
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    });

    return (
        <div className="ring flex-1">
            <div className="flex justify-between p-4 bg-primary text-white">
                <h1>{title}</h1>
                <h1>{`${data ? data.length : 0} records`}</h1>
            </div>

            <hr />

            <Input
                type="text"
                placeholder="Filter by party or name"
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="mb-4"
            />
            {!data ? <DivisioSkeletonTable />
                : (
                  
                    <Table>
                        <TableCaption>{title}</TableCaption>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            className="cursor-pointer"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {{
                                                asc: " 🔼",
                                                desc: " 🔽",
                                            }[header.column.getIsSorted() as string] ?? null}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() => onQueryMp(row.original.id)}
                                    className="hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )
            }
        </div>
    );
}
