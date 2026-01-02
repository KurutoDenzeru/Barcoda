"use client";

import * as React from "react";
import QRCodeStyling from "qr-code-styling";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  QRSettings,
  QRDotType,
  QRCornerSquareType,
  QRCornerDotType,
  QRErrorCorrectionLevel,
  ERROR_CORRECTION_LEVELS,
  defaultQRSettings,
  ExportFormat,
} from "./types";
import { Download, Share2, Copy, ImageIcon, Link, ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const DOT_TYPES: { value: QRDotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy Rounded" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const CORNER_SQUARE_TYPES: { value: QRCornerSquareType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
  { value: "extra-rounded", label: "Extra Rounded" },
];

const CORNER_DOT_TYPES: { value: QRCornerDotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Dot" },
];

export const QRCodeGenerator = () => {
  const [settings, setSettings] = React.useState<QRSettings>(defaultQRSettings);
  const [imageInputType, setImageInputType] = React.useState<"file" | "url">("file");
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [showLogo, setShowLogo] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);
  const qrCodeRef = React.useRef<QRCodeStyling | null>(null);

  const updateSettings = <K extends keyof QRSettings>(
    key: K,
    value: QRSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  React.useEffect(() => {
    qrCodeRef.current = new QRCodeStyling({
      width: settings.width,
      height: settings.height,
      margin: settings.margin,
      data: settings.value || "https://example.com",
      image: settings.imageUrl || undefined,
      dotsOptions: {
        color: settings.dotsColor,
        type: settings.dotType,
      },
      backgroundOptions: {
        color: settings.backgroundColor,
      },
      cornersSquareOptions: {
        color: settings.cornerSquareColor,
        type: settings.cornerSquareType,
      },
      cornersDotOptions: {
        color: settings.cornerDotColor,
        type: settings.cornerDotType,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: settings.imageMargin,
      },
      qrOptions: {
        errorCorrectionLevel: settings.errorCorrectionLevel,
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCodeRef.current.append(qrRef.current);
    }
  }, [settings]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSettings("imageUrl", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        updateSettings("imageUrl", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = async (format: ExportFormat) => {
    if (!qrCodeRef.current) return;

    try {
      if (format === "svg") {
        const svgBlob = await qrCodeRef.current.getRawData("svg");
        if (!svgBlob) return;
        const url = URL.createObjectURL(svgBlob as Blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qrcode.svg`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        await qrCodeRef.current.download({
          name: "qrcode",
          extension: format as "png" | "jpeg" | "webp",
        });
      }
      toast.success(`QR Code downloaded as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export QR code");
    }
  };

  const handleShare = async () => {
    if (!qrCodeRef.current) return;

    try {
      const blob = await qrCodeRef.current.getRawData("png");
      if (!blob) return;

      if (navigator.share && navigator.canShare?.({ files: [] })) {
        const file = new File([blob as Blob], "qrcode.png", { type: "image/png" });
        await navigator.share({
          files: [file],
          title: "QR Code",
        });
        toast.success("Shared successfully!");
      } else {
        const url = URL.createObjectURL(blob as Blob);
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        toast.error("Sharing failed");
      }
    }
  };

  const handleCopyToClipboard = async () => {
    if (!qrCodeRef.current) return;

    try {
      const blob = await qrCodeRef.current.getRawData("png");
      if (!blob) return;

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob as Blob }),
      ]);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview Section */}
      <div className="order-1 lg:order-2 flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border border-border/50 min-h-75">
        <div
          className="bg-white rounded-xl p-4 shadow-sm overflow-auto max-w-full w-full max-w-lg"
          style={{ borderRadius: `${settings.borderRadius}px` }}
        >
          <div ref={qrRef} />
        </div>

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
                const blob = await qrCodeRef.current?.getRawData("svg");
                if (blob) {
                  await navigator.clipboard.write([
                    new ClipboardItem({ "image/svg+xml": blob as Blob }),
                  ]);
                  toast.success("Copied as SVG!");
                }
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
      <div className="order-2 lg:order-1">
        <ScrollArea className="h-[calc(100vh-200px)] pr-4">
          <div className="space-y-6">
            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Content
              </h3>
              <div>
                <Label htmlFor="qr-value">Value / URL</Label>
                <Input
                  id="qr-value"
                  value={settings.value}
                  onChange={(e) => updateSettings("value", e.target.value)}
                  placeholder="Enter URL or text..."
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Size & Layout */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Size & Layout
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Width: {settings.width}px</Label>
                  <Slider
                    value={[settings.width]}
                    onValueChange={(values) => {
                      const v = Array.isArray(values) ? values[0] : values;
                      updateSettings("width", v);
                    }}
                    min={100}
                    max={500}
                    step={10}
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
                    min={100}
                    max={500}
                    step={10}
                    className="mt-2"
                  />
                </div>
                <div>
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
                <div>
                  <Label>Border Radius: {settings.borderRadius}px</Label>
                  <Slider
                    value={[settings.borderRadius]}
                    onValueChange={(values) => {
                      const v = Array.isArray(values) ? values[0] : values;
                      updateSettings("borderRadius", v);
                    }}
                    min={0}
                    max={50}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Logo / Image */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Logo
                </h3>
                <Switch
                  checked={showLogo}
                  onCheckedChange={(checked) => {
                    setShowLogo(checked);
                    if (!checked) {
                      updateSettings("imageUrl", "");
                    }
                  }}
                />
              </div>

              {showLogo && (
                <div className="space-y-3">
                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center justify-center text-center gap-2">
                      <ImageIcon className="size-8 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Drop image here or click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG up to 10MB</p>
                      </div>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-2">
                    <Label htmlFor="logo-url" className="text-xs text-muted-foreground">Or enter image URL</Label>
                    <Input
                      id="logo-url"
                      value={settings.imageUrl}
                      onChange={(e) => updateSettings("imageUrl", e.target.value)}
                      placeholder="https://example.com/logo.png"
                      className="text-sm"
                    />
                  </div>

                  {settings.imageUrl && (
                    <>
                      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                        <img
                          src={settings.imageUrl}
                          alt="Logo preview"
                          className="size-10 object-contain rounded"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateSettings("imageUrl", "")}
                          className="text-destructive ml-auto"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div>
                        <Label>Logo Margin: {settings.imageMargin}px</Label>
                        <Slider
                          value={[settings.imageMargin]}
                          onValueChange={(values) => {
                            const v = Array.isArray(values) ? values[0] : values;
                            updateSettings("imageMargin", v);
                          }}
                          min={0}
                          max={30}
                          step={1}
                          className="mt-2"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
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
                  <Label>Dots Color</Label>
                  <div className="flex gap-2 mt-1.5">
                    <input
                      type="color"
                      value={settings.dotsColor}
                      onChange={(e) => updateSettings("dotsColor", e.target.value)}
                      className="w-10 h-8 rounded-md border cursor-pointer"
                    />
                    <Input
                      value={settings.dotsColor}
                      onChange={(e) => updateSettings("dotsColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Corner Square</Label>
                  <div className="flex gap-2 mt-1.5">
                    <input
                      type="color"
                      value={settings.cornerSquareColor}
                      onChange={(e) => updateSettings("cornerSquareColor", e.target.value)}
                      className="w-10 h-8 rounded-md border cursor-pointer"
                    />
                    <Input
                      value={settings.cornerSquareColor}
                      onChange={(e) => updateSettings("cornerSquareColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Corner Dots</Label>
                  <div className="flex gap-2 mt-1.5">
                    <input
                      type="color"
                      value={settings.cornerDotColor}
                      onChange={(e) => updateSettings("cornerDotColor", e.target.value)}
                      className="w-10 h-8 rounded-md border cursor-pointer"
                    />
                    <Input
                      value={settings.cornerDotColor}
                      onChange={(e) => updateSettings("cornerDotColor", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full justify-start px-0"
              >
                <ChevronRight className={`size-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider ml-2">
                  Advanced Settings
                </span>
              </Button>
              
              {showAdvanced && (
                <div className="space-y-6 animate-in slide-in-from-top-2">
                  {/* Dot Styles */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Dot Style
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {DOT_TYPES.map((type) => (
                        <Button
                          key={type.value}
                          variant={settings.dotType === type.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSettings("dotType", type.value)}
                          className="text-xs"
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Corner Square Type */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Corner Square Type
                    </h3>
                    <div className="flex gap-2">
                      {CORNER_SQUARE_TYPES.map((type) => (
                        <Button
                          key={type.value}
                          variant={settings.cornerSquareType === type.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSettings("cornerSquareType", type.value)}
                          className="flex-1"
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Corner Dot Type */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Corner Dot Type
                    </h3>
                    <div className="flex gap-2">
                      {CORNER_DOT_TYPES.map((type) => (
                        <Button
                          key={type.value}
                          variant={settings.cornerDotType === type.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSettings("cornerDotType", type.value)}
                          className="flex-1"
                        >
                          {type.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Error Correction Level
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {ERROR_CORRECTION_LEVELS.map((level) => (
                        <Button
                          key={level.value}
                          variant={settings.errorCorrectionLevel === level.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSettings("errorCorrectionLevel", level.value as QRErrorCorrectionLevel)}
                          className="flex flex-col h-auto py-2"
                        >
                          <span className="font-medium">{level.label}</span>
                          <span className="text-xs opacity-70">{level.percentage}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
