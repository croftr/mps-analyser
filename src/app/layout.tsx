// @ts-nocheck
import "./globals.css";
import "../styles/utils.css";
import "../styles/browse.css"

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
      <body style={{ overflow: "hidden" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <Search />
          <main className="h-[calc(100vh-118px)] overflow-y-scroll border border-gray-300">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
