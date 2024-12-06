// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import JsBarcode from "jsbarcode";
import { Download, Eye, EyeOff, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const BARCODE_FORMATS: Record<string, string> = {
	CODE128: "CODE128",
	EAN13: "EAN13",
	EAN8: "EAN8",
	UPC: "UPC",
	CODE39: "CODE39",
	ITF14: "ITF14",
	MSI: "MSI",
	CODABAR: "CODABAR",
};

const IMAGE_FORMATS = [
	{ label: "PNG Image", value: "png" },
	{ label: "JPEG Image", value: "jpeg" },
	{ label: "WebP Image", value: "webp" },
	{ label: "SVG Vector", value: "svg" },
];

const FORMAT_LIMITS: Record<string, number> = {
	CODE128: 20,
	EAN13: 12,
	EAN8: 7,
	UPC: 12,
	CODE39: 20,
	ITF14: 13,
	MSI: 10,
	CODABAR: 20,
};

const DEFAULT_OPTIONS = {
	width: 2,
	height: 100,
	margin: 10,
	background: "#ffffff",
	lineColor: "#000000",
	font: "monospace",
	fontSize: 20,
	textAlign: "center",
	textPosition: "bottom",
	textMargin: 2,
	format: "CODE128",
	displayValue: true,
};

export default function BarcodeGenerator() {
	const [barcodeValue, setBarcodeValue] = useState("Example123");
	const [barcodeOptions, setBarcodeOptions] = useState(DEFAULT_OPTIONS);
	const [error, setError] = useState("");
	const [showText, setShowText] = useState(true);
	const [maxLength, setMaxLength] = useState(
		FORMAT_LIMITS[DEFAULT_OPTIONS.format],
	);

	useEffect(() => {
		setMaxLength(FORMAT_LIMITS[barcodeOptions.format] || 20);
		if (barcodeValue.length > (FORMAT_LIMITS[barcodeOptions.format] || 20)) {
			setBarcodeValue(
				barcodeValue.slice(0, FORMAT_LIMITS[barcodeOptions.format]),
			);
		}
	}, [barcodeOptions.format, barcodeValue]);

	// Load saved settings
	useEffect(() => {
		const savedSettings = localStorage.getItem("barcodeSettings");
		if (savedSettings) {
			const { value, options } = JSON.parse(savedSettings);
			setBarcodeValue(value);
			setBarcodeOptions(options);
			setMaxLength(FORMAT_LIMITS[options.format] || 20);
		}
	}, []);

	// Save settings & update barcode on change
	useEffect(() => {
		localStorage.setItem(
			"barcodeSettings",
			JSON.stringify({
				value: barcodeValue,
				options: barcodeOptions,
			}),
		);

		try {
			if (barcodeValue) {
				JsBarcode("#barcode", barcodeValue, {
					...barcodeOptions,
					displayValue: showText,
				});
				setError("");
			}
		} catch (err) {
			setError("Invalid barcode value");
		}
	}, [barcodeValue, barcodeOptions, showText]);

	const downloadBarcode = (format: string) => {
		const canvas = document.getElementById("barcode") as HTMLCanvasElement;
		const link = document.createElement("a");
		link.download = `barcode.${format}`;
		link.href = canvas.toDataURL(`image/${format}`);
		link.click();
	};

	return (
		<div className="relative min-h-[calc(100vh-8rem)] bg-background dark:bg-[#1a1a1a] p-4 items-center justify-center flex">
			<div
				className={`absolute inset-0 -z-10 ${
					// Light mode background
					"bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"
				} dark:bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:6rem_4rem]`}
			>
				<div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#333333,transparent)]" />
			</div>
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:flex-row-reverse">
					{/* Preview Section - Shows first on mobile */}
					<div className="order-1 md:order-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg content-center">
						<div className="flex flex-col items-center justify-center min-h-[300px]">
							<canvas className="rounded-lg max-w-full" id="barcode" />
							{error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
						</div>
						<div className="mt-4 flex justify-center">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button>
										<Download className="mr-2 h-4 w-4" />
										Download
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									{IMAGE_FORMATS.map((format) => (
										<DropdownMenuItem
											key={format.value}
											onClick={() => downloadBarcode(format.value)}
										>
											{format.label}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					{/* Controls Section */}
					<div className="order-2 md:order-1 space-y-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg">
						<Popover>
							<PopoverTrigger asChild>
								<div className="flex items-center">
									<Input
										placeholder="Enter barcode value"
										value={barcodeValue}
										maxLength={maxLength}
										onChange={(e) => setBarcodeValue(e.target.value)}
									/>
									<Info className="ml-2 h-4 w-4 text-gray-500" />
								</div>
							</PopoverTrigger>
							<PopoverContent>
								<p>
									Enter up to {maxLength} characters for {barcodeOptions.format}
									.
								</p>
							</PopoverContent>
						</Popover>

						<Popover>
							<PopoverTrigger asChild>
								<div className="space-y-4">
									<Label>Barcode Format</Label>
									<Select
										value={barcodeOptions.format}
										onValueChange={(value) =>
											setBarcodeOptions({ ...barcodeOptions, format: value })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select format" />
										</SelectTrigger>
										<SelectContent>
											{Object.entries(BARCODE_FORMATS).map(([key, value]) => (
												<SelectItem key={key} value={value}>
													{key}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
							</PopoverTrigger>
							<PopoverContent>
								<p>Select the barcode format that best suits your needs.</p>
							</PopoverContent>
						</Popover>

						<div className="flex items-center justify-between">
							<Label>Show Text</Label>
							<Button
								variant="outline"
								size="icon"
								onClick={() => setShowText(!showText)}
							>
								{showText ? (
									<Eye className="h-4 w-4" />
								) : (
									<EyeOff className="h-4 w-4" />
								)}
							</Button>
						</div>

						<div className="space-y-6">
							<Popover>
								<PopoverTrigger asChild>
									<div className="space-y-4">
										<Label>Bar Width ({barcodeOptions.width}px)</Label>
										<Slider
											value={[barcodeOptions.width]}
											min={1}
											max={10}
											step={1}
											onValueChange={([value]) =>
												setBarcodeOptions({ ...barcodeOptions, width: value })
											}
										/>
									</div>
								</PopoverTrigger>
								<PopoverContent>
									<p>Adjust the width of the barcode lines.</p>
								</PopoverContent>
							</Popover>

							<Popover>
								<PopoverTrigger asChild>
									<div className="space-y-4">
										<Label>Height ({barcodeOptions.height}px)</Label>
										<Slider
											value={[barcodeOptions.height]}
											min={50}
											max={200}
											step={10}
											onValueChange={([value]) =>
												setBarcodeOptions({ ...barcodeOptions, height: value })
											}
										/>
									</div>
								</PopoverTrigger>
								<PopoverContent>
									<p>Set the height of the barcode.</p>
								</PopoverContent>
							</Popover>

							<Popover>
								<PopoverTrigger asChild>
									<div className="space-y-4">
										<Label>Margin ({barcodeOptions.margin}px)</Label>
										<Slider
											value={[barcodeOptions.margin]}
											min={0}
											max={50}
											step={5}
											onValueChange={([value]) =>
												setBarcodeOptions({ ...barcodeOptions, margin: value })
											}
										/>
									</div>
								</PopoverTrigger>
								<PopoverContent>
									<p>Define the margin around the barcode.</p>
								</PopoverContent>
							</Popover>

							{showText && (
								<>
									<Popover>
										<PopoverTrigger asChild>
											<div className="space-y-4">
												<Label>Font Size ({barcodeOptions.fontSize}px)</Label>
												<Slider
													value={[barcodeOptions.fontSize]}
													min={10}
													max={40}
													step={2}
													onValueChange={([value]) =>
														setBarcodeOptions({
															...barcodeOptions,
															fontSize: value,
														})
													}
												/>
											</div>
										</PopoverTrigger>
										<PopoverContent>
											<p>Adjust the size of the text below the barcode.</p>
										</PopoverContent>
									</Popover>

									<Popover>
										<PopoverTrigger asChild>
											<div className="space-y-4">
												<Label>
													Text Margin ({barcodeOptions.textMargin}px)
												</Label>
												<Slider
													value={[barcodeOptions.textMargin]}
													min={0}
													max={20}
													step={1}
													onValueChange={([value]) =>
														setBarcodeOptions({
															...barcodeOptions,
															textMargin: value,
														})
													}
												/>
											</div>
										</PopoverTrigger>
										<PopoverContent>
											<p>Set the margin between the barcode and its text.</p>
										</PopoverContent>
									</Popover>

									<Popover>
										<PopoverTrigger asChild>
											<div className="space-y-4">
												<Label>Text Align</Label>
												<Select
													value={barcodeOptions.textAlign}
													onValueChange={(value) =>
														setBarcodeOptions({
															...barcodeOptions,
															textAlign: value,
														})
													}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select alignment" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="left">Left</SelectItem>
														<SelectItem value="center">Center</SelectItem>
														<SelectItem value="right">Right</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</PopoverTrigger>
										<PopoverContent>
											<p>Choose the alignment of the text below the barcode.</p>
										</PopoverContent>
									</Popover>
								</>
							)}

							<Popover>
								<PopoverTrigger asChild>
									<div className="space-y-4">
										<Label>Colors</Label>
										<div className="grid grid-cols-2 gap-4">
											<Input
												type="color"
												value={barcodeOptions.lineColor}
												onChange={(e) =>
													setBarcodeOptions({
														...barcodeOptions,
														lineColor: e.target.value,
													})
												}
											/>
											<Input
												type="color"
												value={barcodeOptions.background}
												onChange={(e) =>
													setBarcodeOptions({
														...barcodeOptions,
														background: e.target.value,
													})
												}
											/>
										</div>
									</div>
								</PopoverTrigger>
								<PopoverContent>
									<p>Select the line and background colors for the barcode.</p>
								</PopoverContent>
							</Popover>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
