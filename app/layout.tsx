import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://barcoda.vercel.app/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Barcoda - QR Code & Barcode Generator and Scanner",
    template: "%s | Barcoda",
  },
  description: "🤳🏻 Modern barcode + QR code generator with built-in code scanner, combining sleek design with seamless functionality. Built on Next.js, Tailwind, and Shadcn for effortless customization.",
  keywords: [
    "QR code generator",
    "barcode generator",
    "QR code scanner",
    "barcode scanner",
    "React",
    "TypeScript",
    "Next.js",
    "Tailwind CSS",
    "shadcn/ui",
    "PDF editor",
    "react-pdf",
    "pdf.js",
    "web app",
    "free QR code",
    "free barcode",
  ],
  authors: [
    {
      name: "Kurt Calacday",
      url: siteUrl,
    },
  ],
  creator: "Kurt Calacday",
  publisher: "Barcoda",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/brand.png",
    apple: "/brand.png",
    shortcut: "/brand.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Barcoda",
    title: "Barcoda - QR Code & Barcode Generator and Scanner",
    description: "🤳🏻 Modern barcode + QR code generator with built-in code scanner, combining sleek design with seamless functionality. Built on Next.js, Tailwind, and Shadcn for effortless customization.",
    images: [
      {
        url: "/OpenGraph.webp",
        width: 1200,
        height: 630,
        alt: "Barcoda - QR Code & Barcode Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Barcoda - QR Code & Barcode Generator and Scanner",
    description: "🤳🏻 Modern barcode + QR code generator with built-in code scanner, combining sleek design with seamless functionality. Built on Next.js, Tailwind, and Shadcn for effortless customization.",
    images: ["/OpenGraph.webp"],
    creator: "@barcoda",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Barcoda",
    description: "🤳🏻 Modern barcode + QR code generator with built-in code scanner, combining sleek design with seamless functionality. Built on Next.js, Tailwind, and Shadcn for effortless customization.",
    url: siteUrl,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Person",
      name: "Kurt Calacday",
    },
    publisher: {
      "@type": "Organization",
      name: "Barcoda",
      url: siteUrl,
    },
    image: `${siteUrl}/OpenGraph.webp`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
