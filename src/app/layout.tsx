// src/app/layout.tsx
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: {
		default: "Barcoda - Barcode Generator",
		template: "%s | Barcoda",
	},
	description:
		"Create, customize, and download barcodes in multiple formats. Free online barcode generator supporting CODE128, EAN13, UPC, and more.",
	keywords: [
		"barcode generator",
		"barcode maker",
		"QR code",
		"CODE128",
		"EAN13",
		"UPC",
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
				url: "/src/assets/barcoda.avif",
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
		images: ["/src/assets/barcoda.avif"],
		creator: "@krtclcdy",
	},
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/icon.svg", type: "image/svg+xml" },
			{ url: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
		other: [
			{
				rel: "mask-icon",
				url: "/safari-pinned-tab.svg",
				color: "#000000",
			},
		],
	},
	manifest: "/manifest.json",
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
	},
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
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="relative min-h-screen">
						<Navbar />
						<main>{children}</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
