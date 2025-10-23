# InboxPass Vercel Deployment Guide

This guide walks you through deploying InboxPass using a **hybrid architecture**:
- **Frontend**: Vercel (static React app, no "Made with Manus" branding)
- **Backend**: Manus (Express server, database, Stripe webhooks, PDF generation)

## Architecture Overview

```
User Browser
    ↓
Vercel Frontend (inboxpass.org)
    ↓
API Proxy (/api/trpc/*, /api/stripe/webhook, /api/oauth/*)
    ↓
Manus Backend (3000-ien5pg0d6zwac274zk4rq-6ff05c9c.manus.computer)
    ↓
Database, Stripe, S3, Claude API
```

## Prerequisites

- [x] GitHub account with dhstx/InboxPass repository access
- [x] Vercel account (free tier works)
- [x] Domain configured: inboxpass.org
- [x] Manus backend running (current URL: https://3000-ien5pg0d6zwac274zk4rq-6ff05c9c.manus.computer)

## Step 1: Prepare GitHub Repository

The repository is already configured with:
- ✅ `vercel.json` - Vercel configuration with API proxy rules
- ✅ `.vercelignore` - Excludes backend files from deployment
- ✅ `build:frontend` script - Builds only the React frontend
- ✅ `.env.vercel.example` - Template for environment variables

**Action Required:** None, files are already in the repository.

## Step 2: Connect Vercel to GitHub

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. Select **"Import Git Repository"**
4. Choose **dhstx/InboxPass** from your GitHub repositories
5. Click **"Import"**

## Step 3: Configure Vercel Project Settings

### Framework Preset
- **Framework**: Other (or None)
- **Root Directory**: `./` (leave empty)

### Build & Output Settings
- **Build Command**: `pnpm run build:frontend`
- **Output Directory**: `dist/public`
- **Install Command**: `pnpm install`

### Node.js Version
- **Node.js Version**: 20.x (automatic)

## Step 4: Add Environment Variables

Go to **Settings > Environment Variables** and add the following:

### Required Variables

```bash
# API Configuration
VITE_API_BASE_URL=https://3000-ien5pg0d6zwac274zk4rq-6ff05c9c.manus.computer

# OAuth Configuration (from Manus)
VITE_APP_ID=<your_manus_app_id>
VITE_OAUTH_PORTAL_URL=https://api.manus.im/oauth/portal

# App Branding
VITE_APP_TITLE=InboxPass - Email Compliance Kit
VITE_APP_LOGO=/logo.svg

# Stripe Public Key (frontend only)
VITE_STRIPE_PUBLIC_KEY=<your_stripe_public_key>

# Node Environment
NODE_ENV=production
```

### Optional Variables (Analytics)

```bash
VITE_ANALYTICS_ENDPOINT=<your_analytics_endpoint>
VITE_ANALYTICS_WEBSITE_ID=<your_website_id>
```

**Important**: 
- All `VITE_*` variables are exposed to the frontend
- Never put secret keys (like `STRIPE_SECRET_KEY`) in `VITE_*` variables
- Backend secrets remain on Manus (database, Stripe secret, AWS keys)

## Step 5: Deploy to Vercel

1. Click **"Deploy"** in Vercel dashboard
2. Wait for build to complete (~2-3 minutes)
3. Vercel will provide a preview URL: `inboxpass.vercel.app`
4. Test the preview URL to ensure everything works

### Verify Deployment

Check these endpoints:
- ✅ Homepage loads: `https://inboxpass.vercel.app`
- ✅ Domain scanner works (calls backend via proxy)
- ✅ Stripe checkout works (redirects to Stripe)
- ✅ No "Made with Manus" branding visible

## Step 6: Configure Custom Domain

### Option A: Using Cloudflare (Recommended)

1. In Vercel dashboard, go to **Settings > Domains**
2. Add domain: `inboxpass.org`
3. Vercel will provide DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
5. Select domain: `inboxpass.org`
6. Go to **DNS > Records**
7. **Delete** the existing CNAME record pointing to `cname.manus.space`
8. **Add** the new A record:
   - Type: `A`
   - Name: `@`
   - IPv4 address: `76.76.21.21`
   - Proxy status: **Proxied** (orange cloud)
   - TTL: Auto

9. **Add** CNAME for www (optional):
   - Type: `CNAME`
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy status: **Proxied** (orange cloud)
   - TTL: Auto

10. Wait 5-10 minutes for DNS propagation
11. Verify in Vercel: Domain should show "Valid Configuration"

### Option B: Using Vercel DNS

1. In Vercel dashboard, add domain: `inboxpass.org`
2. Vercel will provide nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Go to your domain registrar (Namecheap, GoDaddy, etc.)
4. Update nameservers to Vercel's nameservers
5. Wait 24-48 hours for propagation

**Recommendation**: Use Option A (Cloudflare) for faster propagation and better DDoS protection.

## Step 7: Update Backend CORS Settings

The Manus backend needs to allow requests from the Vercel domain.

**Action Required**: Update CORS configuration in `/home/ubuntu/inboxpass/server/_core/index.ts`:

```typescript
// Add to CORS origins
const allowedOrigins = [
  'https://inboxpass.org',
  'https://www.inboxpass.org',
  'https://inboxpass.vercel.app',
  'http://localhost:3000', // for local development
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

## Step 8: Update Stripe Webhook URL

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Find your webhook endpoint
3. **Update URL** to: `https://inboxpass.org/api/stripe/webhook`
4. Verify webhook secret matches your environment variable

**Note**: The webhook will be proxied through Vercel to Manus backend.

## Step 9: Test Production Deployment

### Frontend Tests
- [ ] Visit `https://inboxpass.org`
- [ ] No "Made with Manus" branding visible
- [ ] Hero section loads with animated gradient
- [ ] Domain scanner accepts input
- [ ] Scan button works and shows loading state

### Backend Integration Tests
- [ ] DNS scan completes successfully
- [ ] Results show SPF, DKIM, DMARC, BIMI records
- [ ] AI recommendations generate properly
- [ ] "Get Full Compliance Kit" button redirects to Stripe
- [ ] Stripe checkout loads with correct $29 price

### Payment Flow Tests
- [ ] Complete test payment with Stripe test card: `4242 4242 4242 4242`
- [ ] Webhook fires and updates database
- [ ] PDF report generates and uploads to S3
- [ ] Success page shows with download link
- [ ] PDF downloads correctly

### Chat Widget Tests
- [ ] Chat widget appears in bottom-right corner
- [ ] Opens when clicked
- [ ] Sends messages to backend
- [ ] Receives AI responses
- [ ] Markdown formatting renders correctly

## Step 10: Monitor and Optimize

### Vercel Analytics
- Enable Vercel Analytics in dashboard
- Track page views, performance, and errors

### Performance Checks
- Run Lighthouse audit: Target 90+ score
- Check Core Web Vitals
- Monitor bundle size

### Error Monitoring
- Check Vercel logs for deployment errors
- Monitor Manus backend logs for API errors
- Set up alerts for failed payments

## Troubleshooting

### Issue: "Failed to fetch" errors

**Cause**: CORS not configured correctly or API proxy not working

**Solution**:
1. Check `vercel.json` has correct backend URL
2. Verify CORS origins in backend include Vercel domain
3. Check browser console for exact error message

### Issue: Stripe checkout fails

**Cause**: Webhook URL not updated or environment variables missing

**Solution**:
1. Verify `VITE_STRIPE_PUBLIC_KEY` is set in Vercel
2. Check Stripe webhook URL points to `https://inboxpass.org/api/stripe/webhook`
3. Test webhook with Stripe CLI: `stripe trigger payment_intent.succeeded`

### Issue: PDF generation fails

**Cause**: Backend can't access WeasyPrint or S3

**Solution**:
1. Verify Manus backend is running
2. Check S3 credentials in Manus environment
3. Test PDF generation manually: `pnpm run generate-sample-pdf`

### Issue: Domain doesn't resolve

**Cause**: DNS propagation delay or incorrect records

**Solution**:
1. Wait 5-10 minutes for Cloudflare propagation
2. Check DNS with `dig inboxpass.org` or `nslookup inboxpass.org`
3. Verify A record points to Vercel IP: `76.76.21.21`
4. Clear browser cache and try incognito mode

### Issue: Chat widget doesn't work

**Cause**: Backend API not accessible or LLM credentials missing

**Solution**:
1. Check `/api/trpc/chat.sendMessage` endpoint
2. Verify `ANTHROPIC_API_KEY` is set in Manus backend
3. Check browser console for error messages

## Rollback Procedure

If deployment fails or causes issues:

1. **Revert Vercel Deployment**:
   - Go to Vercel dashboard > Deployments
   - Find previous working deployment
   - Click "..." > "Promote to Production"

2. **Revert DNS**:
   - Go to Cloudflare dashboard
   - Change A record back to CNAME pointing to `cname.manus.space`
   - Wait 5 minutes for propagation

3. **Revert Code**:
   ```bash
   git revert HEAD
   git push github main
   ```

## Success Checklist

- [ ] Vercel deployment successful
- [ ] Custom domain `inboxpass.org` resolves to Vercel
- [ ] No "Made with Manus" branding visible
- [ ] DNS scanning works end-to-end
- [ ] Stripe payment flow completes successfully
- [ ] PDF reports generate and download
- [ ] Chat widget responds with AI answers
- [ ] All premium UI enhancements visible (gradients, animations, copy buttons)
- [ ] Mobile responsive design works
- [ ] Lighthouse score 90+
- [ ] SSL certificate active (https)

## Architecture Benefits

✅ **Full UI Control**: Edit in Cursor, push to GitHub, auto-deploy to Vercel
✅ **No Branding**: Clean, professional frontend without "Made with Manus"
✅ **Fast Performance**: Vercel's global CDN for static assets
✅ **Functional Backend**: Keep Manus infrastructure for complex operations
✅ **Easy Updates**: Git-based workflow with automatic deployments
✅ **Best of Both Worlds**: Professional UI + reliable backend

## Support

- **Vercel Issues**: [Vercel Support](https://vercel.com/support)
- **Manus Issues**: [Manus Help](https://help.manus.im)
- **Code Issues**: Create issue in [GitHub Repository](https://github.com/dhstx/InboxPass/issues)

## Next Steps

After successful deployment:

1. **Set up monitoring**: Enable Vercel Analytics and error tracking
2. **Configure backups**: Set up automated database backups
3. **Add A/B testing**: Test different pricing or copy variations
4. **Email capture**: Add email collection for marketing
5. **SEO optimization**: Submit sitemap to Google Search Console
6. **Social proof**: Add real customer testimonials
7. **Content marketing**: Write blog posts about email deliverability

---

**Deployment Date**: October 23, 2025
**Version**: 1.0.0
**Last Updated**: October 23, 2025

