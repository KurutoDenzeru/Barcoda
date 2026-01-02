"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { BarcodeGenerator } from "./barcode-generator";
import { QRCodeGenerator } from "./qr-generator";
import { CodeScanner } from "./code-scanner";
import { Barcode, QrCode, Scan, Sparkles, Linkedin, Instagram, Github } from "lucide-react";
import { FloatingDock } from "@/components/floating-dock";

export const QRBarcodeGenerator = () => {
  const [activeTab, setActiveTab] = React.useState("barcode");
  const currentYear = new Date().getFullYear();

  const renderContent = () => {
    switch (activeTab) {
      case "barcode":
        return (
          <Card className="p-4 sm:p-6 border-border/50">
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Barcode className="size-5 text-primary" />
                Barcode Generator
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Create customized barcodes in various formats
              </p>
            </div>
            <BarcodeGenerator />
          </Card>
        );
      case "qrcode":
        return (
          <Card className="p-4 sm:p-6 border-border/50">
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <QrCode className="size-5 text-primary" />
                QR Code Generator
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Design stunning QR codes with custom styles and logos
              </p>
            </div>
            <QRCodeGenerator />
          </Card>
        );
      case "scan":
        return (
          <Card className="p-4 sm:p-6 border-border/50">
            <div className="mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Scan className="size-5 text-primary" />
                Code Scanner
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Scan barcodes and QR codes using your camera or upload an image
              </p>
            </div>
            <CodeScanner />
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8 pt-12 md:pt-24 flex flex-col">
      {/* Floating Dock Navigation */}
      <FloatingDock activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mx-auto flex justify-center">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-center sm:text-left text-xs text-muted-foreground">
              © {currentYear} Barcoda. KurutoDenzeru. All rights reserved.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/kurtcalacday/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="size-5" />
              </a>
              <a
                href="https://www.instagram.com/krtclcdy/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="size-5" />
              </a>
              <a
                href="https://github.com/KurutoDenzeru"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Github className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QRBarcodeGenerator;
