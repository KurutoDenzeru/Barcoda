// src/components/Navbar.tsx
"use client";

import { QrCode } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import Image from "next/image";

export function Navbar() {
	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
			<div className="container flex h-14 items-center min-w-0">
				<div className="flex items-center space-x-2 min-w-0">
					<Image
						src="/favicon.png"
						alt="Barcoda Logo"
						className="rounded-lg w-10 h-10"
						loading="lazy"
						priority={false}
						width={40}
						height={40}
						style={{ objectFit: "contain" }}
					/>
					<span className="font-bold truncate max-w-xs sm:max-w-none">Barcoda</span>
				</div>
				<div className="flex-1" />
				<ThemeSwitcher />
			</div>
		</nav>
	);
}
