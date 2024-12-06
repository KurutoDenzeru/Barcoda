// src/components/Navbar.tsx
"use client";

import { QrCode } from "lucide-react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Navbar() {
	return (
		<nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="flex items-center space-x-2">
					<QrCode className="h-6 w-6" />
					<span className="font-bold">Barcoda</span>
				</div>
				<div className="flex-1" />
				<ThemeSwitcher />
			</div>
		</nav>
	);
}
