'use client'

import Link from "next/link";

import { Compass } from "lucide-react"
import { Home } from "lucide-react"
import { Eye } from "lucide-react"
import { ReceiptPoundSterling } from "lucide-react"
import { Handshake } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

export default function Nav() {

  return (
    <NavigationMenu id="pageNav" className="w-full max-w-none p-2 fixed bottom-0 lg:top-0 xl:top-0 2xl:top-0 h-[50px] bg-background transition-transform duration-300 ease-in-out transform lg:-translate-y-0">      
      <NavigationMenuList className="flex justify-between w-full p-4">
      
      <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink>              
              <Home />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      
        <NavigationMenuItem>
          <Link href="/browse?type=MP" legacyBehavior passHref>
            <NavigationMenuLink>              
              <Compass />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>


        <NavigationMenuItem>
          <Link href="/insights" legacyBehavior passHref>
            <NavigationMenuLink>
            <Eye />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/donations" legacyBehavior passHref>
            <NavigationMenuLink>
            <ReceiptPoundSterling />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contracts" legacyBehavior passHref>
            <NavigationMenuLink>
              <Handshake />
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu >
  );
}

