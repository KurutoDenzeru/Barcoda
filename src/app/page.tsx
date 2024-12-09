"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { BarcodePreview } from "../components/BarcodePreview";
import { BarcodeControls } from "../components/BarcodeControls";
import { generateBarcode } from "../components/utils/barcodeUtils";

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

	const barcodeElement = useRef<SVGSVGElement>(null);

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

	useEffect(() => {
		if (barcodeElement.current) {
			const errorMessage = generateBarcode(
				barcodeElement.current,
				barcodeData,
				barcodeConfig,
				textDecoration,
			);
			setError(errorMessage);
		}
	}, [barcodeData, barcodeConfig, textDecoration]);

	return (
		<div className="container mx-auto px-4 py-12 items-center justify-center flex">
			<div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-900 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#2a2a2a_1px,transparent_1px)] [background-size:16px_16px]" />
			<div className="container mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:flex-row-reverse">
					<BarcodePreview barcodeElement={barcodeElement} error={error} />
					<BarcodeControls
						barcodeData={barcodeData}
						setBarcodeData={setBarcodeData}
						barcodeType={barcodeType}
						setBarcodeType={setBarcodeType}
						barWidth={barWidth}
						setBarWidth={setBarWidth}
						height={height}
						setHeight={setHeight}
						margin={margin}
						setMargin={setMargin}
						background={background}
						setBackground={setBackground}
						lineColor={lineColor}
						setLineColor={setLineColor}
						showText={showText}
						setShowText={setShowText}
						textAlign={textAlign}
						setTextAlign={setTextAlign}
						font={font}
						setFont={setFont}
						fontSize={fontSize}
						setFontSize={setFontSize}
						textMargin={textMargin}
						setTextMargin={setTextMargin}
						fontWeight={fontWeight}
						setFontWeight={setFontWeight}
						fontStyle={fontStyle}
						setFontStyle={setFontStyle}
						textDecoration={textDecoration}
						setTextDecoration={setTextDecoration}
					/>
				</div>
			</div>
		</div>
	);
}
