// @ts-nocheck
import "./globals.css";

import Nav from "@/components/ui/nav";
import Search from "@/components/ui/search";

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      
      <body className="bg-background text-foreground overflow-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <Search />
          <main className="h-[calc(100vh-118px)] overflow-y-scroll pb-4">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
