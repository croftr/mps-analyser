// "use client" // If you have Client Components
import "./globals.css";
import Nav from "@/components/ui/nav";
// import Search from "@/components/ui/search"; 
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Nav />
          {/* <Search /> */}
          <main className="min-h-[calc(100vh-30px)] overflow-y-auto pt-4 mt-0 lg:mt-12 pb-24 sm:pb-12"           
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}