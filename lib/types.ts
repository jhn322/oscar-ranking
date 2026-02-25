export interface MovieDetails {
  id: number
  title: string
  year: number
  posterPath: string | null
  backdropPath: string | null
  genres: string[]
  director: string
  cast: string[]
  overview: string
  rating: number
  imdbId: string | null
}

export interface NomineeEntry {
  title: string
  tmdbId?: number
}

export interface YearNominees {
  year: number
  ceremony: string
  nominees: NomineeEntry[]
}
