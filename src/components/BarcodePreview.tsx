"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, AlertCircle } from "lucide-react";
import { IMAGE_FORMATS } from "./constants/barcodeConstants";
import { downloadBarcode } from "./utils/barcodeUtils";

interface BarcodePreviewProps {
	barcodeElement: React.RefObject<SVGSVGElement | null>;
	error: string;
}

export const BarcodePreview: React.FC<BarcodePreviewProps> = ({
	barcodeElement,
	error,
}) => {
	return (
		<div className="order-1 md:order-2 bg-white/50 dark:bg-black/50 backdrop-blur-xs p-8 rounded-lg content-center shadow-md">
			<div className="flex flex-col p-4 items-center justify-center rounded-lg shadow-md">
				<svg ref={barcodeElement} className="rounded-lg">
					<title>Barcode Preview</title>
				</svg>
				{error && (
					<Alert variant="destructive" className="mt-4">
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
			</div>
			<div className="mt-4 flex justify-center">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button className="w-full">
							<Download className="mr-2 h-4 w-4" />
							Download
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{IMAGE_FORMATS.map((format) => (
							<DropdownMenuItem
								key={format.value}
								onClick={() => {
									if (barcodeElement.current) {
										downloadBarcode(barcodeElement, format.value);
									}
								}}
							>
								{format.label}
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
};
