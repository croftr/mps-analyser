'use client';

import Link from "next/link";
import {     
    Eye, 
    ReceiptPoundSterling, 
    Handshake,
    User,
    Vote
} from "lucide-react";

const navItems = [    
    // { label: "Browse MPs", icon: User, href: "/browse?type=MP", color: "bg-green-100 hover:bg-green-200" },
    // { label: "Browse Votes", icon: Vote, href: "/browse?type=Division", color: "bg-purple-100 hover:bg-purple-200" },
    { label: "Browse Donations", icon: ReceiptPoundSterling, href: "/donations", color: "bg-red-200 hover:bg-red-400" },
    { label: "Most contracts awarded", icon: Eye, href: "insights?type=org&donatedto=Any%20Party&awardedby=Any%20Party&limit=200&minTotalDonationValue=0&minContractCount=100&orgtype=Any", color: "bg-blue-100 hover:bg-blue-200" },
    { label: "Highest voting Mps", icon: Eye, href: "/insights?type=mp&name=Any&party=Any&voted=most&votetype=on&category=Any&fromdate=2015-01-01&todate=2024-08-09&limit=100", color: "bg-yellow-100 hover:bg-yellow-200" },
    { label: "Most voted against divisions", icon: Eye, href: "/insights?type=division&name=Any&party=Any&voted=most&votetype=against&category=Any&fromdate=2015-01-01&todate=2024-08-09&limit=100", color: "bg-orange-100 hover:bg-orange-200" },       
    { label: "Biggest Donars", icon: Eye, href: "insights?type=org&limit=100&minTotalDonationValue=10000000", color: "bg-green-100 hover:bg-green-200" }, 
    { label: "Donors also won contracts", icon: Eye, href: "insights?type=org&donatedto=Conservative&awardedby=Any%20Party&limit=200&minTotalDonationValue=100&minContractCount=1&orgtype=Any", color: "bg-green-100 hover:bg-green-200" }, 
    { label: "IT contracts awarded over 4 billion pounds", icon: Eye, href: "/insights?type=contract&awardedto=Any%20Organisation&awardedby=Any%20Party&groupbycontract=false&contractFromDate=2015-01-01&contractToDate=2024-08-26&contractname=&limit=200&industry=IT%20and%20Technology&valuefrom=4000000000&valueto=9999999999", color: "bg-green-100 hover:bg-green-200" }, 
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
