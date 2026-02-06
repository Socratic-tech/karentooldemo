# Deploy to Vercel

## Quick Start (5 minutes)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** work-habits-tracker (or your choice)
- **Directory?** ./
- **Override settings?** No

### 4. Add Environment Variables

After first deployment, add your Appwrite credentials:

```bash
vercel env add APPWRITE_ENDPOINT
vercel env add APPWRITE_PROJECT_ID
vercel env add APPWRITE_API_KEY
vercel env add APPWRITE_DB_ID
vercel env add APPWRITE_BUCKET_ID
```

Or add them in the Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for Production, Preview, and Development

**Required Variables:**
- `APPWRITE_ENDPOINT` - Your Appwrite endpoint URL
- `APPWRITE_PROJECT_ID` - Your Appwrite project ID (6980d008001c107f4bda)
- `APPWRITE_API_KEY` - Your Appwrite API key
- `APPWRITE_DB_ID` - Your database ID (imagine-project-db)
- `APPWRITE_BUCKET_ID` - Your storage bucket ID (if using file uploads)

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables in the deployment settings
6. Click "Deploy"

## Production URL

After deployment, you'll get a URL like:
```
https://work-habits-tracker.vercel.app
```

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify Bun is being used (Vercel auto-detects)
- Check build logs in Vercel dashboard

### Runtime Errors
- Verify all environment variables are set
- Check Appwrite credentials are correct
- Review function logs in Vercel dashboard

### Database Connection Issues
- Confirm APPWRITE_ENDPOINT is accessible from Vercel
- Verify API key has correct permissions
- Check that database and collections exist in Appwrite

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate is automatic

## Monitoring

- **Logs**: Vercel Dashboard → Your Project → Logs
- **Analytics**: Built-in Web Analytics available
- **Performance**: Automatic performance monitoring

---

**Need help?** Check [Vercel's TanStack Start docs](https://vercel.com/docs/frameworks/tanstack-start)
