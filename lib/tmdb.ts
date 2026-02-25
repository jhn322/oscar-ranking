import type { MovieDetails } from './types'

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

export function getPosterUrl(
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function getBackdropUrl(
  path: string | null,
  size: 'w780' | 'w1280' | 'original' = 'w1280'
): string {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

async function tmdbFetch(endpoint: string, apiKey: string) {
  const url = `${TMDB_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${apiKey}`
  const res = await fetch(url, { next: { revalidate: 86400 } })
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function searchMovie(
  title: string,
  apiKey: string
): Promise<{ id: number; title: string; release_date: string; poster_path: string | null; backdrop_path: string | null } | null> {
  const data = await tmdbFetch(
    `/search/movie?query=${encodeURIComponent(title)}&language=en-US&page=1`,
    apiKey
  )
  if (data.results && data.results.length > 0) {
    return data.results[0]
  }
  return null
}

export async function getMovieDetails(
  movieId: number,
  apiKey: string
): Promise<MovieDetails | null> {
  try {
    const [details, credits] = await Promise.all([
      tmdbFetch(`/movie/${movieId}?language=en-US`, apiKey),
      tmdbFetch(`/movie/${movieId}/credits?language=en-US`, apiKey),
    ])

    const director =
      credits.crew?.find(
        (c: { job: string; name: string }) => c.job === 'Director'
      )?.name || 'Unknown'

    const cast = credits.cast
      ?.slice(0, 3)
      .map((c: { name: string }) => c.name) || []

    return {
      id: details.id,
      title: details.title,
      year: details.release_date
        ? new Date(details.release_date).getFullYear()
        : 0,
      posterPath: details.poster_path,
      backdropPath: details.backdrop_path,
      genres: details.genres?.map((g: { name: string }) => g.name) || [],
      director,
      cast,
      overview: details.overview || '',
      rating: details.vote_average || 0,
      imdbId: details.imdb_id || null,
    }
  } catch {
    return null
  }
}

export async function fetchNomineesDetails(
  titles: string[],
  apiKey: string
): Promise<MovieDetails[]> {
  const results = await Promise.all(
    titles.map(async (title) => {
      const searchResult = await searchMovie(title, apiKey)
      if (!searchResult) return null
      return getMovieDetails(searchResult.id, apiKey)
    })
  )
  return results.filter((r): r is MovieDetails => r !== null)
}
