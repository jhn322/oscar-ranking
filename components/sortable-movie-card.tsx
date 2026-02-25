'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MovieCard } from '@/components/movie-card'
import type { MovieDetails } from '@/lib/types'

interface SortableMovieCardProps {
  movie: MovieDetails
  rank: number
  isFirst: boolean
  isLast: boolean
  onMoveUp: () => void
  onMoveDown: () => void
}

export function SortableMovieCard({ movie, rank, isFirst, isLast, onMoveUp, onMoveDown }: SortableMovieCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: movie.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <MovieCard
      movie={movie}
      rank={rank}
      isDragging={isDragging}
      style={style}
      setNodeRef={setNodeRef}
      dragProps={{ ...listeners, ...attributes }}
      isFirst={isFirst}
      isLast={isLast}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    />
  )
}
