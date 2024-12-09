// src/app/error.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Error({
	error,
	reset,
}: { error: Error; reset: () => void }) {
	const router = useRouter();

	useEffect(() => {
		console.error("ErrorBoundary caught an error:", error);
	}, [error]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-gray-900">
			<Alert variant="destructive" className="max-w-md">
				<AlertTitle>Something went wrong!</AlertTitle>
				<AlertDescription>{error.message}</AlertDescription>
			</Alert>
			<Button className="mt-4" onClick={() => reset()}>
				Try Again
			</Button>
			<Button className="mt-2" onClick={() => router.refresh()}>
				Refresh Page
			</Button>
		</div>
	);
}
