# 🏆 Oscar Ranking

An interactive web application to rank and share your Oscar Best Picture nominations. Easily reorder your favorite movies, persist your rankings locally, and share your personal rankings with others.

## ✨ Features

- **Browse Oscar Nominees** — View Best Picture nominees for any year from 2015-2026
- **Interactive Ranking** — Drag and drop movies to reorder them or use the up/down buttons
- **Persistent Storage** — Your rankings are automatically saved to localStorage and restored when you revisit
- **Movie Details** — See detailed information for each movie including cast, director, synopsis, and IMDb ratings
- **Year Selector** — Switch between different Oscar ceremonies to create rankings for any year
- **Share Rankings** — Share your custom rankings with others via a shareable link
- **Responsive Design** — Fully optimized for mobile, tablet, and desktop experiences
- **Visual Indicators** — Real-time drag feedback and intuitive UI elements

## 🛠️ Tech Stack

**Frontend:**

- [Next.js](https://nextjs.org/) — React framework with SSR and API routes
- [React](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type-safe JavaScript
- [dnd-kit](https://docs.dndkit.com/) — Headless drag-and-drop toolkit
- [Radix UI](https://www.radix-ui.com/) — Unstyled, accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Lucide React](https://lucide.dev/) — Iconography library

**Backend:**

- **Next.js API Routes** — Serverless API endpoints
- **TMDB API** — Movie data and graphics

**Data & Storage:**

- **localStorage** — Client-side persistent ranking storage
- **SWR** — Data fetching and caching

## 📦 Project Structure

```
oscar-ranking/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Main page
│   ├── globals.css             # Global styles
│   └── api/
│       └── nominees/
│           └── route.ts        # API endpoint for fetching nominees
├── components/
│   ├── oscar-ranking.tsx       # Main component
│   ├── ranking-list.tsx        # Drag-and-drop list container
│   ├── movie-card.tsx          # Individual movie card
│   ├── year-selector.tsx       # Year picker
│   ├── share-menu.tsx          # Share functionality
│   ├── loading-skeleton.tsx    # Loading placeholders
│   ├── sortable-movie-card.tsx # Draggable card wrapper
│   ├── theme-provider.tsx      # Theme context
│   └── ui/                     # Radix UI components
├── lib/
│   ├── nominees.ts            # Oscar nominee data
│   ├── tmdb.ts                # TMDB API integration
│   ├── types.ts               # TypeScript type definitions
│   └── utils.ts               # Utility functions
├── hooks/
│   ├── use-mobile.ts          # Mobile detection hook
│   └── use-toast.ts           # Toast notification hook
├── public/                     # Static assets
└── package.json               # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- Environment variables for TMDB API key (see configuration below)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd oscar-ranking
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
TMDB_API_BASE_URL=https://api.themoviedb.org/3
```

4. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎮 Usage

1. **Select a Year** — Use the year selector to choose an Oscar ceremony
2. **View Nominees** — Browse all nominated films with detailed information
3. **Rank Movies** — Drag movie posters to reorder them (on mobile, drag by the poster image)
4. **Use Quick Actions** — Click the up/down arrows to move movies one position
5. **Share Your Ranking** — Click the share button to generate a link to your custom ranking
6. **Switch Years** — Your rankings for each year are saved independently

## 💾 Data Persistence

Rankings are automatically saved to your browser's localStorage with the key `oscars-ranking-order-{year}`. This means:

- Your rankings persist across browser sessions
- Each year has its own independent ranking
- You can reset rankings to the default order using the reset button

## 📱 Mobile Experience

The app is fully optimized for mobile devices with:

- Touch-friendly drag handles (drag by the movie poster)
- Sensitive touch detection (300ms press-and-hold delay to prevent accidental drags)
- Responsive card layouts
- Optimized spacing and buttons

## 🔧 Build & Deploy

### Development

```bash
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## 🎯 Key Features Explained

### Drag and Drop

- Uses `dnd-kit` for accessible, performant drag-and-drop
- Mobile: Drag by the movie poster only to allow smooth scrolling
- Desktop: Full-card dragging with visual feedback
- Modifiers ensure vertical-only dragging within the list boundaries

### Movie Data

- Fetched from TMDB API
- Includes title, year, poster, backdrop, genres, cast, and ratings
- Movie IDs link to IMDb full movie pages

---
