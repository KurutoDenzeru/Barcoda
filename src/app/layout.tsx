// src/app/layout.tsx
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
};

export const metadata: Metadata = {
	title: {
		default: "Barcoda - Barcode Generator",
		template: "%s | Barcoda",
	},
	description:
		"Create, customize, and download barcodes in multiple formats. Free online barcode generator supporting CODE128, EAN13, UPC, and more.",
	alternates: {
		canonical: 'https://barcoda.vercel.app',
	},
	keywords: [
		"barcode generator",
		"barcode maker",
		"QR code",
		"CODE128",
		"EAN13",
		"UPC",
		"QR code generator",
		"free barcode generator",
	],
	authors: [{ name: "Kurt Calacday", url: "https://github.com/KurutoDenzeru" }],
	creator: "Kurt Calacday",
	publisher: "Kurt Calacday",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	metadataBase: new URL("https://barcoda.vercel.app"),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://barcoda.vercel.app",
		title: "Barcoda - Barcode Generator",
		description:
			"Modern barcode generator that combines sleek design with seamless functionality. Built on Next.js, Tailwind, and Shadcn for effortless customization.",
		siteName: "Barcoda",
		images: [
			{
				url: "/sitemap.webp",
				width: 1200,
				height: 630,
				alt: "Barcoda - Barcode Generator",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Barcoda - Barcode Generator",
		description:
			"Modern barcode generator that combines sleek design with seamless functionality. Built on Next.js, Tailwind, and Shadcn for effortless customization.",
		images: ["/sitemap.webp"],
		creator: "@krtclcdy",
	},
	icons: "/favicon.ico",
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
	verification: {
		google: "your-google-site-verification",
		yandex: "your-yandex-verification",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="flex flex-col min-h-screen">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<Navbar />
					<main className="grow flex items-center justify-center">
						{children}
					</main>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
