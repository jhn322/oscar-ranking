import { NextResponse } from 'next/server'
import { getNomineesForYear, getAvailableYears } from '@/lib/nominees'
import { fetchNomineesDetails } from '@/lib/tmdb'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const yearParam = searchParams.get('year')
  const apiKey = process.env.TMDB_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'TMDB API key not configured' },
      { status: 500 }
    )
  }

  // Return available years if no year param
  if (!yearParam) {
    return NextResponse.json({ years: getAvailableYears() })
  }

  const year = parseInt(yearParam, 10)
  const yearData = getNomineesForYear(year)

  if (!yearData) {
    return NextResponse.json(
      { error: `No nominees data for year ${year}` },
      { status: 404 }
    )
  }

  const titles = yearData.nominees.map((n) => n.title)
  const movies = await fetchNomineesDetails(titles, apiKey)

  return NextResponse.json({
    year: yearData.year,
    ceremony: yearData.ceremony,
    movies,
  })
}
