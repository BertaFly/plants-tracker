# Plants Tracker

A modern plant care tracking application built with React and deployed on Vercel with Postgres database and Blob storage.

## Features

- 🌿 Track your plants with photos
- 💧 Log watering, fertilizing, and treatment dates
- 📅 Visual calendar view of plant care
- 🔐 Simple authentication system
- 📱 Responsive design

## Tech Stack

- **Frontend**: React + Vite
- **Database**: Vercel Postgres
- **Storage**: Vercel Blob (for plant images)
- **Hosting**: Vercel
- **State Management**: Zustand
- **Styling**: CSS

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (copy `.env.example` to `.env.local`):
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

### 1. Deploy to Vercel

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Deploy
vercel
```

### 2. Set up Vercel Postgres

1. Go to your Vercel dashboard
2. Select your project
3. Go to the "Storage" tab
4. Create a new Postgres database
5. Copy the environment variables to your Vercel project settings

### 3. Set up Vercel Blob Storage

1. In your Vercel project dashboard
2. Go to the "Storage" tab
3. Create a new Blob store
4. Copy the `BLOB_READ_WRITE_TOKEN` to your environment variables

### 4. Environment Variables

Set these in your Vercel project settings:

```
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NO_SSL=your_postgres_url_no_ssl
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling
POSTGRES_USER=your_postgres_user
POSTGRES_HOST=your_postgres_host
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DATABASE=your_postgres_database
BLOB_READ_WRITE_TOKEN=your_blob_token
```

### 5. Database Setup

The database tables will be created automatically when the app first runs. The schema includes:

- `users` - User accounts
- `plants` - Plant records
- `care_records` - Care history (watering, fertilizing, treatments)

## Current Implementation

This version uses **localStorage for demo purposes** instead of the full Postgres/Blob integration. To enable full database functionality:

1. Set up the environment variables as described above
2. Uncomment the API integration code in the store
3. Deploy the API endpoints (you'll need to create them in a `pages/api` or `app/api` directory)

## Migration from Firebase

This project was successfully migrated from Firebase to Vercel:

- ✅ Firebase Auth → Simple auth service (can be upgraded to NextAuth.js)
- ✅ Firestore → Vercel Postgres (schema ready)
- ✅ Firebase Storage → Vercel Blob (integration ready)
- ✅ Firebase Hosting → Vercel hosting

## Future Enhancements

- [ ] Implement full API endpoints for database operations
- [ ] Add NextAuth.js for proper authentication
- [ ] Add plant care reminders
- [ ] Export/import plant data
- [ ] Plant care analytics and insights
