# Product Overview

Food Calorie Analyzer (食物卡路里分析器) - An AI-powered food recognition and nutrition analysis system.

## Core Functionality

- Upload food images for automatic AI recognition
- Calculate calories and detailed nutrition information (protein, fat, carbs, fiber)
- Store analysis history locally in browser
- Responsive design for desktop and mobile

## Tech Architecture

- Frontend: React SPA hosted on Cloudflare Pages
- Backend: Serverless API on Cloudflare Workers
- AI: Powered by Doubao 1.6 Vision API (方舟豆包)

## Key Features

- Automatic image compression to optimize API token usage
- Local history storage (no backend database)
- Bilingual support (Chinese primary interface)
- Performance-optimized with 30-60 second analysis time
