# DNS Configuration Guide for InboxPass

This guide explains how to configure DNS records to point `inboxpass.org` to Vercel instead of Manus.

## Current Configuration (Before)

**Domain**: `inboxpass.org`  
**DNS Provider**: Cloudflare  
**Current Target**: Manus (`cname.manus.space`)  

**Current DNS Records**:
```
Type: CNAME
Name: @
Target: cname.manus.space
Proxy: DNS only (gray cloud)
```

## Target Configuration (After)

**Domain**: `inboxpass.org`  
**DNS Provider**: Cloudflare  
**New Target**: Vercel (`76.76.21.21`)  

**New DNS Records**:
```
Type: A
Name: @
IPv4: 76.76.21.21
Proxy: Proxied (orange cloud)
```

## Step-by-Step DNS Update

### 1. Access Cloudflare Dashboard

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Log in with your account
3. Select domain: **inboxpass.org**

### 2. Navigate to DNS Records

1. Click **DNS** in the left sidebar
2. Click **Records** tab
3. You'll see the current CNAME record

### 3. Delete Existing CNAME Record

1. Find the CNAME record:
   - Type: `CNAME`
   - Name: `@` (or `inboxpass.org`)
   - Target: `cname.manus.space`
2. Click the **three dots** (⋯) on the right
3. Click **Delete**
4. Confirm deletion

### 4. Add New A Record for Vercel

1. Click **Add record** button
2. Fill in the following:
   - **Type**: `A`
   - **Name**: `@`
   - **IPv4 address**: `76.76.21.21`
   - **Proxy status**: **Proxied** (click to turn orange cloud on)
   - **TTL**: Auto
3. Click **Save**

### 5. Optional: Add WWW Subdomain

If you want `www.inboxpass.org` to also work:

1. Click **Add record** button
2. Fill in:
   - **Type**: `CNAME`
   - **Name**: `www`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: **Proxied** (orange cloud)
   - **TTL**: Auto
3. Click **Save**

### 6. Verify DNS Propagation

Wait 5-10 minutes, then check:

**Using Command Line**:
```bash
# Check A record
dig inboxpass.org

# Should show:
# inboxpass.org.  300  IN  A  76.76.21.21

# Check from multiple locations
dig @8.8.8.8 inboxpass.org
dig @1.1.1.1 inboxpass.org
```

