# Deploy to Railway

Railway is great for full-stack apps with databases.

## Quick Start

### 1. Install Railway CLI
```bash
npm i -g @railway/cli
```

### 2. Login
```bash
railway login
```

### 3. Initialize Project
```bash
railway init
```

### 4. Add Environment Variables
```bash
railway variables set APPWRITE_ENDPOINT="your-endpoint"
railway variables set APPWRITE_PROJECT_ID="6980d008001c107f4bda"
railway variables set APPWRITE_API_KEY="your-api-key"
railway variables set APPWRITE_DB_ID="imagine-project-db"
railway variables set APPWRITE_BUCKET_ID="your-bucket-id"
```

### 5. Deploy
```bash
railway up
```

## Alternative: Deploy via GitHub

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects the build
5. Add environment variables in Variables tab
6. Deploy automatically starts

## Configuration

Railway auto-detects Bun and uses:
- **Build**: `bun run build`
- **Start**: `bun run start`
- **Port**: Auto-assigned (Railway provides PORT env var)

## Production URL

You'll get a URL like:
```
https://work-habits-tracker-production.up.railway.app
```

## Custom Domain

1. Go to Settings → Domains
2. Add custom domain
3. Update DNS CNAME record
4. SSL is automatic
