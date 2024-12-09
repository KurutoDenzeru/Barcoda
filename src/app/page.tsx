"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import JsBarcode from "jsbarcode";
import {
	AlertCircle,
	Download,
	Info,
	Bold,
	Italic,
	Underline,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

const barcodeTypes: string[] = [
	"CODE128",
	"CODE128A",
	"CODE128B",
	"CODE128C",
	"EAN13",
	"EAN8",
	"UPC",
	"CODE39",
	"ITF14",
	"ITF",
	"MSI",
	"MSI10",
	"MSI11",
	"MSI1010",
	"MSI1110",
	"pharmacode",
	"codabar",
];

const fontOptions: string[] = [
	"monospace",
	"sans-serif",
	"serif",
	"fantasy",
	"cursive",
	"system-ui",
	"Arial",
	"Helvetica",
	"Times New Roman",
	"Courier New",
	"Georgia",
	"Verdana",
	"Comic Sans MS",
	"Impact",
	"Lucida Console",
	"Tahoma",
	"Trebuchet MS",
	"Palatino Linotype",
	"Book Antiqua",
	"Courier",
	"Lucida Sans Unicode",
	"MS Serif",
	"MS Sans Serif",
];

const IMAGE_FORMATS = [
	{ label: "PNG Image", value: "png" },
	{ label: "JPEG Image", value: "jpeg" },
	{ label: "WebP Image", value: "webp" },
	{ label: "SVG Vector", value: "svg" },
];

const formatExamples: Record<string, string> = {
	CODE128: "Example123",
	CODE128A: "EXAMPLE",
	CODE128B: "Example123",
	CODE128C: "1234567890",
	EAN13: "5901234123457",
	EAN8: "96385074",
	UPC: "042100005264",
	CODE39: "BARCODE39",
	ITF14: "0891234567895",
	ITF: "1234567890",
	MSI: "123456789",
	MSI10: "123456789",
	MSI11: "123456789",
	MSI1010: "123456789",
	MSI1110: "123456789",
	codabar: "A40156B",
	pharmacode: "123456",
};

const formatLimits: Record<string, number> = {
	CODE128: 20,
	EAN13: 13,
	EAN8: 8,
	UPC: 12,
	CODE39: 43,
	ITF14: 14,
	MSI: 14,
	codabar: 16,
	pharmacode: 6,
};

export default function BarcodeGenerator() {
	const [barcodeData, setBarcodeData] = useState("1234567890");
	const [barcodeType, setBarcodeType] = useState("CODE128");
	const [barWidth, setBarWidth] = useState(2);
	const [height, setHeight] = useState(100);
	const [margin, setMargin] = useState(10);
	const [background, setBackground] = useState("#ffffff");
	const [lineColor, setLineColor] = useState("#000000");
	const [showText, setShowText] = useState(true);
	const [textAlign, setTextAlign] = useState("center");
	const [font, setFont] = useState("monospace");
	const [fontSize, setFontSize] = useState(20);
	const [textMargin, setTextMargin] = useState(2);
	const [fontWeight, setFontWeight] = useState("normal");
	const [fontStyle, setFontStyle] = useState("normal");
	const [textDecoration, setTextDecoration] = useState("none");
	const [error, setError] = useState("");

	const barcodeRef = useRef<SVGSVGElement>(null);

	const maxLength = formatLimits[barcodeType] || 50;
	const placeholder = `Example: ${formatExamples[barcodeType] || ""} (max ${maxLength} chars)`;

	const barcodeConfig = useMemo(
		() => ({
			format: barcodeType,
			width: barWidth,
			height: height,
			margin: margin,
			background: background,
			lineColor: lineColor,
			displayValue: showText,
			textAlign: textAlign,
			font: font,
			fontSize: fontSize,
			textMargin: textMargin,
			fontOptions: `${fontWeight} ${fontStyle}`,
		}),
		[
			barcodeType,
			barWidth,
			height,
			margin,
			background,
			lineColor,
			showText,
			textAlign,
			font,
			fontSize,
			textMargin,
			fontWeight,
			fontStyle,
		],
	);

	const generateBarcode = useCallback(() => {
		if (barcodeRef.current) {
			try {
				JsBarcode(barcodeRef.current, barcodeData, barcodeConfig);
				if (barcodeRef.current.querySelector("text")) {
					const textElement = barcodeRef.current.querySelector("text");
					textElement?.setAttribute("text-decoration", textDecoration);
				}
				setError("");
			} catch (err) {
				setError("Invalid barcode data for the selected type");
			}
		}
	}, [barcodeData, barcodeConfig, textDecoration]);

	useEffect(() => {
		generateBarcode();
	}, [generateBarcode]);

	const downloadBarcode = useCallback((format: string) => {
		if (barcodeRef.current) {
			const svgData = new XMLSerializer().serializeToString(barcodeRef.current);
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			const img = new Image();
			img.onload = () => {
				canvas.width = img.width;
				canvas.height = img.height;
				ctx?.drawImage(img, 0, 0);
				const dataURL = canvas.toDataURL(`image/${format}`);
				const link = document.createElement("a");
				link.download = `barcode.${format}`;
				link.href = dataURL;
				link.click();
			};
			img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
		}
	}, []);

	return (
		<div className="container mx-auto px-4 py-12 items-center justify-center flex">
			<div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:16px_16px]" />
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:flex-row-reverse">
					{/* Preview Section */}
					<div className="order-1 md:order-2 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg content-center shadow-md">
						<div className="flex flex-col p-4 items-center justify-center rounded-lg shadow-md">
							<svg ref={barcodeRef} className="rounded-lg">
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
					<div className="order-2 md:order-1 space-y-6 bg-white/50 dark:bg-black/50 backdrop-blur-sm p-8 rounded-lg shadow-md">
						{/* Barcode Data Input with Placeholder and Info */}
						<div className="space-y-4">
							<Label htmlFor="barcodeData">Barcode Data</Label>
							<Popover>
								<PopoverTrigger asChild>
									<div className="flex items-center">
										<Input
											id="barcodeData"
											value={barcodeData}
											onChange={(e) => setBarcodeData(e.target.value)}
											placeholder={placeholder}
											maxLength={maxLength}
										/>
										<Info className="ml-2 h-4 w-4 text-gray-500" />
									</div>
								</PopoverTrigger>
								<PopoverContent>
									<p>
										Enter up to {maxLength} characters for {barcodeType}.
									</p>
								</PopoverContent>
							</Popover>
						</div>

						{/* Barcode Type Selection */}
						<div className="space-y-4">
							<Label htmlFor="barcodeType">Barcode Type</Label>
							<Select
								value={barcodeType}
								onValueChange={(value) => {
									setBarcodeType(value);
									setBarcodeData(formatExamples[value] || "");
								}}
							>
								<SelectTrigger id="barcodeType">
									<SelectValue placeholder="Select barcode type" />
								</SelectTrigger>
								<SelectContent>
									{barcodeTypes.map((type) => (
										<SelectItem key={type} value={type}>
											{type}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Bar Width Slider */}
						<div className="space-y-4">
							<Label htmlFor="barWidth">Bar Width ({barWidth}px)</Label>
							<Slider
								value={[barWidth]}
								min={1}
								max={10}
								step={1}
								onValueChange={([value]) => setBarWidth(value)}
							/>
						</div>

						{/* Height Slider */}
						<div className="space-y-4">
							<Label htmlFor="height">Height ({height}px)</Label>
							<Slider
								value={[height]}
								min={50}
								max={500}
								step={10}
								onValueChange={([value]) => setHeight(value)}
							/>
						</div>

						{/* Margin Slider */}
						<div className="space-y-4">
							<Label htmlFor="margin">Margin ({margin}px)</Label>
							<Slider
								value={[margin]}
								min={0}
								max={50}
								step={5}
								onValueChange={([value]) => setMargin(value)}
							/>
						</div>

						{/* Background Color Picker */}
						<div className="space-y-4">
							<Label htmlFor="background">Background Color</Label>
							<Input
								id="background"
								type="color"
								value={background}
								onChange={(e) => setBackground(e.target.value)}
							/>
						</div>

						{/* Line Color Picker */}
						<div className="space-y-4">
							<Label htmlFor="lineColor">Line Color</Label>
							<Input
								id="lineColor"
								type="color"
								value={lineColor}
								onChange={(e) => setLineColor(e.target.value)}
							/>
						</div>

						{/* Show Text Toggle */}
						<div className="flex items-center space-x-2">
							<Switch
								id="showText"
								checked={showText}
								onCheckedChange={setShowText}
							/>
							<Label htmlFor="showText">Show Text</Label>
						</div>

						{/* Collapsible Text Options */}
						{showText && (
							<div className="space-y-4">
								<Label>Text Settings</Label>
								<Tabs defaultValue="alignment" className="w-full">
									<TabsList className="grid w-full grid-cols-4">
										<TabsTrigger value="style">Style</TabsTrigger>
										<TabsTrigger value="alignment">Alignment</TabsTrigger>
										<TabsTrigger value="size">Size</TabsTrigger>
										<TabsTrigger value="font">Font</TabsTrigger>
									</TabsList>

									{/* Font Style Tab */}
									<TabsContent value="style" className="mt-4">
										<div className="flex flex-wrap gap-2">
											<Button
												variant={fontWeight === "bold" ? "default" : "outline"}
												onClick={() =>
													setFontWeight(
														fontWeight === "bold" ? "normal" : "bold",
													)
												}
												className="flex-1"
											>
												<Bold className="h-4 w-4 mr-2" />
												Bold
											</Button>
											<Button
												variant={fontStyle === "italic" ? "default" : "outline"}
												onClick={() =>
													setFontStyle(
														fontStyle === "italic" ? "normal" : "italic",
													)
												}
												className="flex-1"
											>
												<Italic className="h-4 w-4 mr-2" />
												Italic
											</Button>
											<Button
												variant={
													textDecoration === "underline" ? "default" : "outline"
												}
												onClick={() =>
													setTextDecoration(
														textDecoration === "underline"
															? "none"
															: "underline",
													)
												}
												className="flex-1"
											>
												<Underline className="h-4 w-4 mr-2" />
												Underline
											</Button>
										</div>
									</TabsContent>

									{/* Text Alignment Tab */}
									<TabsContent value="alignment" className="mt-4">
										<div className="grid grid-cols-3 gap-2">
											<Button
												variant={textAlign === "left" ? "default" : "outline"}
												onClick={() => setTextAlign("left")}
												className="w-full"
											>
												<AlignLeft className="h-4 w-4 mr-2" />
												Left
											</Button>
											<Button
												variant={textAlign === "center" ? "default" : "outline"}
												onClick={() => setTextAlign("center")}
												className="w-full"
											>
												<AlignCenter className="h-4 w-4 mr-2" />
												Center
											</Button>
											<Button
												variant={textAlign === "right" ? "default" : "outline"}
												onClick={() => setTextAlign("right")}
												className="w-full"
											>
												<AlignRight className="h-4 w-4 mr-2" />
												Right
											</Button>
										</div>
										<div className="mt-4 space-y-4">
											<Label htmlFor="textMargin">
												Text Margin ({textMargin}px)
											</Label>
											<Slider
												value={[textMargin]}
												min={0}
												max={20}
												step={1}
												onValueChange={([value]) => setTextMargin(value)}
											/>
										</div>
									</TabsContent>

									{/* Font Size Tab */}
									<TabsContent value="size" className="mt-4 space-y-4">
										<div className="flex items-center justify-between">
											<span className="text-sm font-medium">
												Font Size: {fontSize}px
											</span>
										</div>
										<Slider
											value={[fontSize]}
											min={10}
											max={50}
											step={2}
											onValueChange={([value]) => setFontSize(value)}
											className="mt-2"
										/>
										<div className="grid grid-cols-3 gap-2">
											<Button
												variant="outline"
												onClick={() => setFontSize(14)}
												className={fontSize === 14 ? "bg-accent" : ""}
											>
												Small
											</Button>
											<Button
												variant="outline"
												onClick={() => setFontSize(20)}
												className={fontSize === 20 ? "bg-accent" : ""}
											>
												Medium
											</Button>
											<Button
												variant="outline"
												onClick={() => setFontSize(28)}
												className={fontSize === 28 ? "bg-accent" : ""}
											>
												Large
											</Button>
										</div>
									</TabsContent>

									<TabsContent value="font" className="mt-4">
										<div className="flex flex-wrap gap-2">
											{fontOptions.map((fontFamily) => (
												<Button
													key={fontFamily}
													variant={font === fontFamily ? "default" : "outline"}
													onClick={() => setFont(fontFamily)}
													className="flex-1"
													style={{ fontFamily }}
												>
													{fontFamily}
												</Button>
											))}
										</div>
									</TabsContent>
								</Tabs>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
