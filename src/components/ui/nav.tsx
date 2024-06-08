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
    <NavigationMenu id="pageNav" className="w-full max-w-none p-2 fixed bottom-0 lg:top-0 xl:top-0 2xl:top-0 h-[50px] bg-background transition-transform duration-300 ease-in-out transform lg:-translate-y-0">
      {/* <NavigationMenu className="p-4 pt-6 bottom-0 lg:top-0 xl:top-0 2xl:top-0 h-[30px] bg-background transition-transform duration-300 ease-in-out transform lg:-translate-y-0 w-full max-w-none">  */}
      <NavigationMenuList className="flex justify-between w-full">
      
        <NavigationMenuItem>
          <Link href="/browse?type=MP" legacyBehavior passHref>
            <NavigationMenuLink>
              Browse
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>


        <NavigationMenuItem>
          <Link href="/insights" legacyBehavior passHref>
            <NavigationMenuLink>
              Insights
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/donations" legacyBehavior passHref>
            <NavigationMenuLink>
              Donations
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/contracts" legacyBehavior passHref>
            <NavigationMenuLink>
              Contracts
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu >
  );
}

