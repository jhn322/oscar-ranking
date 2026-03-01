"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { SortableMovieCard } from "@/components/sortable-movie-card";
import { MovieCard } from "@/components/movie-card";
import type { MovieDetails } from "@/lib/types";

interface RankingListProps {
  movies: MovieDetails[];
  onReorder: (movies: MovieDetails[]) => void;
}

export function RankingList({ movies, onReorder }: RankingListProps) {
  const [activeId, setActiveId] = useState<number | null>(null);

  const handleMove = useCallback(
    (index: number, direction: "up" | "down") => {
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= movies.length) return;
      const newOrder = arrayMove(movies, index, targetIndex);
      onReorder(newOrder);
    },
    [movies, onReorder],
  );

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 10,
      },
    }),
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;

      if (over && active.id !== over.id) {
        const oldIndex = movies.findIndex((m) => m.id === active.id);
        const newIndex = movies.findIndex((m) => m.id === over.id);
        const newOrder = arrayMove(movies, oldIndex, newIndex);
        onReorder(newOrder);
      }
    },
    [movies, onReorder],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const activeMovie = activeId ? movies.find((m) => m.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={movies.map((m) => m.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          className="flex flex-col gap-8 md:gap-4"
          role="list"
          aria-label="Movie ranking list"
        >
          {movies.map((movie, index) => (
            <SortableMovieCard
              key={movie.id}
              movie={movie}
              rank={index + 1}
              isFirst={index === 0}
              isLast={index === movies.length - 1}
              onMoveUp={() => handleMove(index, "up")}
              onMoveDown={() => handleMove(index, "down")}
            />
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeMovie ? (
          <MovieCard
            movie={activeMovie}
            rank={movies.findIndex((m) => m.id === activeMovie.id) + 1}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
