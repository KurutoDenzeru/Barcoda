"use client";

import * as React from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Camera,
  Upload,
  StopCircle,
  Copy,
  ExternalLink,
  X,
  ScanLine,
  ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ScanResult {
  text: string;
  format: string;
  timestamp: Date;
}

export const CodeScanner = () => {
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanResult, setScanResult] = React.useState<ScanResult | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleStartCamera = async () => {
    setError(null);
    setScanResult(null);

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.CODABAR,
          ],
          verbose: false,
        });
      }

      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText, result) => {
          handleScanSuccess(decodedText, result.result.format?.formatName || "Unknown");
        },
        () => {}
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera. Please ensure camera permissions are granted.");
      toast.error("Camera access denied");
    }
  };

  const handleStopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping camera:", err);
      }
    }
  };

  const handleScanSuccess = (text: string, format: string) => {
    setScanResult({
      text,
      format,
      timestamp: new Date(),
    });
    handleStopCamera();
    toast.success("Code scanned successfully!");
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    setScanResult(null);

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      toast.error("Invalid file type");
      return;
    }

    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader-hidden", {
          formatsToSupport: [
            Html5QrcodeSupportedFormats.QR_CODE,
            Html5QrcodeSupportedFormats.CODE_128,
            Html5QrcodeSupportedFormats.CODE_39,
            Html5QrcodeSupportedFormats.EAN_13,
            Html5QrcodeSupportedFormats.EAN_8,
            Html5QrcodeSupportedFormats.UPC_A,
            Html5QrcodeSupportedFormats.UPC_E,
            Html5QrcodeSupportedFormats.ITF,
            Html5QrcodeSupportedFormats.CODABAR,
          ],
          verbose: false,
        });
      }

      const result = await scannerRef.current.scanFile(file, true);
      handleScanSuccess(result, "Image Scan");
    } catch (err) {
      console.error("File scan error:", err);
      setError("No barcode or QR code found in the image");
      toast.error("No code found in image");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleCopyResult = async () => {
    if (scanResult) {
      await navigator.clipboard.writeText(scanResult.text);
      toast.success("Copied to clipboard!");
    }
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const handleOpenUrl = () => {
    if (scanResult && isUrl(scanResult.text)) {
      window.open(scanResult.text, "_blank", "noopener,noreferrer");
    }
  };

  const handleClearResult = () => {
    setScanResult(null);
    setError(null);
  };

  React.useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  return (
    <div className="space-y-6">
      {/* Scanner Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camera/Upload Section */}
        <div className="space-y-4">
          <div className="flex gap-2">
            {!isScanning ? (
              <Button onClick={handleStartCamera} className="flex-1">
                <Camera className="size-4" />
                Open Camera
              </Button>
            ) : (
              <Button onClick={handleStopCamera} variant="destructive" className="flex-1">
                <StopCircle className="size-4" />
                Stop Camera
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
            >
              <Upload className="size-4" />
              Upload
            </Button>
          </div>

          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
            className="hidden"
          />

          {/* Scanner Preview */}
          <div
            className={cn(
              "relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden bg-muted/30 min-h-[300px]",
              isDragging && "border-primary bg-primary/5",
              isScanning && "border-primary"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div id="qr-reader" className={cn("w-full", !isScanning && "hidden")} />
            <div id="qr-reader-hidden" className="hidden" />

            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <ScanLine className="size-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Scan a Code</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Use your camera to scan or drag & drop an image
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ImageIcon className="size-4" />
                  <span>Supports QR codes, barcodes (CODE128, EAN, UPC, etc.)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Section */}
        <div className="space-y-4">
          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Scan Result
          </Label>

          {error && (
            <Card className="p-4 border-destructive/50 bg-destructive/5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <X className="size-5 text-destructive" />
                </div>
                <div>
                  <h4 className="font-medium text-destructive">Scan Failed</h4>
                  <p className="text-sm text-muted-foreground mt-1">{error}</p>
                </div>
              </div>
            </Card>
          )}

          {scanResult && (
            <Card className="p-4 border-primary/50 bg-primary/5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <ScanLine className="size-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {scanResult.format}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {scanResult.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="font-mono text-sm break-all">{scanResult.text}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleClearResult}
                    aria-label="Clear result"
                  >
                    <X className="size-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopyResult} className="flex-1">
                    <Copy className="size-4" />
                    Copy
                  </Button>
                  {isUrl(scanResult.text) && (
                    <Button variant="outline" size="sm" onClick={handleOpenUrl} className="flex-1">
                      <ExternalLink className="size-4" />
                      Open URL
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )}

          {!scanResult && !error && (
            <Card className="p-6 border-dashed">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <ScanLine className="size-8 text-muted-foreground" />
                </div>
                <h4 className="font-medium mb-1">No Result Yet</h4>
                <p className="text-sm text-muted-foreground">
                  Scan a barcode or QR code to see the result here
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
