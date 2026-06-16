"use client";

import * as React from "react";
import { Barcode, QrCode, Scan, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FloatingDockProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FloatingDock({ activeTab, onTabChange }: FloatingDockProps) {
  const tabs = [
    { value: "brand", label: "Barcoda", icon: null, isBrand: true },
    { value: "barcode", label: "Barcode", icon: Barcode },
    { value: "qrcode", label: "QR Code", icon: QrCode },
    { value: "scan", label: "Scan", icon: Scan },
  ];

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const renderTab = (tab: typeof tabs[number]) => {
    const Icon = tab.icon;

    if (tab.isBrand) {
      return (
        <React.Fragment key={tab.value}>
          <Tooltip>
            <TooltipTrigger>
              <button
                type="button"
                onClick={() => onTabChange("barcode")}
                className="flex items-center justify-center size-10 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors cursor-pointer"
                aria-label="Go to Barcode"
              >
                <Image src="/brand.webp" alt="Barcoda" width={20} height={20} className="size-6 rounded-lg" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Home</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1" />
        </React.Fragment>
      );
    }

    return (
      <Tooltip key={tab.value}>
        <TooltipTrigger>
          <button
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "flex items-center justify-center size-10 rounded-xl transition-all duration-300 cursor-pointer",
              "active:scale-95",
              activeTab === tab.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
            aria-label={tab.label}
          >
            {Icon && <Icon className={cn("size-5", activeTab === tab.value && "scale-110")} />}
          </button>
        </TooltipTrigger>
        <TooltipContent>{tab.label}</TooltipContent>
      </Tooltip>
    );
  };

  const dockShell = "flex items-center gap-2 px-2 py-1.5 bg-background/60 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-xs";

  return (
    <>
      {/* Desktop - top */}
      <div className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className={dockShell}>
          {tabs.map(renderTab)}
          <Separator orientation="vertical" className="mx-1" />
          <Tooltip>
            <TooltipTrigger>
              <button
                type="button"
                onClick={toggleTheme}
                suppressHydrationWarning
                className="flex items-center justify-center size-10 rounded-xl transition-colors cursor-pointer text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {mounted && resolvedTheme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Mobile - bottom, same inner structure */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className={dockShell}>
          {tabs.map(renderTab)}
          <Separator orientation="vertical" className="mx-1" />
          <Tooltip>
            <TooltipTrigger>
              <button
                type="button"
                onClick={toggleTheme}
                suppressHydrationWarning
                className="flex items-center justify-center size-10 rounded-xl transition-colors cursor-pointer text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                aria-label="Toggle theme"
              >
                {mounted && resolvedTheme === "dark" ? <Moon className="size-5" /> : <Sun className="size-5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
