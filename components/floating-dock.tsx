"use client";

import * as React from "react";
import { Barcode, QrCode, Scan, Sun, Moon, Monitor } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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

  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <>
      {/* Desktop Floating Dock - Apple Liquid Glass Design at Top */}
      <div className="hidden md:flex fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 px-2 py-1.5 bg-background/60 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-2xl shadow-black/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            if (tab.isBrand) {
              return (
                <React.Fragment key={tab.value}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href="/" className="flex items-center justify-center gap-2 px-2 py-1 rounded-xl hover:scale-105 hover:bg-muted/50 hover:text-foreground transition-transform">
                        <div className={cn(
                          "flex items-center justify-center size-11 rounded-xl transition-all duration-300",
                          "text-muted-foreground"
                        )}>
                          <Image src="/brand.webp" alt="Barcoda" width={20} height={20} className="size-9 rounded-lg" />
                        </div>
                        <span className="hidden md:inline text-sm font-semibold select-none">Barcoda</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Home</TooltipContent>
                  </Tooltip>

                  <div className="h-8 w-px bg-border/40 mx-1" />
                </React.Fragment>
              );
            }

            return (
              <Tooltip key={tab.value}>
                <TooltipTrigger>
                  <button
                    onClick={() => onTabChange(tab.value)}
                    className={cn(
                      "group relative flex items-center justify-center size-10 rounded-xl transition-all duration-300 ease-out",
                      "hover:scale-110 active:scale-95",
                      activeTab === tab.value
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                    aria-label={tab.label}
                  >
                    {Icon && <Icon className={cn(
                      "size-5 transition-all duration-300",
                      activeTab === tab.value ? "scale-110" : "group-hover:scale-110"
                    )} />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>{tab.label}</TooltipContent>
              </Tooltip>
            );
          })}

          <div className="h-8 w-px bg-border/40 mx-1" />

          {/* Theme toggle - simple click to switch between light/dark */}
          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center justify-center size-10 rounded-xl transition-all duration-300",
                  "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Sun className="size-5" />
                ) : theme === "dark" ? (
                  <Moon className="size-5" />
                ) : (
                  <Monitor className="size-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Mobile iPhone Dock */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-md">
        <div className="flex items-center justify-around p-2 bg-background/60 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-2xl shadow-black/10">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;

            if (tab.isBrand) {
              return (
                <React.Fragment key={tab.value}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Link href="/" className="flex items-center justify-center px-1 py-1 rounded-xl hover:scale-105 hover:bg-muted/50 hover:text-foreground transition-transform">
                        <div className="flex items-center justify-center size-11 rounded-xl">
                          <Image src="/brand.webp" alt="Barcoda" width={24} height={24} className="size-9 rounded-lg" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>Home</TooltipContent>
                  </Tooltip>

                  <div className="h-8 w-px bg-border/40 mr-2" />
                </React.Fragment>
              );
            }

            return (
              <Tooltip key={tab.value}>
                <TooltipTrigger>
                  <button
                    onClick={() => onTabChange(tab.value)}
                    className={cn(
                      "relative flex items-center justify-center rounded-xl transition-all duration-300",
                      "active:scale-95"
                    )}
                    aria-label={tab.label}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center size-11 rounded-xl transition-all duration-300",
                        activeTab === tab.value
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                          : "text-muted-foreground"
                      )}
                    >
                      {Icon && <Icon className="size-5" />}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>{tab.label}</TooltipContent>
              </Tooltip>
            );
          })}

          <div className="h-12 w-px bg-border/40" />

          <Tooltip>
            <TooltipTrigger>
              <button
                onClick={toggleTheme}
                className={cn(
                  "flex items-center justify-center size-11 rounded-xl transition-all duration-300",
                  "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
                aria-label="Toggle theme"
              >
                {theme === "light" ? (
                  <Sun className="size-5" />
                ) : theme === "dark" ? (
                  <Moon className="size-5" />
                ) : (
                  <Monitor className="size-5" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </>
  );
}
