import "./globals.css";
import Nav from "@/components/ui/nav";
import { ThemeProvider } from "@/components/theme-provider";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Commons Connect - Explore UK Political Data',
  description: 'Uncover connections between MPs, their votes, donations, and contracts using a powerful graph database.',
  other: {
    'google-site-verification': 'iXs8XEny4cqWemcVe0yqKaE66l5Nvfz88N40mkET_e8'
  }
};

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
          <main className="min-h-[calc(100vh-30px)] overflow-y-auto pt-4 mt-0 lg:mt-12 pb-20 sm:pb-12"
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}