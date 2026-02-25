"use client";

import { useState, useCallback, useEffect } from "react";
import useSWR from "swr";
import { RotateCcw, Film } from "lucide-react";
import { RankingList } from "@/components/ranking-list";
import { YearSelector } from "@/components/year-selector";
import { SkeletonList } from "@/components/loading-skeleton";
import { ShareMenu } from "@/components/share-menu";
import type { MovieDetails } from "@/lib/types";

interface NomineesResponse {
  year: number;
  ceremony: string;
  movies: MovieDetails[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// localStorage
function storageKey(year: number) {
  return `oscars-ranking-order-${year}`;
}

function loadSavedOrder(movies: MovieDetails[], year: number): MovieDetails[] {
  try {
    const raw = localStorage.getItem(storageKey(year));
    if (!raw) return movies;
    const savedIds: number[] = JSON.parse(raw);
    const ordered = savedIds
      .map((id) => movies.find((m) => m.id === id))
      .filter((m): m is MovieDetails => m !== undefined);
    const unseen = movies.filter((m) => !savedIds.includes(m.id));
    return [...ordered, ...unseen];
  } catch {
    return movies;
  }
}

function persistOrder(movies: MovieDetails[], year: number) {
  try {
    localStorage.setItem(
      storageKey(year),
      JSON.stringify(movies.map((m) => m.id)),
    );
  } catch {}
}

function clearSavedOrder(year: number) {
  try {
    localStorage.removeItem(storageKey(year));
  } catch {}
}

export function OscarRanking() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [rankedMovies, setRankedMovies] = useState<MovieDetails[]>([]);
  const [hasReordered, setHasReordered] = useState(false);

  const availableYears = [
    2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015,
  ];

  const { data, error, isLoading } = useSWR<NomineesResponse>(
    `/api/nominees?year=${selectedYear}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    },
  );

  useEffect(() => {
    if (!data?.movies) return;
    const restored = loadSavedOrder(data.movies, selectedYear);
    setRankedMovies(restored);
    const isCustom = restored.some((m, i) => m.id !== data.movies[i]?.id);
    setHasReordered(isCustom);
  }, [data, selectedYear]);

  const handleReorder = useCallback(
    (newOrder: MovieDetails[]) => {
      setRankedMovies(newOrder);
      setHasReordered(true);
      persistOrder(newOrder, selectedYear);
    },
    [selectedYear],
  );

  const handleReset = useCallback(() => {
    if (data?.movies) {
      clearSavedOrder(selectedYear);
      setRankedMovies(data.movies);
      setHasReordered(false);
    }
  }, [data, selectedYear]);

  const rankingText =
    rankedMovies.length > 0
      ? `My ${selectedYear} Oscar Best Picture Ranking:\n\n${rankedMovies.map((m, i) => `${i + 1}. ${m.title} (${m.year})`).join("\n")}`
      : "";

  const handleYearChange = useCallback((year: number) => {
    setSelectedYear(year);
    setHasReordered(false);
  }, []);

  return (
    <main className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-sans text-lg font-bold leading-tight tracking-tight text-foreground sm:text-2xl">
                Oscar Best Picture
              </h1>
              <p className="text-xs text-muted-foreground">
                {data?.ceremony || `${selectedYear} Ceremony`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {hasReordered && (
                <button
                  onClick={handleReset}
                  className="flex h-9 items-center gap-1.5 rounded-lg border border-border/50 bg-surface px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-gold/20 hover:text-foreground"
                  aria-label="Reset ranking"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
              <ShareMenu
                rankingText={rankingText}
                disabled={rankedMovies.length === 0}
              />
            </div>
          </div>

          {/* Year */}
          <div className="mt-3">
            <YearSelector
              years={availableYears}
              selectedYear={selectedYear}
              onSelectYear={handleYearChange}
              loading={isLoading}
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-5">
        {!isLoading && rankedMovies.length > 0 && (
          <p className="mb-4 text-center text-xs tracking-wide text-muted-foreground md:text-sm">
            Drag to reorder your personal ranking
          </p>
        )}

        {isLoading && <SkeletonList />}

        {error && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/50 bg-surface">
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Unable to load nominees
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Please check your TMDB API key configuration
              </p>
            </div>
          </div>
        )}

        {!isLoading && !error && rankedMovies.length > 0 && (
          <RankingList movies={rankedMovies} onReorder={handleReorder} />
        )}

        {!isLoading && !error && rankedMovies.length === 0 && data && (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border/50 bg-surface">
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No nominees found for {selectedYear}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
