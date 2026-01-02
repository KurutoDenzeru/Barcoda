"use client";

import * as React from "react";
import JsBarcode from "jsbarcode";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarcodeSettings,
  BARCODE_FORMATS,
  FONT_OPTIONS,
  defaultBarcodeSettings,
  BarcodeFormat,
  ExportFormat,
} from "./types";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  Share2,
  Copy,
  ChevronDown,
  Info,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type ValidationTone = "info" | "error";

const FORMAT_TIPS: Record<BarcodeFormat, string> = {
  CODE128: "Flexible: letters, numbers, and symbols all work (e.g., HELLO-128).",
  CODE128A: "Uppercase letters, numbers, and control characters work well (e.g., ABC123).",
  CODE128C: "Digits only in even counts; great for numeric IDs (e.g., 12345678).",
  EAN13: "Use 12 digits; we append the checksum for you (13th digit optional).",
  EAN8: "Use 7 digits; checksum is auto-calculated (8th digit optional).",
  UPC: "Use 11 digits; we add the checksum to make 12 (12th optional if you have it).",
  CODE39: "Uppercase A-Z, 0-9, spaces, and - . $ / + % are allowed.",
  ITF14: "Use 13 digits; checksum produces 14 digits total (e.g., 1234567890123).",
  ITF: "Numeric only with an even number of digits (e.g., 123456).",
  MSI: "Numeric only; checksums are handled automatically (e.g., 123456).",
  MSI10: "Numeric only; single checksum is added for you (e.g., 123456).",
  MSI11: "Numeric only; single checksum is added for you (e.g., 123456).",
  MSI1010: "Numeric only; double checksum is added automatically.",
  MSI1110: "Numeric only; double checksum is added automatically.",
  pharmacode: "Numeric only for pharma codes (e.g., 1234).",
  codabar: "Start/end with A-D; digits and - $ : / . + are allowed in the middle.",
};

const DIGITS_ONLY = /^\d+$/;
const CODE39_ALLOWED = /^[0-9A-Z \-.$/+%]*$/;
const CODABAR_ALLOWED = /^[A-D][0-9\-$/:\.+]*[A-D]?$/i;

