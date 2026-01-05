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
  // Used to poll for the video element becoming visible/ready (helpful on iOS)
  const videoCheckRef = React.useRef<number | null>(null);

  const handleStartCamera = async () => {
    setError(null);
    setScanResult(null);

    try {
      // Try to enumerate cameras and pick a back-facing camera when possible.
      let cameraId: string | null = null;
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const backCamera = cameras.find((c) =>
            /back|rear|environment|main|wide/i.test(c.label)
          );
          cameraId = backCamera ? backCamera.id : cameras[0].id;
        }
      } catch (err) {
        // getCameras may fail in some in-app browsers / privacy restricted contexts.
        console.warn("Could not enumerate cameras:", err);
      }

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

      // Use deviceId when available to avoid opening the system camera app in some in-app browsers.
      const cameraConfig: string | { facingMode: "environment" } = cameraId || { facingMode: "environment" };

      await scannerRef.current.start(
        cameraConfig,
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
      // Ensure the created video/canvas elements fill the scanner container and check feed visibility.
      try {
        ensureVideoIsVisible();
      } catch (e) {
        console.warn("Could not apply video styles:", e);
      }
    } catch (err: any) {
      console.error("Camera error:", err);
      const msg = err?.message ?? String(err);
      if (/NotAllowedError|PermissionDenied|permission/i.test(msg)) {
        setError("Failed to access camera. Please ensure camera permissions are granted and that your browser supports embedded camera access.");
        toast.error("Camera access denied");
      } else if (/NotFoundError|DevicesNotFoundError|No camera/i.test(msg)) {
        setError("No camera found on this device.");
        toast.error("No camera found");
      } else {
        setError("Unable to start embedded camera. Some in-app browsers open a native camera app instead of embedding — try opening this page in Safari or Chrome.");
        toast.error("Unable to start camera");
      }
    }
  };

  const handleStopCamera = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        // Clear the DOM elements added by Html5Qrcode to free resources.
        try {
          scannerRef.current.clear();
        } catch (e) {
          // ignore
        }
        scannerRef.current = null;
        setIsScanning(false);
        // Reset any video/canvas styles we applied
        try {
          resetVideoStyles();
        } catch (e) {
          // ignore
        }
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

  // Ensure the video/canvas inside the qr-reader container fills the area and is visible on iOS.
  const ensureVideoIsVisible = () => {
    const container = document.getElementById("qr-reader") as HTMLElement | null;
    if (!container) return;

    // Add a tailwind height class so the video has space.
    container.classList.add("h-64");

    // On small/mobile screens (especially iPhone), give more vertical space and account for safe area.
    if (window.innerWidth <= 640 || /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      container.style.minHeight = "50vh";
      try {
        container.style.paddingBottom = "env(safe-area-inset-bottom)";
      } catch (e) {}
    }

    const applyStylesToVideo = (video: HTMLVideoElement) => {
      // ensure inline playback on iOS
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.setAttribute("muted", "");
      video.muted = true;
      video.setAttribute("autoplay", "");
      video.autoplay = true;

      video.style.display = "block";
      video.style.width = "100%";
      video.style.height = "100%";
      video.style.objectFit = "cover";
      video.style.position = "relative";
      video.style.zIndex = "1";

      try {
        (video as any).playsInline = true;
      } catch (e) {}

      // try to kickstart playback
      video.play().catch(() => {});
    };

    const applyToCanvas = (canvas: HTMLCanvasElement) => {
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.position = "relative";
      canvas.style.zIndex = "2";
    };

    const tryApply = () => {
      let video = container.querySelector("video") as HTMLVideoElement | null;
      if (!video) {
        // try globally if library appended elsewhere
        video = document.querySelector("video") as HTMLVideoElement | null;
      }
      if (video) applyStylesToVideo(video);

      const canvas = container.querySelector("canvas") as HTMLCanvasElement | null;
      if (canvas) applyToCanvas(canvas);

      return video;
    };

    // Try once and then poll for up to ~3 seconds for the video to become ready/render.
    const videoNow = tryApply();
    if (videoNow && videoNow.readyState > 1 && (videoNow.videoWidth || videoNow.videoHeight)) {
      return;
    }

    if (videoCheckRef.current) {
      clearInterval(videoCheckRef.current);
      videoCheckRef.current = null;
    }

    let attempts = 0;
    videoCheckRef.current = window.setInterval(() => {
      attempts++;
      const v = tryApply();
      if (v && v.readyState > 1 && (v.videoWidth || v.videoHeight)) {
        // visible and rendering
        if (videoCheckRef.current) {
          clearInterval(videoCheckRef.current);
          videoCheckRef.current = null;
        }
        return;
      }

      if (attempts >= 6) {
        if (videoCheckRef.current) {
          clearInterval(videoCheckRef.current);
          videoCheckRef.current = null;
        }
        setError(
          "Camera feed was started but the video isn't rendering inline on this browser. Try opening this page in Safari or Chrome and ensure inline playback is enabled."
        );
        toast.error("Camera feed not rendering");
      }
    }, 500);
  };

  const resetVideoStyles = () => {
    const container = document.getElementById("qr-reader") as HTMLElement | null;
    if (!container) return;
    container.classList.remove("h-64");
    container.style.minHeight = "";
    container.style.paddingBottom = "";

    if (videoCheckRef.current) {
      clearInterval(videoCheckRef.current);
      videoCheckRef.current = null;
    }

    const video = container.querySelector("video") as HTMLVideoElement | null;
    if (video) {
      try {
        video.pause();
      } catch (e) {}
      video.style.width = "";
      video.style.height = "";
      video.style.objectFit = "";
      video.style.display = "";
      video.style.position = "";
      video.style.zIndex = "";
      try {
        video.removeAttribute("playsinline");
        video.removeAttribute("webkit-playsinline");
        video.removeAttribute("muted");
        video.removeAttribute("autoplay");
      } catch (e) {}
    }
    const canvas = container.querySelector("canvas") as HTMLCanvasElement | null;
    if (canvas) {
      canvas.style.width = "";
      canvas.style.height = "";
      canvas.style.position = "";
      canvas.style.zIndex = "";
    }
  };

  React.useEffect(() => {
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            try {
              scannerRef.current?.clear();
            } catch (e) {}
            // remove any video styling applied
            resetVideoStyles();
          })
          .catch(console.error);
      } else {
        // ensure any applied styles are removed on unmount too
        resetVideoStyles();
      }
    };
  }, [isScanning]);

  return (
    <div className="space-y-6">
      {/* Scanner Area */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              "relative rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden bg-muted/30 min-h-75 w-full max-w-lg",
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
