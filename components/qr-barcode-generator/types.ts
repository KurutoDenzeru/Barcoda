// Barcode Types
export type BarcodeFormat =
  | "CODE128"
  | "CODE128A"
  | "CODE128C"
  | "EAN13"
  | "EAN8"
  | "UPC"
  | "CODE39"
  | "ITF14"
  | "ITF"
  | "MSI"
  | "MSI10"
  | "MSI11"
  | "MSI1010"
  | "MSI1110"
  | "pharmacode"
  | "codabar";

export interface BarcodeTextStyle {
  bold: boolean;
  italic: boolean;
}

export interface BarcodeTextAlignment {
  position: "left" | "center" | "right";
  margin: number;
}

export interface BarcodeTextSize {
  fontSize: number;
  preset: "small" | "medium" | "large";
}

export interface BarcodeSettings {
  format: BarcodeFormat;
  value: string;
  width: number;
  height: number;
  margin: number;
  backgroundColor: string;
  lineColor: string;
  showText: boolean;
  textStyle: BarcodeTextStyle;
  textAlignment: BarcodeTextAlignment;
  textSize: BarcodeTextSize;
  font: string;
}

// QR Code Types
export type QRDotType =
  | "dots"
  | "rounded"
  | "classy"
  | "classy-rounded"
  | "square"
  | "extra-rounded";

export type QRCornerSquareType = "dot" | "square" | "extra-rounded";

export type QRCornerDotType = "dot" | "square";

export type QRErrorCorrectionLevel = "L" | "M" | "Q" | "H";

export interface QRSettings {
  value: string;
  width: number;
  height: number;
  margin: number;
  backgroundColor: string;
  dotsColor: string;
  cornerSquareColor: string;
  cornerDotColor: string;
  dotType: QRDotType;
  cornerSquareType: QRCornerSquareType;
  cornerDotType: QRCornerDotType;
  errorCorrectionLevel: QRErrorCorrectionLevel;
  imageUrl: string;
  imageMargin: number;
  borderRadius: number;
}

// Export Types
export type ExportFormat = "png" | "jpeg" | "webp" | "svg";

// Default values
export const defaultBarcodeSettings: BarcodeSettings = {
  format: "CODE128",
  value: "Hello World",
  width: 2,
  height: 100,
  margin: 10,
  backgroundColor: "#ffffff",
  lineColor: "#000000",
  showText: true,
  textStyle: {
    bold: false,
    italic: false,
  },
  textAlignment: {
    position: "center",
    margin: 2,
  },
  textSize: {
    fontSize: 20,
    preset: "medium",
  },
  font: "monospace",
};

export const defaultQRSettings: QRSettings = {
  value: "https://example.com",
  width: 300,
  height: 300,
  margin: 10,
  backgroundColor: "#ffffff",
  dotsColor: "#000000",
  cornerSquareColor: "#000000",
  cornerDotColor: "#000000",
  dotType: "square",
  cornerSquareType: "square",
  cornerDotType: "square",
  errorCorrectionLevel: "M",
  imageUrl: "",
  imageMargin: 5,
  borderRadius: 0,
};

export const BARCODE_FORMATS: { value: BarcodeFormat; label: string }[] = [
  { value: "CODE128", label: "CODE128" },
  { value: "CODE128A", label: "CODE128A" },
  { value: "CODE128C", label: "CODE128C" },
  { value: "EAN13", label: "EAN13" },
  { value: "EAN8", label: "EAN8" },
  { value: "UPC", label: "UPC" },
  { value: "CODE39", label: "CODE39" },
  { value: "ITF14", label: "ITF14" },
  { value: "ITF", label: "ITF" },
  { value: "MSI", label: "MSI" },
  { value: "MSI10", label: "MSI10" },
  { value: "MSI11", label: "MSI11" },
  { value: "MSI1010", label: "MSI1010" },
  { value: "MSI1110", label: "MSI1110" },
  { value: "pharmacode", label: "Pharmacode" },
  { value: "codabar", label: "Codabar" },
];

export const FONT_OPTIONS = [
  "monospace",
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Trebuchet MS",
  "Impact",
  "Comic Sans MS",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Inter",
  "Outfit",
];

export const ERROR_CORRECTION_LEVELS: {
  value: QRErrorCorrectionLevel;
  label: string;
  percentage: string;
}[] = [
  { value: "L", label: "Low", percentage: "~7%" },
  { value: "M", label: "Medium", percentage: "~15%" },
  { value: "Q", label: "Quartile", percentage: "~25%" },
  { value: "H", label: "High (Recommended)", percentage: "~30%" },
];
