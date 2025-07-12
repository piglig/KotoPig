# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend (React App)
- `npm start` - Run development server at http://localhost:3000
- `npm test` - Run tests in interactive watch mode
- `npm run build` - Create production build in /build folder
- `npm run eject` - Eject from Create React App (irreversible)

### Data Processing Scripts (Python)
- `python jisho_scraper.py` - Scrape vocabulary from Jisho.org
- `python jmdict_processor.py` - Process JMDict data for app consumption
- `python conjugation_scraper.py` - Extract verb conjugation patterns
- `python supabase_importer.py` - Import processed data to Supabase

## Architecture Overview

### Frontend Architecture
This is a React SPA built with Create React App that implements a Japanese vocabulary learning platform called "Koto-Pig v2". The app uses a modern component-based architecture with:

- **Authentication**: Supabase Auth with email/password and OAuth (Google, Twitter)
- **State Management**: React Context API with two main contexts:
  - `AuthContext` (`src/contexts/AuthContext.js`) - User authentication state
  - `WordContext` (`src/contexts/WordContext.js`) - Vocabulary data and search functionality
- **UI Framework**: Material-UI (MUI) with custom theme in `src/theme/theme.js`
- **Routing**: React Router with protected routes requiring authentication

### Key Components Structure
```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Main navigation
│   ├── VerbCard.js     # Individual word display card
│   ├── WordCloud.js    # Visual word cloud display
│   └── Quiz*.js        # Quiz and flashcard components
├── pages/              # Route-level page components
│   ├── HomePage.js     # Main dashboard
│   ├── WordList.js     # Searchable word browser
│   └── *Page.js        # Other authenticated pages
├── contexts/           # Global state management
└── data/               # Static data files
```

### Backend Integration
- **Database**: Supabase PostgreSQL with `verbs` table containing Japanese vocabulary
- **Authentication**: Supabase Auth integrated via `src/supabaseClient.js`
- **Data Schema**: Words stored with japanese/english/furigana/jlpt_level/part_of_speech/conjugations
- **Pagination**: 50 words per page with infinite scroll capability

### Data Processing Pipeline
The repository includes Python scripts for vocabulary data collection and processing:

- **jisho_scraper.py**: Extracts vocabulary from Jisho.org API
- **jmdict_processor.py**: Processes JMDict XML data into structured format
- **conjugation_scraper.py**: Scrapes verb conjugation patterns
- **converter.py**: Converts between different data formats
- **supabase_importer.py**: Imports processed data into Supabase database

## Environment Configuration

### Required Environment Variables
Create `.env` file with:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup
Run SQL scripts in order:
1. `supabase/01_init_verbs_table.sql` - Creates main vocabulary table
2. `supabase/02_init_user_progress_table.sql` - Sets up user progress tracking

## Key Features Implementation

### Word Search and Display
- Full-text search across japanese/english/furigana fields in `WordContext`
- Part-of-speech filtering capability
- Paginated results with infinite scroll
- Dynamic loading states and error handling

### Authentication Flow
- Protected routes redirect to `/login` if unauthenticated
- Support for email/password and OAuth providers
- Persistent session management via Supabase

### UI/UX Patterns
- Material-UI components with custom pink/red theme
- Responsive design with mobile-first approach
- Framer Motion animations for enhanced interactions
- Japanese typography support with Plus Jakarta Sans font

## Development Patterns

### Context Usage
- Use `useAuth()` hook for authentication state
- Use `useWordContext()` hook for vocabulary operations
- Both contexts handle loading states and error management

### Component Conventions
- All pages are in `/pages` and require authentication
- Reusable components in `/components` with clear props interface
- Material-UI components used consistently throughout
- Custom theme colors: primary red (#e72b4d), backgrounds in light pink tones

### Data Fetching
- WordContext handles all vocabulary API calls to Supabase
- Implements pagination with `PAGE_SIZE = 50`
- Search and filtering integrated with Supabase queries
- Error boundaries and loading states for better UX

## Testing Strategy
- Uses React Testing Library with Jest
- Test files follow `*.test.js` convention
- Run single test: `npm test -- --testNamePattern="TestName"`