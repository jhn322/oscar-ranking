"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, X, Copy, Check } from "lucide-react";

interface ShareMenuProps {
  rankingText: string;
  disabled?: boolean;
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function ShareMenu({ rankingText, disabled }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rankingText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setOpen(false);
      }, 1500);
    } catch {}
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(rankingText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(rankingText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-3 text-xs font-medium text-gold transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Share ranking"
        aria-expanded={open}
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Share</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border/60 bg-surface-elevated shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between border-b border-border/30 px-3 py-2.5">
            <span className="text-xs font-semibold text-foreground">
              Share Ranking
            </span>
            <button
              onClick={() => setOpen(false)}
              className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close share menu"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex flex-col p-1.5">
            <button
              onClick={handleTwitter}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-gold/10 hover:text-foreground"
            >
              <TwitterIcon className="h-4 w-4" />
              Post on X
            </button>
            <button
              onClick={handleFacebook}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-gold/10 hover:text-foreground"
            >
              <FacebookIcon className="h-4 w-4" />
              Share on Facebook
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-gold/10 hover:text-foreground"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy text
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
