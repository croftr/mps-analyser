import "./globals.css";
import Nav from "@/components/ui/nav";
import { ThemeProvider } from "@/components/theme-provider";

import { Metadata } from "next";

export function metadata({ params }: { params: { slug?: string } }): Metadata {

  const title = params?.slug
    ? `Commons Connect - ${params.slug}`
    : 'Commons Connect - Explore UK Political Data';

  const description = params?.slug
    ? `Explore data related to ${params.slug} in the UK Parliament.`
    : 'Uncover connections between MPs, their votes, donations, and contracts using a powerful graph database.';

  return {
    title: title,
    description: description,
    other: {
      'google-site-verification': 'iXs8XEny4cqWemcVe0yqKaE66l5Nvfz88N40mkET_e8'
    },
    openGraph: {
      url: 'https://commons-connect.com',
      type: 'website',
      title: title, // Use the dynamic title here
      description: description, // Use the dynamic description
      images: ['https://commons-connect.com/opengraph-image.png'],
    },
    twitter: {
      card: 'summary_large_image',      
      site:'@croft_rob',        
      creator: "@croft_rob", 
      title: title, // Use the dynamic title here
      description: description, // Use the dynamic description
      images: ['https://commons-connect.com/twitter-image.png'],
    }
  };
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Website",
  "name": "Commons Connect",
  "url": "https://commons-connect.com/",
  "description": "Explore UK Political Data"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
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