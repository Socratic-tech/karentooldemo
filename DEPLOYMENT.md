# Deployment Guide

## Prerequisites

Before deploying, you need to get your **Appwrite API Key**:

1. Go to your Appwrite Console: https://imagine-6980d008001c107f4bda.appwrite.network
2. Navigate to **Settings** → **API Keys**
3. Create a new API key with these scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `documents.read`
   - `documents.write`
4. Copy the API key (you'll only see it once!)

## Environment Variables

All deployment platforms need these environment variables:

```bash
APPWRITE_ENDPOINT=https://imagine-6980d008001c107f4bda.appwrite.network
APPWRITE_PROJECT_ID=6980d008001c107f4bda
APPWRITE_DB_ID=imagine-project-db
APPWRITE_API_KEY=your_actual_api_key_here
APPWRITE_BUCKET_ID=your_bucket_id_here

# Frontend variables (same values, different prefix)
VITE_APPWRITE_ENDPOINT=https://imagine-6980d008001c107f4bda.appwrite.network
VITE_APPWRITE_PROJECT_ID=6980d008001c107f4bda
VITE_APPWRITE_DB_ID=imagine-project-db
VITE_APPWRITE_BUCKET_ID=your_bucket_id_here
```

## Deploy to Vercel (Recommended)

### Option 1: CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add APPWRITE_ENDPOINT
vercel env add APPWRITE_PROJECT_ID
vercel env add APPWRITE_DB_ID
vercel env add APPWRITE_API_KEY
vercel env add APPWRITE_BUCKET_ID
vercel env add VITE_APPWRITE_ENDPOINT
vercel env add VITE_APPWRITE_PROJECT_ID
vercel env add VITE_APPWRITE_DB_ID
vercel env add VITE_APPWRITE_BUCKET_ID

# Deploy to production
vercel --prod
```

### Option 2: GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Add all environment variables in the deployment settings
6. Click "Deploy"

## Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Add environment variables
netlify env:set APPWRITE_ENDPOINT "https://imagine-6980d008001c107f4bda.appwrite.network"
netlify env:set APPWRITE_PROJECT_ID "6980d008001c107f4bda"
netlify env:set APPWRITE_DB_ID "imagine-project-db"
netlify env:set APPWRITE_API_KEY "your_api_key"
netlify env:set APPWRITE_BUCKET_ID "your_bucket_id"
netlify env:set VITE_APPWRITE_ENDPOINT "https://imagine-6980d008001c107f4bda.appwrite.network"
netlify env:set VITE_APPWRITE_PROJECT_ID "6980d008001c107f4bda"
netlify env:set VITE_APPWRITE_DB_ID "imagine-project-db"
netlify env:set VITE_APPWRITE_BUCKET_ID "your_bucket_id"

# Deploy
netlify deploy --prod
```

## Deploy to Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize
railway init

# Add environment variables
railway variables set APPWRITE_ENDPOINT="https://imagine-6980d008001c107f4bda.appwrite.network"
railway variables set APPWRITE_PROJECT_ID="6980d008001c107f4bda"
railway variables set APPWRITE_DB_ID="imagine-project-db"
railway variables set APPWRITE_API_KEY="your_api_key"
railway variables set APPWRITE_BUCKET_ID="your_bucket_id"
railway variables set VITE_APPWRITE_ENDPOINT="https://imagine-6980d008001c107f4bda.appwrite.network"
railway variables set VITE_APPWRITE_PROJECT_ID="6980d008001c107f4bda"
railway variables set VITE_APPWRITE_DB_ID="imagine-project-db"
railway variables set VITE_APPWRITE_BUCKET_ID="your_bucket_id"

# Deploy
railway up
```

## After Deployment

1. Visit your deployed URL
2. Sign up for an account
3. Navigate to `/admin`
4. Click "Load Demo Data" to populate the database
5. Explore the dashboard with sample data

## Troubleshooting

### "Unauthorized" errors
- Verify APPWRITE_API_KEY is set correctly
- Check API key has required scopes in Appwrite Console

### "Database not found" errors
- Confirm APPWRITE_DB_ID matches your database ID
- Verify database exists in Appwrite Console

### Build failures
- Check all environment variables are set
- Review build logs for specific errors
- Ensure Bun or Node.js version is compatible

### Connection timeouts
- Verify APPWRITE_ENDPOINT is accessible from your deployment platform
- Check Appwrite project is active and not suspended

## Security Notes

- **Never commit `.env` file to Git** (it's in .gitignore)
- Store API keys securely in your deployment platform
- Rotate API keys periodically
- Use different API keys for development and production
