"use client";

import * as React from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Upload,
  Copy,
  ExternalLink,
  X,
  ScanLine,
} from "lucide-react";
import { toast } from "sonner";

interface ScanResult {
  text: string;
  format: string;
  timestamp: Date;
}

export const CodeScanner = () => {
  const [scanResult, setScanResult] = React.useState<ScanResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const scannerRef = React.useRef<Html5Qrcode | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
      setScanResult({
        text: result,
        format: "Image Scan",
        timestamp: new Date(),
      });
      toast.success("Code scanned successfully!");
    } catch (err) {
      console.error("File scan error:", err);
      setError("No barcode or QR code found in the image");
      toast.error("No code found in image");
    }
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

  return (
    <div className="space-y-6">
      {/* <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Code Scanner
      </Label> */}

      {/* Scanner Area */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-4">

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

          <Label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Upload Image
          </Label>

          {/* Upload Info */}
           <Card
             className="p-6 border border-dashed border-muted/50 cursor-pointer flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
             role="button"
             tabIndex={0}
             onClick={() => fileInputRef.current?.click()}
             onKeyDown={(e) => {
               if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
             }}
             onDragEnter={(e) => e.preventDefault()}
             onDragOver={(e) => e.preventDefault()}
             onDragLeave={() => {}}
             onDrop={(e) => {
               e.preventDefault();
               const file = e.dataTransfer?.files?.[0];
               if (file) handleFileUpload(file);
             }}
           >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Upload className="size-8 text-muted-foreground" />
              </div>
              <h4 className="font-medium mb-1">Upload Image</h4>
              <p className="text-sm text-muted-foreground">
                Drag and drop an image here, or click anywhere in this box to upload
              </p>
            </div>
          </Card>
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
                  Upload an image with a barcode or QR code to see the result here
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <div id="qr-reader-hidden" className="hidden" />
    </div>
  );
};

