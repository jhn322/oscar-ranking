"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface YearSelectorProps {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
  loading?: boolean;
}

export function YearSelector({
  years,
  selectedYear,
  onSelectYear,
  loading,
}: YearSelectorProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const desktopPills = years.slice(0, 5);
  const desktopMore = years.slice(5);

  const mobilePills = years.slice(0, 2);
  const mobileMore = years.slice(2);

  const isInDesktopMore = desktopMore.includes(selectedYear);
  const isInMobileMore = mobileMore.includes(selectedYear);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const pillClass = (active: boolean) =>
    cn(
      "flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
      "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
      active
        ? "border-gold/50 bg-gold/10 text-gold shadow-[0_0_12px_rgba(212,168,67,0.15)]"
        : "border-border/50 bg-surface text-muted-foreground hover:border-gold/20 hover:text-foreground",
      loading && "cursor-not-allowed opacity-50",
    );

  const moreBtnClass = (active: boolean) =>
    cn(
      "flex flex-shrink-0 items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
      "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
      active
        ? "border-gold/50 bg-gold/10 text-gold shadow-[0_0_12px_rgba(212,168,67,0.15)]"
        : "border-border/50 bg-surface text-muted-foreground hover:border-gold/20 hover:text-foreground",
      loading && "cursor-not-allowed opacity-50",
    );

  const dropdownItemClass = (active: boolean) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-gold/10 text-gold"
        : "text-foreground/70 hover:bg-gold/5 hover:text-foreground",
    );

  return (
    <div
      className="flex items-center gap-2 pb-1"
      role="tablist"
      aria-label="Select ceremony year"
    >
      {mobilePills.map((year) => (
        <button
          key={`mob-${year}`}
          role="tab"
          aria-selected={selectedYear === year}
          disabled={loading}
          onClick={() => onSelectYear(year)}
          className={cn(pillClass(selectedYear === year), "md:hidden")}
        >
          {year}
        </button>
      ))}

      {desktopPills.map((year) => (
        <button
          key={`desk-${year}`}
          role="tab"
          aria-selected={selectedYear === year}
          disabled={loading}
          onClick={() => onSelectYear(year)}
          className={cn(pillClass(selectedYear === year), "hidden md:flex")}
        >
          {year}
        </button>
      ))}

      <div className="relative" ref={dropdownRef}>
        {/* Mobile More btn */}
        {mobileMore.length > 0 && (
          <button
            disabled={loading}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(moreBtnClass(isInMobileMore), "md:hidden")}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            {isInMobileMore ? selectedYear : "More"}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>
        )}

        {/* Desktop More btn */}
        {desktopMore.length > 0 && (
          <button
            disabled={loading}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={cn(moreBtnClass(isInDesktopMore), "hidden md:flex")}
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            {isInDesktopMore ? selectedYear : "More"}
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>
        )}

        {dropdownOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-28 overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="flex flex-col p-1">
              {/* Mobile dropdown items */}
              {mobileMore.map((year) => (
                <button
                  key={`mob-drop-${year}`}
                  role="option"
                  aria-selected={selectedYear === year}
                  onClick={() => {
                    onSelectYear(year);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    dropdownItemClass(selectedYear === year),
                    "md:hidden",
                  )}
                >
                  {year}
                </button>
              ))}
              {/* Desktop dropdown items */}
              {desktopMore.map((year) => (
                <button
                  key={`desk-drop-${year}`}
                  role="option"
                  aria-selected={selectedYear === year}
                  onClick={() => {
                    onSelectYear(year);
                    setDropdownOpen(false);
                  }}
                  className={cn(
                    dropdownItemClass(selectedYear === year),
                    "hidden md:block",
                  )}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
