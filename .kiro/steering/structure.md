# Project Structure

## Root Layout

```
/                           # Frontend React app
├── src/                    # Frontend source code
├── workers/                # Cloudflare Workers backend
├── dist/                   # Build output (gitignored)
├── docs/                   # Documentation
└── logs/                   # Optimization logs
```

## Frontend Structure (`src/`)

```
src/
├── components/             # React components
│   ├── ImageUploader       # Image upload and processing
│   ├── LoadingIndicator    # Loading states
│   ├── AnalysisDisplay     # Results display
│   ├── HistoryList         # History management
│   ├── EmptyState          # Empty state UI
│   └── ErrorBoundary       # Error handling
├── services/               # Business logic layer
│   ├── apiClient.ts        # API communication
│   ├── foodDetector.ts     # Food detection logic
│   └── historyStorage.ts   # LocalStorage management
├── utils/                  # Utility functions
│   ├── dataParser.ts       # Response parsing
│   └── imageProcessor.ts   # Image compression/processing
├── types/                  # TypeScript definitions
│   └── index.ts            # All type definitions
├── styles/                 # Global styles
│   └── design-system.css   # Design tokens
├── App.tsx                 # Main app component
└── main.tsx                # Entry point
```

## Backend Structure (`workers/`)

```
workers/
├── src/
│   ├── worker.ts           # Main Workers entry point
│   ├── config.ts           # Configuration management
│   └── doubaoClient.ts     # Doubao API client
└── wrangler.toml           # Workers configuration
```

## Architecture Patterns

### Component Organization
- Each component has its own `.tsx` and `.css` file
- Components are self-contained with local state
- Props interfaces def