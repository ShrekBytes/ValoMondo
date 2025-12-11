# Bangladesh Review - Frontend

Next.js frontend application for the Bangladesh Review platform.

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Configure environment:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Start development server
npm run dev
```

## Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Lint
npm run lint
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXTAUTH_URL` - Frontend URL for NextAuth
- `NEXTAUTH_SECRET` - Secret for NextAuth session encryption

## Features

- Server-side rendering with Next.js
- Authentication with NextAuth.js
- API state management with React Query
- Styling with Tailwind CSS
- Map integration with Leaflet
- Form validation with Zod