const validateBarcodeValue = (
  format: BarcodeFormat,
  value: string
): { variant: ValidationTone; message: string } => {
  const trimmed = value.trim();
  const normalized = trimmed.toUpperCase();

  if (!trimmed) {
    return { variant: "info", message: "Add a value to preview the barcode." };
  }

  switch (format) {
    case "EAN13": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "EAN-13 accepts digits only - remove spaces or letters." };
      }
      if (trimmed.length < 12) {
        return {
          variant: "error",
          message: `EAN-13 needs 12 digits, we auto-calc the checksum. Add ${12 - trimmed.length} more.`,
        };
      }
      if (trimmed.length === 12) {
        return { variant: "info", message: "Great: 12 digits set; we will append the checksum digit." };
      }
      if (trimmed.length === 13) {
        return { variant: "info", message: "Using your supplied checksum (13 digits total)." };
      }
      return { variant: "error", message: "EAN-13 must be 12 base digits (13 with checksum)." };
    }
    case "EAN8": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "EAN-8 accepts digits only." };
      }
      if (trimmed.length < 7) {
        return {
          variant: "error",
          message: `EAN-8 needs 7 digits, we auto-calc the checksum. Add ${7 - trimmed.length} more.`,
        };
      }
      if (trimmed.length === 7) {
        return { variant: "info", message: "7 digits ready; we will add the checksum digit." };
      }
      if (trimmed.length === 8) {
        return { variant: "info", message: "Using your provided checksum (8 digits total)." };
      }
      return { variant: "error", message: "EAN-8 must be 7 base digits (8 with checksum)." };
    }
    case "UPC": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "UPC accepts digits only." };
      }
      if (trimmed.length < 11) {
        return {
          variant: "error",
          message: `UPC-A needs 11 digits, we add the 12th checksum. Add ${11 - trimmed.length} more.`,
        };
      }
      if (trimmed.length === 11) {
        return { variant: "info", message: "11 digits set; we will append the checksum to make 12." };
      }
      if (trimmed.length === 12) {
        return { variant: "info", message: "Using your provided checksum (12 digits total)." };
      }
      return { variant: "error", message: "UPC-A must be 11 base digits (12 with checksum)." };
    }
    case "CODE128C": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "CODE128C uses digits only." };
      }
      if (trimmed.length % 2 !== 0) {
        return { variant: "error", message: "CODE128C encodes digits in pairs - add one more digit." };
      }
      return { variant: "info", message: "Even number of digits detected - good for CODE128C." };
    }
    case "ITF": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "ITF is numeric only." };
      }
      if (trimmed.length % 2 !== 0) {
        return { variant: "error", message: "ITF needs an even number of digits for pairing." };
      }
      return { variant: "info", message: "Even-length numeric value ready for ITF." };
    }
    case "ITF14": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "ITF-14 accepts digits only." };
      }
      if (trimmed.length === 13) {
        return { variant: "info", message: "13 digits set; we will append the ITF-14 checksum." };
      }
      if (trimmed.length === 14) {
        return { variant: "info", message: "Using your provided checksum (14 digits total)." };
      }
      return { variant: "error", message: "ITF-14 needs 13 digits (or 14 if you include the checksum)." };
    }
    case "CODE39": {
      if (!CODE39_ALLOWED.test(normalized)) {
        return {
          variant: "error",
          message: "CODE39 allows A-Z, 0-9, spaces, and - . $ / + % characters only.",
        };
      }
      return { variant: "info", message: "Looks good for CODE39 characters." };
    }
    case "MSI":
    case "MSI10":
    case "MSI11":
    case "MSI1010":
    case "MSI1110": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "MSI variants are numeric only; we handle checksums automatically." };
      }
      return { variant: "info", message: "Numeric value set; MSI checksums will be added automatically." };
    }
    case "pharmacode": {
      if (!DIGITS_ONLY.test(trimmed)) {
        return { variant: "error", message: "Pharmacode accepts numeric values only." };
      }
      return { variant: "info", message: "Numeric pharmacode value ready to encode." };
    }
    case "codabar": {
      if (!CODABAR_ALLOWED.test(trimmed)) {
        return {
          variant: "error",
          message: "Codabar should start/end with A-D and use digits or - $ : / . + inside.",
        };
      }
      return { variant: "info", message: "Codabar start/stop and digits look valid." };
    }
    default:
      return { variant: "info", message: "This format accepts the current value." };
  }
};

