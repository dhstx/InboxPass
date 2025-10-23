# Environment Variables Configuration

This document lists all environment variables required for InboxPass deployment.

## Architecture Overview

**Hybrid Deployment**:
- **Vercel**: Hosts the React frontend (static files)
- **Manus**: Hosts the Express backend (API, database, webhooks)

## Vercel Environment Variables

These variables are configured in the Vercel dashboard under **Settings > Environment Variables**.

### Required Variables

```bash
# API Configuration
# Points to the Manus backend URL
VITE_API_BASE_URL=https://3000-ien5pg0d6zwac274zk4rq-6ff05c9c.manus.computer

# OAuth Configuration (Manus Auth)
VITE_APP_ID=<your_manus_app_id>
VITE_OAUTH_PORTAL_URL=https://api.manus.im/oauth/portal

# App Branding
VITE_APP_TITLE=InboxPass - Email Compliance Kit
VITE_APP_LOGO=/logo.svg

# Stripe Public Key (frontend only, safe to expose)
VITE_STRIPE_PUBLIC_KEY=pk_live_51QQpHMCOiWfOyQjE...

# Node Environment
NODE_ENV=production
```

### Optional Variables (Analytics)

```bash
# Analytics Configuration (if using Umami or similar)
VITE_ANALYTICS_ENDPOINT=https://analytics.yourdomain.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id_here
```

### Important Notes

- **All `VITE_*` variables are exposed to the browser** - never put secrets here
- Vercel automatically injects these during build time
- Changes require a new deployment to take effect
- Use separate values for Production, Preview, and Development environments

## Manus Backend Environment Variables

These variables are already configured in the Manus platform. **No changes needed** unless updating credentials.

### Database

```bash
DATABASE_URL=mysql://username:password@host:port/database
```

### Authentication

```bash
JWT_SECRET=<auto_generated_secret>
OAUTH_SERVER_URL=https://api.manus.im
VITE_APP_ID=<your_app_id>
VITE_OAUTH_PORTAL_URL=https://api.manus.im/oauth/portal
OWNER_OPEN_ID=<owner_id>
OWNER_NAME=<owner_name>
```

### Stripe (Backend)

```bash
# Secret key (NEVER expose to frontend)
STRIPE_SECRET_KEY=sk_live_51QQpHMCOiWfOyQjE...

# Product price ID
STRIPE_PRICE_ID=price_1QQpKECOiWfOyQjE...

# Webhook secret for signature verification
STRIPE_WEBHOOK_SECRET=whsec_...
```

### AWS S3 (PDF Storage)

```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=inboxpass-reports
AWS_REGION=us-east-1
```

### AI Services

```bash
# Anthropic Claude API for recommendations and chat
ANTHROPIC_API_KEY=sk-ant-api03-...

# Manus built-in services
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=<auto_generated>
```

### App Configuration

```bash
VITE_APP_TITLE=InboxPass - Email Compliance Kit
VITE_APP_LOGO=/logo.svg
```

### Analytics (Optional)

```bash
VITE_ANALYTICS_ENDPOINT=https://analytics.yourdomain.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id_here
```

## Local Development Environment Variables

For local development, create a `.env` file in the project root:

```bash
# Copy from .env.example
cp .env.example .env

# Edit with your local values
nano .env
```

### Local `.env` Example

```bash
# Database (local or development)
DATABASE_URL=mysql://root:password@localhost:3306/inboxpass_dev

# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_51QQpHMCOiWfOyQjE...
STRIPE_PRICE_ID=price_test_1QQpKECOiWfOyQjE...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Anthropic (use same key or separate test key)
ANTHROPIC_API_KEY=sk-ant-api03-...

# AWS S3 (use test bucket)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=inboxpass-reports-dev
AWS_REGION=us-east-1

# OAuth (use Manus development app)
VITE_APP_ID=<dev_app_id>
JWT_SECRET=<generate_random_secret>
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://api.manus.im/oauth/portal

# App Config
VITE_APP_TITLE=InboxPass - Email Compliance Kit (Dev)
VITE_APP_LOGO=/logo.svg

# Node Environment
NODE_ENV=development
```

## Security Best Practices

### ✅ DO

- Use separate keys for development, staging, and production
- Rotate secrets regularly (every 90 days)
- Use Stripe test keys in development
- Store secrets in secure vaults (Vercel, Manus, 1Password)
- Use environment-specific values (dev, staging, prod)
- Audit access logs regularly

### ❌ DON'T

