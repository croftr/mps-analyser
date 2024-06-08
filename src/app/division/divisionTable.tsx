// @ts-nocheck
"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const HEADERS = ["Party", "Name"]

export default function DivisionTable({ data, title }) {

    return (
        <div className="ring">
            <div className="flex justify-between p-4 bg-primary text-white">
                <h1>{title}</h1>
                <h1>{`${data ? data.length : "0"} records`}</h1>                
            </div>

            <hr/>

            <Table>
                <TableCaption>{title}</TableCaption>
                <TableHeader>
                    <TableRow>
                        {HEADERS.map(header => (
                            <TableHead key={`head-${header}`}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && Array.isArray(data) && data.map((row: any, rowIndex) => (
                        <TableRow key={`row-${rowIndex}`}>
                            <TableCell>{row.party}</TableCell>
                            <TableCell>{row.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    );
}
