// src/app/layout.tsx
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import type { Metadata } from "next";
import "./globals.css";

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

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
			{
				url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='5' height='5' x='3' y='3' rx='1'/><rect width='5' height='5' x='16' y='3' rx='1'/><rect width='5' height='5' x='3' y='16' rx='1'/><path d='M21 16h-3a2 2 0 0 0-2 2v3'/><path d='M21 21v.01'/><path d='M12 7v3a2 2 0 0 1-2 2H7'/><path d='M3 12h.01'/><path d='M12 3h.01'/><path d='M12 16v.01'/><path d='M16 12h1'/><path d='M21 12v.01'/><path d='M12 21v-1'/></svg>",
				type: "image/svg+xml",
				sizes: "any",
			},
		],
		shortcut: [
			"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='5' height='5' x='3' y='3' rx='1'/><rect width='5' height='5' x='16' y='3' rx='1'/><rect width='5' height='5' x='3' y='16' rx='1'/><path d='M21 16h-3a2 2 0 0 0-2 2v3'/><path d='M21 21v.01'/><path d='M12 7v3a2 2 0 0 1-2 2H7'/><path d='M3 12h.01'/><path d='M12 3h.01'/><path d='M12 16v.01'/><path d='M16 12h1'/><path d='M21 12v.01'/><path d='M12 21v-1'/></svg>",
		],
		apple: [
			{
				url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='5' height='5' x='3' y='3' rx='1'/><rect width='5' height='5' x='16' y='3' rx='1'/><rect width='5' height='5' x='3' y='16' rx='1'/><path d='M21 16h-3a2 2 0 0 0-2 2v3'/><path d='M21 21v.01'/><path d='M12 7v3a2 2 0 0 1-2 2H7'/><path d='M3 12h.01'/><path d='M12 3h.01'/><path d='M12 16v.01'/><path d='M16 12h1'/><path d='M21 12v.01'/><path d='M12 21v-1'/></svg>",
				sizes: "180x180",
				type: "image/svg+xml",
			},
		],
	},
	// manifest: "/manifest.json",
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
