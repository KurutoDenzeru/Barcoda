"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
	Info,
	Bold,
	Italic,
	Underline,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from "lucide-react";
import {
	barcodeTypes,
	fontOptions,
	formatExamples,
	formatLimits,
} from "./constants/barcodeConstants";

interface BarcodeControlsProps {
	barcodeData: string;
	setBarcodeData: (value: string) => void;
	barcodeType: string;
	setBarcodeType: (value: string) => void;
	barWidth: number;
	setBarWidth: (value: number) => void;
	height: number;
	setHeight: (value: number) => void;
	margin: number;
	setMargin: (value: number) => void;
	background: string;
	setBackground: (value: string) => void;
	lineColor: string;
	setLineColor: (value: string) => void;
	showText: boolean;
	setShowText: (value: boolean) => void;
	textAlign: string;
	setTextAlign: (value: string) => void;
	font: string;
	setFont: (value: string) => void;
	fontSize: number;
	setFontSize: (value: number) => void;
	textMargin: number;
	setTextMargin: (value: number) => void;
	fontWeight: string;
	setFontWeight: (value: string) => void;
	fontStyle: string;
	setFontStyle: (value: string) => void;
	textDecoration: string;
	setTextDecoration: (value: string) => void;
}

export const BarcodeControls: React.FC<BarcodeControlsProps> = ({
	barcodeData,
	setBarcodeData,
	barcodeType,
	setBarcodeType,
	barWidth,
	setBarWidth,
	height,
	setHeight,
	margin,
	setMargin,
	background,
	setBackground,
	lineColor,
	setLineColor,
	showText,
	setShowText,
	textAlign,
	setTextAlign,
	font,
	setFont,
	fontSize,
	setFontSize,
	textMargin,
	setTextMargin,
	fontWeight,
	setFontWeight,
	fontStyle,
	setFontStyle,
	textDecoration,
	setTextDecoration,
}) => {
	const maxLength = formatLimits[barcodeType] || 50;
	const placeholder = `Example: ${formatExamples[barcodeType] || ""} (max ${maxLength} chars)`;

	return (
		<div className="order-2 md:order-1 space-y-6 bg-white/50 dark:bg-black/50 backdrop-blur-xs p-8 rounded-lg shadow-md">
			{/* Barcode Data Input with Placeholder and Info */}
			<div className="space-y-4">
				<Label htmlFor="barcodeData" className="font-medium">Barcode Data:</Label>
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
							<Tooltip>
								<TooltipTrigger asChild>
									<Info className="ml-2 h-4 w-4 text-gray-500 cursor-help" />
								</TooltipTrigger>
								<TooltipContent>
									Enter up to {maxLength} characters for {barcodeType}.
								</TooltipContent>
							</Tooltip>
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
				<Label htmlFor="barcodeType" className="font-medium">Barcode Type:</Label>
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

			{/* Bar Width, Height and Margin Slider */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="barWidth-slider" className="font-medium">Bar Width: ({barWidth}px)</Label>
					<Slider
						id="barWidth-slider"
						value={[barWidth]}
						aria-label={`Bar Width Slider, current value ${barWidth} pixels`}
						min={1}
						max={10}
						step={1}
						onValueChange={([value]) => setBarWidth(value)}
						className="touch-none mt-2"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="height-slider" className="font-medium">Height: ({height}px)</Label>
					<Slider
						id="height-slider"
						value={[height]}
						aria-label={`Height Slider, current value ${height} pixels`}
						min={50}
						max={500}
						step={10}
						onValueChange={([value]) => setHeight(value)}
						className="touch-none mt-1"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="margin-slider" className="font-medium">Margin: ({margin}px)</Label>
					<Slider
						id="margin-slider"
						value={[margin]}
						aria-label={`Margin Slider, current value ${margin} pixels`}
						min={0}
						max={50}
						step={5}
						onValueChange={([value]) => setMargin(value)}
						className="touch-none mt-1"
					/>
				</div>
			</div>

			{/* Background and Line Color Pickers Combined */}
			<div className="flex flex-col sm:flex-row gap-4">
				<div className="flex-1 space-y-2">
					<Label htmlFor="background" className="font-medium">Background Color:</Label>
					<Input
						id="background"
						type="color"
						value={background}
						onChange={(e) => setBackground(e.target.value)}
						className="w-full h-10 p-1"
					/>
				</div>
				<div className="flex-1 space-y-2">
					<Label htmlFor="lineColor" className="font-medium">Line Color:</Label>
					<Input
						id="lineColor"
						type="color"
						value={lineColor}
						onChange={(e) => setLineColor(e.target.value)}
						className="w-full h-10 p-1"
					/>
				</div>
			</div>

			{/* Show Text Toggle */}
			<fieldset
				className="flex items-center space-x-2"
				aria-labelledby="text-display-label"
			>
				<span id="text-display-label" className="sr-only">
					Text Display Options
				</span>
				<Switch
					id="showText"
					checked={showText}
					onCheckedChange={setShowText}
					aria-label="Toggle text display"
				/>
				<Label htmlFor="showText">Show Text</Label>
			</fieldset>
			{/* Collapsible Text Options */}
			{showText && (
				<div className="space-y-4">
					<Label className="font-medium">Text Settings:</Label>
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
										setFontWeight(fontWeight === "bold" ? "normal" : "bold")
									}
									className="flex-1"
								>
									<Bold className="h-4 w-4 mr-2" />
									Bold
								</Button>
								<Button
									variant={fontStyle === "italic" ? "default" : "outline"}
									onClick={() =>
										setFontStyle(fontStyle === "italic" ? "normal" : "italic")
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
											textDecoration === "underline" ? "none" : "underline",
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
								<Label htmlFor="text-margin-slider">
									Text Margin ({textMargin}px)
								</Label>
								<Slider
									id="text-margin-slider"
									value={[textMargin]}
									aria-label={`Text Margin Slider, current value ${textMargin} pixels`}
									min={0}
									max={20}
									step={1}
									onValueChange={([value]) => setTextMargin(value)}
									className="touch-none"
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
	);
};
