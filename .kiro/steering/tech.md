# Tech Stack

## Frontend

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS3 (no framework, custom responsive design)
- **Testing**: Vitest with @vitest/ui
- **AI Libraries**: TensorFlow.js with MobileNet (optional preprocessing)

## Backend

- **Platform**: Cloudflare Workers (serverless)
- **Runtime**: Workers runtime (not Node.js)
- **API**: Doubao 1.6 Vision API integration
- **Deployment**: Wrangler CLI

## TypeScript Configuration

- Target: ES2020
- Module: ESNext with bundler resolution
- Strict mode enabled
- React JSX transform

## Common Commands

### Development

```bash
# Start frontend dev server (port 5173)
npm run dev

# Start Workers dev server (port 8787)
cd workers && npm run dev
```

### Building

```bash
# Build frontend for production
npm run build

# Output: dist/ directory
```

### Testing

```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui
```

### Deployment

```bash
# Deploy Workers API
cd workers && npm run deploy

# Frontend deploys via Cloudflare Pages (connected to Git)
```

## Environment Variables

### Frontend (.env)
- `VITE_API_ENDPOINT`: Workers API URL (default: http://localhost:8787)

### Workers (Wrangler secrets)
- `DOUBAO_API_KEY`: Doubao API key (set via `wrangler secret put`)
- `DOUBAO_API_ENDPOINT`: API endpoint (optional, in wrangler.toml)

## Code Style

- Prettier for formatting (.prettierrc configured)
- ESLint for linting (eslint.config.js)
- Prefer functional components with hooks
- TypeScript strict mode - all types must be defined
