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
      <body style={{ overflow: "hidden" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <Search />          
          <main className="mt-navbarHeight" style={{ height: "calc(100vh - 100px)", overflowY: "scroll", border: "1px solid" }}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