export const BarcodeGenerator = () => {
  const [settings, setSettings] =
    React.useState<BarcodeSettings>(defaultBarcodeSettings);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const validation = React.useMemo(
    () => validateBarcodeValue(settings.format, settings.value),
    [settings.format, settings.value]
  );
  const formatTip = React.useMemo(() => FORMAT_TIPS[settings.format], [settings.format]);

  const updateSettings = <K extends keyof BarcodeSettings>(
    key: K,
    value: BarcodeSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const generateBarcode = React.useCallback(() => {
    if (!svgRef.current || !settings.value) return;
    if (validation.variant === "error") {
      svgRef.current.innerHTML = "";
      return;
    }

    try {
      const fontStyle = [
        settings.textStyle.bold ? "bold" : "",
        settings.textStyle.italic ? "italic" : "",
      ]
        .filter(Boolean)
        .join(" ");

      JsBarcode(svgRef.current, settings.value, {
        format: settings.format,
        width: settings.width,
        height: settings.height,
        margin: settings.margin,
        background: settings.backgroundColor,
        lineColor: settings.lineColor,
        displayValue: settings.showText,
        font: settings.font,
        fontSize: settings.textSize.fontSize,
        fontOptions: fontStyle || "",
        textAlign: settings.textAlignment.position,
        textMargin: settings.textAlignment.margin,
        valid: (valid) => { },
      });

      // Post-process SVG text elements to apply text styling
      if (svgRef.current) {
        const texts = svgRef.current.querySelectorAll("text");
        texts.forEach((t) => {
          // show/hide text
          t.style.display = settings.showText ? "" : "none";

          // ensure font and size match settings
          if (settings.font) t.style.fontFamily = settings.font;
          t.style.fontSize = `${settings.textSize.fontSize}px`;
          t.style.fontWeight = settings.textStyle.bold ? "bold" : "normal";
          t.style.fontStyle = settings.textStyle.italic ? "italic" : "normal";

          const decorations = [];
          if (settings.textStyle.underline) decorations.push("underline");
          if (settings.textStyle.strikethrough) decorations.push("line-through");
          t.style.textDecoration = decorations.length ? decorations.join(" ") : "none";

          // ensure alignment
          const pos = settings.textAlignment.position;
          if (pos === "left") t.setAttribute("text-anchor", "start");
          else if (pos === "center") t.setAttribute("text-anchor", "middle");
          else t.setAttribute("text-anchor", "end");
        });
      }
    } catch (error) {
      // Error generating barcode - suppressed in production
      // Try with default CODE128 if current format fails
      try {
        JsBarcode(svgRef.current!, settings.value, {
          format: "CODE128",
        });
      } catch (fallbackError) {
        // Fallback generation failed - suppressed
      }
    }
  }, [settings, validation.variant]);

  React.useEffect(() => {
    generateBarcode();
  }, [generateBarcode]);

  const handlePresetChange = (preset: "small" | "medium" | "large") => {
    const sizes = { small: 14, medium: 20, large: 28 };
    updateSettings("textSize", { ...settings.textSize, preset, fontSize: sizes[preset] });
  };

  const getDefaultValueForFormat = (format: BarcodeFormat) => {
    switch (format) {
      case "CODE128":
      case "CODE128A":
        return "HELLO-128";
      case "CODE128C":
        return "12345678";
      case "EAN13":
        return "123456789012";
      case "EAN8":
        return "1234567";
      case "UPC":
        return "12345678901";
      case "CODE39":
        return "CODE39";
      case "ITF14":
        return "01234567890123";
      case "ITF":
        return "12345678";
      case "MSI":
      case "MSI10":
      case "MSI11":
      case "MSI1010":
      case "MSI1110":
        return "123456";
      case "pharmacode":
        return "1234";
      case "codabar":
        return "A1234B";
      default:
        return "123456";
    }
  };

  const handleFormatChange = (value: string | null) => {
    if (!value) return;
    const defaultVal = getDefaultValueForFormat(value as BarcodeFormat);
    updateSettings("format", value as BarcodeFormat);
    updateSettings("value", defaultVal);
  };

  const handleExport = async (format: ExportFormat) => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });

    if (format === "svg") {
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `barcode.svg`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Barcode downloaded as SVG!");
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);

      const mimeTypes: Record<string, string> = {
        png: "image/png",
        jpeg: "image/jpeg",
        webp: "image/webp",
      };

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `barcode.${format}`;
          link.click();
          URL.revokeObjectURL(blobUrl);
          toast.success(`Barcode downloaded as ${format.toUpperCase()}!`);
        },
        mimeTypes[format],
        0.95
      );
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handleShare = async () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });

    const img = new Image();
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const file = new File([blob], "barcode.png", { type: "image/png" });
        if (
          navigator.share &&
          (typeof navigator.canShare !== "function" || navigator.canShare({ files: [file] }))
        ) {
          try {
            await navigator.share({ files: [file], title: "Barcode" });
            toast.success("Shared successfully!");
          } catch (err) {
            if ((err as Error).name !== "AbortError") {
              toast.error("Sharing failed");
            }
          }
        } else {
          const blobUrl = URL.createObjectURL(blob);
          await navigator.clipboard.writeText(blobUrl);
          toast.success("Link copied to clipboard!");
        }
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    img.src = url;
  };

  const handleCopyToClipboard = async () => {
    if (!svgRef.current) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml" });

    const img = new Image();
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success("Copied to clipboard!");
        } catch {
          toast.error("Failed to copy to clipboard");
        }
        URL.revokeObjectURL(url);
      }, "image/png");
    };

    img.src = url;
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <div className="order-1 lg:order-2 flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border border-border/50 min-h-75">
        <div className="bg-white rounded-xl p-4 shadow-sm overflow-auto max-w-full">
          <svg ref={svgRef} />
        </div>
        <canvas ref={canvasRef} className="hidden" />

        {/* Export Actions */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <Download className="size-4" /> Export <ChevronDown className="size-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport("png")}>
                PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("jpeg")}>
                JPEG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("webp")}>
                WebP
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("svg")}>
                SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm">
                <Copy className="size-4" /> Copy <ChevronDown className="size-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleCopyToClipboard()}>
                Copy as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                await handleExport("svg");
              }}>
                Copy as SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="size-4" /> Share
          </Button>
        </div>
      </div>

      {/* Settings Section */}
      <div className="order-2 lg:order-1 space-y-6">
        {/* Basic Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Content
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="barcode-value">Value</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 p-0 text-muted-foreground"
                      aria-label="Value guidance"
                    >
                      <Info className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="start" className="max-w-sm text-left">
                    <p className="text-xs leading-relaxed">{formatTip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="barcode-value"
                value={settings.value}
                onChange={(e) => updateSettings("value", e.target.value)}
                placeholder="Enter barcode value..."
                aria-invalid={validation.variant === "error"}
                className={`mt-1.5 ${validation.variant === "error" ? "border-destructive focus-visible:ring-destructive/20" : ""}`}
              />
              {validation.message && (
                <p
                  className={`text-xs mt-1 ${validation.variant === "error" ? "text-destructive" : "text-muted-foreground"
                    }`}
                >
                  {validation.message}
                </p>
              )}
            </div>
            <div>
              <Label>Format</Label>
              <Select
                value={settings.format}
                onValueChange={(v) => handleFormatChange(v)}
              >
                <SelectTrigger className="mt-1.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BARCODE_FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Size & Layout */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Size & Layout
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bar Width: {settings.width}</Label>
              <Slider
                value={[settings.width]}
                onValueChange={(values) => {
                  const v = Array.isArray(values) ? values[0] : values;
                  updateSettings("width", v);
                }}
                min={1}
                max={5}
                step={0.5}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Height: {settings.height}px</Label>
              <Slider
                value={[settings.height]}
                onValueChange={(values) => {
                  const v = Array.isArray(values) ? values[0] : values;
                  updateSettings("height", v);
                }}
                min={30}
                max={200}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="col-span-2">
              <Label>Margin: {settings.margin}px</Label>
              <Slider
                value={[settings.margin]}
                onValueChange={(values) => {
                  const v = Array.isArray(values) ? values[0] : values;
                  updateSettings("margin", v);
                }}
                min={0}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Colors
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Background</Label>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => updateSettings("backgroundColor", e.target.value)}
                  className="w-10 h-8 rounded-md border cursor-pointer"
                />
                <Input
                  value={settings.backgroundColor}
                  onChange={(e) => updateSettings("backgroundColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
            <div>
              <Label>Line Color</Label>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="color"
                  value={settings.lineColor}
                  onChange={(e) => updateSettings("lineColor", e.target.value)}
                  className="w-10 h-8 rounded-md border cursor-pointer"
                />
                <Input
                  value={settings.lineColor}
                  onChange={(e) => updateSettings("lineColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Text Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Text Options
            </h3>
            <Switch
              checked={settings.showText}
              onCheckedChange={(checked) => updateSettings("showText", checked)}
            />
          </div>

          {settings.showText && (
            <div className="space-y-6 mt-4">
              {/* Style and Alignment in one row with labels and justify-between */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Text Style</Label>
                    <div className="flex gap-1">
                      <Button
                        variant={settings.textStyle.bold ? "default" : "outline"}
                        size="icon"
                        onClick={() =>
                          updateSettings("textStyle", {
                            ...settings.textStyle,
                            bold: !settings.textStyle.bold,
                          })
                        }
                        aria-label="Bold"
                      >
                        <Bold className="size-4" />
                      </Button>
                      <Button
                        variant={settings.textStyle.italic ? "default" : "outline"}
                        size="icon"
                        onClick={() =>
                          updateSettings("textStyle", {
                            ...settings.textStyle,
                            italic: !settings.textStyle.italic,
                          })
                        }
                        aria-label="Italic"
                      >
                        <Italic className="size-4" />
                      </Button>
                      <Button
                        variant={settings.textStyle.underline ? "default" : "outline"}
                        size="icon"
                        onClick={() =>
                          updateSettings("textStyle", {
                            ...settings.textStyle,
                            underline: !settings.textStyle.underline,
                          })
                        }
                        aria-label="Underline"
                      >
                        <Underline className="size-4" />
                      </Button>
                      <Button
                        variant={settings.textStyle.strikethrough ? "default" : "outline"}
                        size="icon"
                        onClick={() =>
                          updateSettings("textStyle", {
                            ...settings.textStyle,
                            strikethrough: !settings.textStyle.strikethrough,
                          })
                        }
                        aria-label="Strikethrough"
                      >
                        <Strikethrough className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Text Alignment</Label>
                    <div className="flex gap-1">
                      <Button
                        variant={settings.textAlignment.position === "left" ? "default" : "outline"}
                        size="icon"
                        onClick={() =>
                          updateSettings("textAlignment", { ...settings.textAlignment, position: "left" })
                        }
                        aria-label="Align Left"
                      >
                        <AlignLeft className="size-4" />
                      </Button>
                      <Button
                        variant={settings.textAlignment.position === "center" ? "default" : "outline"}
                        size="icon"
                        onClick={() =>
                          updateSettings("textAlignment", { ...settings.textAlignment, position: "center" })
                        }
                        aria-label="Align Center"
                      >
                        <AlignCenter className="size-4" />
                      </Button>
                      <Button
                        variant={settings.textAlignment.position === "right" ? "default" : "outline"}
                        size="icon"
                        onClick={() =>
                          updateSettings("textAlignment", { ...settings.textAlignment, position: "right" })
                        }
                        aria-label="Align Right"
                      >
                        <AlignRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Font Family with ScrollArea */}
              <div className="space-y-2">
                <Label>Font Family</Label>
                <ScrollArea className="h-40 rounded-md border p-2">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {FONT_OPTIONS.map((font) => (
                      <Button
                        key={font}
                        variant={settings.font === font ? "chipActive" : "chip"}
                        size="sm"
                        onClick={() => updateSettings("font", font)}
                        className="justify-start text-sm px-3"
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Size Presets and Sliders */}
              <div className="space-y-3">
                <div>
                  <Label className="mb-2 block">Text Size</Label>
                  <div className="flex gap-2">
                    {(["small", "medium", "large"] as const).map((preset) => (
                      <Button
                        key={preset}
                        variant={settings.textSize.preset === preset ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePresetChange(preset)}
                        className="flex-1 capitalize"
                      >
                        {preset}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Font Size: {settings.textSize.fontSize}px</Label>
                  <Slider
                    value={[settings.textSize.fontSize]}
                    onValueChange={(values) => {
                      const v = Array.isArray(values) ? values[0] : values;
                      updateSettings("textSize", { ...settings.textSize, fontSize: v, preset: "medium" });
                    }}
                    min={8}
                    max={48}
                    step={1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Text Margin: {settings.textAlignment.margin}px</Label>
                  <Slider
                    value={[settings.textAlignment.margin]}
                    onValueChange={(values) => {
                      const v = Array.isArray(values) ? values[0] : values;
                      updateSettings("textAlignment", { ...settings.textAlignment, margin: v });
                    }}
                    min={0}
                    max={20}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
