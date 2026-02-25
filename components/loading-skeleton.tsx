"use client";

import { Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6 py-16">
      <Loader2 className="h-8 w-8 animate-spin text-gold/60" />
      <p className="text-sm text-muted-foreground">Loading nominees...</p>
    </div>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="block md:hidden">
        <div className="overflow-hidden rounded-xl border border-border/30 bg-card">
          <div className="relative h-44 bg-surface-elevated">
            <div className="absolute right-3 bottom-3 flex items-center gap-1">
              <div className="h-7 w-7 rounded-lg bg-background/30" />
              <div className="h-7 w-7 rounded-lg bg-background/30" />
            </div>
          </div>
          <div className="px-4 pb-4 pt-3">
            <div className="flex gap-2">
              <div className="h-4 w-16 rounded-full bg-surface-elevated" />
              <div className="h-4 w-20 rounded-full bg-surface-elevated" />
            </div>
            <div className="mt-2.5 h-3 w-3/4 rounded bg-surface-elevated" />
            <div className="mt-1.5 h-3 w-1/2 rounded bg-surface-elevated" />
          </div>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-xl border border-border/30 bg-card">
          <div className="flex gap-5 p-4">
            <div className="flex flex-col items-center justify-center gap-1.5">
              <div className="h-8 w-8 rounded-lg bg-surface-elevated" />
              <div className="h-8 w-8 rounded-lg bg-surface-elevated" />
            </div>
            <div className="h-56 w-[150px] shrink-0 rounded-lg bg-surface-elevated" />
            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <div className="h-6 w-2/3 rounded bg-surface-elevated" />
                <div className="mt-2 h-4 w-16 rounded bg-surface-elevated" />
                <div className="mt-3 flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-surface-elevated" />
                  <div className="h-5 w-20 rounded-full bg-surface-elevated" />
                </div>
              </div>
              <div>
                <div className="h-4 w-1/2 rounded bg-surface-elevated" />
                <div className="mt-1.5 h-4 w-2/3 rounded bg-surface-elevated" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
