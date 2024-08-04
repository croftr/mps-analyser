'use client';

import Link from "next/link";
import { 
    Compass, 
    Home, 
    Eye, 
    ReceiptPoundSterling, 
    Handshake
} from "lucide-react";

const navItems = [    
    { label: "Browse", icon: Compass, href: "/browse?type=MP", color: "bg-green-100 hover:bg-green-200" },
    { label: "Insights", icon: Eye, href: "/insights", color: "bg-yellow-100 hover:bg-yellow-200" },
    { label: "Donations", icon: ReceiptPoundSterling, href: "/donations", color: "bg-red-100 hover:bg-red-200" },
    { label: "Contracts", icon: Handshake, href: "/contracts", color: "bg-purple-100 hover:bg-purple-200" },
];

export default function ChipNavigation() {
    return (
        <div className="flex flex-wrap gap-2 p-4 justify-center"> 
            {navItems.map((item) => (
                <Link 
                    key={item.label} 
                    href={item.href}
                    className={`text-gray-800 font-medium py-1 px-2 rounded-full flex items-center gap-1 ${item.color}`} // Use dynamic color
                >
                    <item.icon className="h-4 w-4" /> 
                    {item.label}
                </Link>
            ))}
        </div>
    );
}