**Using Online Tools**:
- [whatsmydns.net](https://www.whatsmydns.net/#A/inboxpass.org)
- [dnschecker.org](https://dnschecker.org/)

**Using Browser**:
1. Open incognito/private window
2. Go to `https://inboxpass.org`
3. Should load Vercel deployment (no Manus branding)

## DNS Record Comparison

| Setting | Before (Manus) | After (Vercel) |
|---------|---------------|----------------|
| Type | CNAME | A |
| Name | @ | @ |
| Target | cname.manus.space | 76.76.21.21 |
| Proxy | DNS only (gray) | Proxied (orange) |
| TTL | Auto | Auto |

## Cloudflare Proxy Benefits

**Orange Cloud (Proxied)** provides:
- ✅ DDoS protection
- ✅ CDN caching
- ✅ SSL/TLS encryption
- ✅ Web Application Firewall (WAF)
- ✅ Bot protection
- ✅ Analytics

**Recommendation**: Keep proxy **enabled** (orange cloud) for production.

## Vercel DNS Records Reference

Vercel provides these IP addresses for A records:

**IPv4**:
- `76.76.21.21` (primary)
- `76.76.21.164` (backup)
- `76.76.21.241` (backup)

**IPv6** (optional):
- `2606:4700:3037::ac43:d518`
- `2606:4700:3037::ac43:d5a4`
- `2606:4700:3037::ac43:d5f1`

For most deployments, a single A record pointing to `76.76.21.21` is sufficient.

## Alternative: Vercel Nameservers

If you prefer to use Vercel's DNS instead of Cloudflare:

1. In Vercel dashboard, add domain: `inboxpass.org`
2. Vercel provides nameservers:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Go to your domain registrar (Namecheap, GoDaddy, etc.)
4. Update nameservers to Vercel's
5. Wait 24-48 hours for propagation

**Note**: This removes Cloudflare's DDoS protection and CDN benefits.

## Troubleshooting DNS Issues

### Issue: DNS not propagating after 10 minutes

**Causes**:
- Cloudflare cache not cleared
- Browser cache not cleared
- ISP DNS cache

**Solutions**:
```bash
# Flush local DNS cache (Mac)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Flush local DNS cache (Windows)
ipconfig /flushdns

# Flush local DNS cache (Linux)
sudo systemd-resolve --flush-caches
```

Then:
1. Clear browser cache
2. Try incognito/private window
3. Try different browser
4. Try mobile data (different network)

### Issue: SSL certificate error

**Cause**: Vercel hasn't issued SSL certificate yet

**Solution**:
1. Wait 5-10 minutes for Vercel to provision SSL
2. In Vercel dashboard, check **Settings > Domains**
3. Should show "Valid Configuration" with SSL icon
4. If stuck, try:
   - Remove domain from Vercel
   - Wait 5 minutes
   - Re-add domain

### Issue: "This site can't be reached"

**Cause**: DNS record not configured correctly

**Solution**:
1. Verify A record exists: `dig inboxpass.org`
2. Check Cloudflare DNS settings
3. Ensure proxy is enabled (orange cloud)
4. Wait 5-10 more minutes

### Issue: Still showing Manus site

**Cause**: Browser or CDN cache

**Solution**:
1. Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. Clear browser cache completely
3. Try incognito window
4. Check from different device/network

## DNS Propagation Timeline

| Time | Status |
|------|--------|
| 0-5 min | Cloudflare updates internal DNS |
| 5-10 min | Most users see new site |
| 10-30 min | Global propagation continues |
| 30-60 min | 99% of users see new site |
| 1-24 hours | Rare edge cases resolve |

**Typical**: 5-10 minutes for most users

## Rollback DNS Changes

If you need to revert to Manus:

1. Go to Cloudflare dashboard
2. Delete the A record (`76.76.21.21`)
3. Add back CNAME record:
   - Type: `CNAME`
   - Name: `@`
   - Target: `cname.manus.space`
   - Proxy: DNS only (gray cloud)
4. Wait 5-10 minutes
5. Site will be back on Manus

## Security Considerations

### SSL/TLS Configuration

**Cloudflare SSL/TLS Mode**: Full (strict)

1. Go to Cloudflare dashboard
2. Click **SSL/TLS**
3. Set mode to **Full (strict)**
4. This ensures end-to-end encryption

### DNSSEC

**Recommendation**: Enable DNSSEC for additional security

1. Go to Cloudflare dashboard
2. Click **DNS > Settings**
3. Enable **DNSSEC**
4. Follow instructions to add DS records at your registrar

### CAA Records (Optional)

Restrict which Certificate Authorities can issue SSL certificates:

```
Type: CAA
Name: @
Tag: issue
Value: letsencrypt.org
```

This prevents unauthorized SSL certificate issuance.

## Monitoring DNS Health

### Cloudflare Analytics

1. Go to Cloudflare dashboard
2. Click **Analytics & Logs**
3. Monitor:
   - DNS queries
   - HTTP requests
   - Threats blocked
   - Cache hit rate

### Uptime Monitoring

Set up external monitoring:
- [UptimeRobot](https://uptimerobot.com/) (free)
- [Pingdom](https://www.pingdom.com/)
- [StatusCake](https://www.statuscake.com/)

Monitor: `https://inboxpass.org` every 5 minutes

## DNS Best Practices

✅ **DO**:
- Use Cloudflare proxy (orange cloud) for DDoS protection
- Enable DNSSEC for security
- Set up uptime monitoring
- Keep TTL at Auto for flexibility
- Document all DNS changes

❌ **DON'T**:
- Disable Cloudflare proxy in production
- Use extremely low TTL values (increases load)
- Make DNS changes without testing first
- Forget to update Stripe webhook URL after DNS change

## Post-DNS Update Checklist

After DNS points to Vercel:

- [ ] Site loads at `https://inboxpass.org`
- [ ] SSL certificate is valid (green padlock)
- [ ] No "Made with Manus" branding visible
- [ ] Domain scanner works
- [ ] Stripe checkout redirects correctly
- [ ] Payment webhook fires (update URL if needed)
- [ ] PDF reports generate and download
- [ ] Chat widget responds
- [ ] Mobile site works correctly
- [ ] All pages load (home, success, refund policy, privacy)

## Support Resources

- **Cloudflare DNS Docs**: [developers.cloudflare.com/dns](https://developers.cloudflare.com/dns/)
- **Vercel Custom Domains**: [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **DNS Checker Tool**: [dnschecker.org](https://dnschecker.org/)
- **SSL Checker**: [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest/)

---

**Last Updated**: October 23, 2025  
**Version**: 1.0.0  
**Domain**: inboxpass.org  
**DNS Provider**: Cloudflare  
**Hosting**: Vercel (Frontend) + Manus (Backend)

