# Deploy to Netlify

## Quick Start

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Login
```bash
netlify login
```

### 3. Initialize and Deploy
```bash
netlify init
```

Follow the prompts:
- **Create & configure a new site**
- **Team**: Your team
- **Site name**: work-habits-tracker (or your choice)
- **Build command**: `bun run build`
- **Publish directory**: `dist/client`

### 4. Add Environment Variables

```bash
netlify env:set APPWRITE_ENDPOINT "your-endpoint"
netlify env:set APPWRITE_PROJECT_ID "6980d008001c107f4bda"
netlify env:set APPWRITE_API_KEY "your-api-key"
netlify env:set APPWRITE_DB_ID "imagine-project-db"
netlify env:set APPWRITE_BUCKET_ID "your-bucket-id"
```

### 5. Deploy to Production
```bash
netlify deploy --prod
```

## Alternative: Deploy via GitHub

1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Configure build settings (already set in netlify.toml)
6. Add environment variables in Site Settings → Environment Variables
7. Click "Deploy site"

## Production URL

You'll get a URL like:
```
https://work-habits-tracker.netlify.app
```

## Custom Domain

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records
4. SSL is automatic
