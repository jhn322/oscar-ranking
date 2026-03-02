"use client";

import Image from "next/image";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { MovieDetails } from "@/lib/types";
import { getPosterUrl, getBackdropUrl } from "@/lib/tmdb";
import Link from "next/link";

interface MovieCardProps {
  movie: MovieDetails;
  rank: number;
  summary?: string;
  isDragging?: boolean;
  style?: React.CSSProperties;
  dragProps?: Record<string, unknown>;
  setNodeRef?: (node: HTMLElement | null) => void;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function MovieCard({
  movie,
  rank,
  summary,
  isDragging,
  style,
  dragProps,
  setNodeRef,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
}: MovieCardProps) {
  const posterUrl = getPosterUrl(movie.posterPath, "w500");
  const backdropUrl = getBackdropUrl(movie.backdropPath, "w1280");
  const imdbUrl = movie.imdbId
    ? `https://www.imdb.com/title/${movie.imdbId}/`
    : null;

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, touchAction: "none" }}
      {...dragProps}
      className="group relative w-full select-none transition-shadow duration-300 cursor-grab"
    >
      {/* Mobile */}
      <div className="block md:hidden">
        <div
          className={`relative overflow-hidden rounded-3xl border bg-card transition-colors ${isDragging ? "z-50 cursor-grabbing border-2 border-gold/50" : "border-border/50"}`}
        >
          {/* Bg image */}
          <div className="relative h-44">
            {backdropUrl ? (
              <Image
                src={backdropUrl}
                alt=""
                fill
                draggable={false}
                className="object-cover pointer-events-none"
                sizes="100vw"
                priority={rank <= 3}
              />
            ) : posterUrl ? (
              <Image
                src={posterUrl}
                alt=""
                fill
                draggable={false}
                className="object-cover object-top pointer-events-none"
                sizes="100vw"
                priority={rank <= 3}
              />
            ) : (
              <div className="h-full w-full bg-surface-elevated" />
            )}

            <div className="absolute inset-0 bg-linear-to-t from-card via-card/70 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-r from-card/80 to-transparent" />

            {/* Rank badge */}
            <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-background/80 backdrop-blur-sm">
              <span className="font-sans text-sm font-bold tabular-nums text-gold">
                {rank}
              </span>
            </div>

            <div
              className="absolute right-3 top-3 h-8 w-8"
              aria-hidden="true"
            />

            {/* Move up/down btns */}
            {(onMoveUp || onMoveDown) && (
              <div className="absolute right-3 z-30 bottom-3 flex items-center gap-1">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp?.();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-background/70 text-gold/70 backdrop-blur-sm transition-colors active:bg-gold/20 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  disabled={isLast}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown?.();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/20 bg-background/70 text-gold/70 backdrop-blur-sm transition-colors active:bg-gold/20 disabled:opacity-30 disabled:pointer-events-none"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
              <h3 className="font-sans text-lg font-bold leading-tight text-foreground text-balance">
                {movie.title}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-medium text-gold">
                  {movie.year}
                </span>
                {imdbUrl && (
                  <Link
                    href={imdbUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-[12px] font-bold text-gold transition-colors hover:bg-gold/15"
                    aria-label={`View ${movie.title} on IMDB`}
                  >
                    IMDb
                    {movie.rating > 0 && (
                      <span className="ml-1 text-gold/70 text-[12px]">
                        {movie.rating.toFixed(1)}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 pt-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {movie.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-gold/15 bg-gold/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold/80"
                >
                  {genre}
                </span>
              ))}
            </div>
            {/* summary text */}
            <p className="my-2 text-xs text-muted-foreground line-clamp-3">
              {summary ?? movie.overview}
            </p>
            <div className="mt-2.5 flex flex-col gap-1">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-gold/60">Dir.</span>{" "}
                <span className="text-foreground/80">{movie.director}</span>
              </p>
              {movie.cast.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-gold/60">Cast</span>{" "}
                  <span className="text-foreground/60">
                    {movie.cast.join(", ")}
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <div
          className={`relative overflow-hidden rounded-3xl bg-background/80 transition-all duration-300 ${isDragging ? "z-50 cursor-grabbing border-2 border-gold/50" : "shadow-[0_4px_20px_rgba(0,0,0,0.4)]"}`}
        >
          <div className="flex gap-5 p-4">
            {/* Move up/down btns - Desktop */}
            {(onMoveUp || onMoveDown) && (
              <div className="flex flex-col items-center justify-center gap-1.5">
                <button
                  type="button"
                  disabled={isFirst}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp?.();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-gold/70 transition-colors hover:bg-gold/15 hover:text-gold disabled:opacity-25 disabled:pointer-events-none"
                  aria-label="Move up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={isLast}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown?.();
                  }}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-gold/70 transition-colors hover:bg-gold/15 hover:text-gold disabled:opacity-25 disabled:pointer-events-none"
                  aria-label="Move down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}
            {/* Poster */}
            <div className="relative h-56 w-37.5 shrink-0 overflow-hidden rounded-xl">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  draggable={false}
                  className="object-cover pointer-events-none"
                  sizes="150px"
                  priority={rank <= 3}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-elevated">
                  <span className="text-xs text-muted-foreground">
                    No Poster
                  </span>
                </div>
              )}
              <div className="absolute left-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-background/90 backdrop-blur-sm">
                <span className="font-sans text-base font-bold tabular-nums text-gold">
                  {rank}
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between py-1">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-sans text-xl font-bold leading-tight text-foreground text-balance">
                    {movie.title}
                  </h3>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-sm font-medium text-gold">
                    {movie.year}
                  </span>
                  {imdbUrl && (
                    <Link
                      href={imdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 rounded-full border border-gold/20 bg-gold/5 px-2 py-0.5 text-[12px] font-bold text-gold transition-colors hover:bg-gold/15"
                      aria-label={`View ${movie.title} on IMDB`}
                    >
                      IMDb
                      {movie.rating > 0 && (
                        <span className="ml-1 text-gold/70 text-[12px]">
                          {movie.rating.toFixed(1)}
                        </span>
                      )}
                    </Link>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {movie.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-gold/15 bg-gold/5 px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-gold/80"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
                {/* summary text */}
                <p className="my-2 text-sm text-muted-foreground line-clamp-3">
                  {summary ?? movie.overview}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-gold/60">Directed by</span>{" "}
                  <span className="text-foreground/80">{movie.director}</span>
                </p>
                {movie.cast.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-gold/60">Starring</span>{" "}
                    <span className="text-foreground/60">
                      {movie.cast.join(", ")}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