- Commit `.env` files to Git (already in `.gitignore`)
- Share secrets in Slack, email, or documentation
- Use production keys in development
- Expose `STRIPE_SECRET_KEY` to frontend
- Hardcode secrets in source code
- Use the same secrets across environments

## Vercel Deployment Environments

Vercel supports three environments:

### 1. Production
- Triggered by: Push to `main` branch
- Domain: `inboxpass.org`
- Uses: Production environment variables

### 2. Preview
- Triggered by: Pull requests or non-main branches
- Domain: `inboxpass-git-<branch>.vercel.app`
- Uses: Preview environment variables (or Production if not set)

### 3. Development
- Triggered by: `vercel dev` command locally
- Domain: `localhost:3000`
- Uses: `.env.local` file or Development environment variables

## How to Update Environment Variables

### Vercel (Frontend)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: **InboxPass**
3. Go to **Settings > Environment Variables**
4. Add or edit variables
5. Select environments: Production, Preview, Development
6. Click **Save**
7. **Redeploy** for changes to take effect

### Manus (Backend)

1. Go to Manus project dashboard
2. Navigate to **Settings > Environment Variables**
3. Add or edit variables
4. Click **Save**
5. Backend automatically restarts with new values

### Local Development

1. Edit `.env` file in project root
2. Restart development server: `pnpm dev`
3. Changes take effect immediately

## Troubleshooting

### Issue: "API calls failing with CORS error"

**Cause**: `VITE_API_BASE_URL` not set or incorrect

**Solution**:
```bash
# Verify in Vercel dashboard
VITE_API_BASE_URL=https://3000-ien5pg0d6zwac274zk4rq-6ff05c9c.manus.computer

# Redeploy after updating
```

### Issue: "Stripe checkout not working"

**Cause**: `VITE_STRIPE_PUBLIC_KEY` missing or wrong key type

**Solution**:
```bash
# Use public key (starts with pk_)
VITE_STRIPE_PUBLIC_KEY=pk_live_51QQpHMCOiWfOyQjE...

# NOT the secret key (sk_)
```

### Issue: "PDF generation fails"

**Cause**: Backend environment variables missing (S3, Anthropic)

**Solution**:
- Check Manus backend has `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`
- Verify `ANTHROPIC_API_KEY` is set
- Check backend logs for specific error

### Issue: "Chat widget not responding"

**Cause**: `ANTHROPIC_API_KEY` missing or invalid

**Solution**:
- Verify key in Manus backend environment
- Check API key has sufficient credits
- Test with: `curl https://api.anthropic.com/v1/messages -H "x-api-key: $ANTHROPIC_API_KEY"`

### Issue: "OAuth login fails"

**Cause**: `VITE_APP_ID` or `VITE_OAUTH_PORTAL_URL` incorrect

**Solution**:
```bash
# Verify OAuth configuration
VITE_APP_ID=<your_manus_app_id>
VITE_OAUTH_PORTAL_URL=https://api.manus.im/oauth/portal

# Check callback URL is whitelisted in Manus app settings
```

## Verification Checklist

After configuring environment variables:

### Vercel Frontend
- [ ] `VITE_API_BASE_URL` points to Manus backend
- [ ] `VITE_STRIPE_PUBLIC_KEY` is public key (pk_)
- [ ] `VITE_APP_ID` matches Manus app
- [ ] `VITE_OAUTH_PORTAL_URL` is correct
- [ ] All variables saved in Vercel dashboard
- [ ] Redeployed after changes

### Manus Backend
- [ ] `DATABASE_URL` connects successfully
- [ ] `STRIPE_SECRET_KEY` is secret key (sk_)
- [ ] `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- [ ] `ANTHROPIC_API_KEY` has sufficient credits
- [ ] `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` valid
- [ ] `AWS_S3_BUCKET` exists and accessible

### Testing
- [ ] Homepage loads without errors
- [ ] DNS scan completes successfully
- [ ] Stripe checkout redirects correctly
- [ ] Payment webhook fires and processes
- [ ] PDF generates and uploads to S3
- [ ] Chat widget responds to messages
- [ ] OAuth login works

## Reference Links

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Stripe API Keys](https://dashboard.stripe.com/apikeys)
- [Anthropic API Keys](https://console.anthropic.com/settings/keys)
- [AWS IAM Console](https://console.aws.amazon.com/iam/)
- [Manus Dashboard](https://manus.im/dashboard)

---

**Last Updated**: October 23, 2025
**Version**: 1.0.0

