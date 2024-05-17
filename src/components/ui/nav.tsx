'use client'

import Link from "next/link";

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
    <NavigationMenu id="pageNav" className="w-full max-w-none p-2 pt-4 fixed bottom-0 mb-5 lg:top-0 xl:top-0 2xl:top-0 h-[30px]">
      <NavigationMenuList className="flex justify-between w-full">

        <NavigationMenuItem style={{ border: "1px solid"}}>
          <Link href="/"legacyBehavior passHref>
            <NavigationMenuLink>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/"legacyBehavior passHref>
            <NavigationMenuLink>
              Search
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/mp"legacyBehavior passHref>
            <NavigationMenuLink>
              Mp Details
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/division"legacyBehavior passHref>
            <NavigationMenuLink>
              Division Details
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/insights"legacyBehavior passHref>
            <NavigationMenuLink>
              Insights
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/donations"legacyBehavior passHref>
            <NavigationMenuLink>
              Donations
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu >
  );
}

