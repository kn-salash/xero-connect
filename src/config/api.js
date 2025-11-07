// API configuration - uses relative URLs so proxy works
// The proxy in package.json forwards /api/* to http://localhost:5000
// This works both locally and through Cloudflare tunnel
// On Vercel, API routes are automatically available at /api/*
export const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : '';

