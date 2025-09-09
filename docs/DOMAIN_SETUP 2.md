# Domain Setup Documentation - unimogcommunityhub.com

## Overview
This document details the complete process of setting up the custom domain `unimogcommunityhub.com` for the Unimog Community Hub platform, including DNS configuration, email setup with Mailgun, and SSL certificate provisioning.

**Setup Date**: January 2025  
**Domain Registrar**: GoDaddy  
**Hosting**: Netlify  
**Email Service**: Mailgun (EU Region)

## 🔄 Initial Situation

### Problem
- Domain was previously configured with Lovable.com using Netlify nameservers
- GoDaddy couldn't manage DNS (external nameservers were set)
- Netlify showed "DNS zone already exists on NS1" error
- Need to reclaim control and properly configure domain

### Solution Path
1. Switch nameservers back to GoDaddy defaults
2. Configure DNS records for Netlify hosting
3. Set up Mailgun email service
4. Configure SSL certificate

## 📋 Step-by-Step Process

### Step 1: Reclaim DNS Control

**Problem**: Domain nameservers were pointing to Lovable/Netlify NS1 servers

**Solution**: 
- In GoDaddy → Domain Settings → Nameservers
- Changed from external nameservers to GoDaddy defaults:
  - `ns69.domaincontrol.com`
  - `ns70.domaincontrol.com`
- Waited for nameserver propagation

### Step 2: Configure DNS for Netlify

**DNS Records Added in GoDaddy**:

```
Type: A
Name: @
Value: 75.2.60.5
TTL: 600 seconds

Type: CNAME
Name: www
Value: unimogcommunityhub.com
TTL: 1 Hour
```

**Netlify Configuration**:
1. Added custom domain in Netlify dashboard
2. Set `unimogcommunityhub.com` as primary domain
3. Configured `www.unimogcommunityhub.com` to redirect to primary

### Step 3: Mailgun Email Configuration

**Created New Mailgun Domain**: `mail.unimogcommunityhub.com`

**DNS Records for Email** (Added via Zone File Import):

#### DKIM Record (Authentication)
```
Type: TXT
Name: s1._domainkey.mail.unimogcommunityhub.com
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDmJLmg7PnuqlPqK5u2F9Emx/xiARRp/71kp99xs0TwSkxZyqI+Lo70h1EvpeeqYxIB7KfJmCd/6+7KOO1PqrjDgeyMPdPVDQei7KuUFV9qH84n/KD1PbjOjhOnnEOgvCUCQtFSzBMFhIaLJ2wJ1Actaw5UMMvaAVHxIoGLsB+EtwIDAQAB
```

#### SPF Record (Spam Prevention)
```
Type: TXT
Name: mail.unimogcommunityhub.com
Value: v=spf1 include:mailgun.org ~all
```

#### MX Records (Mail Routing - EU Servers)
```
Type: MX
Name: mail.unimogcommunityhub.com
Value: mxa.eu.mailgun.org
Priority: 10

Type: MX
Name: mail.unimogcommunityhub.com
Value: mxb.eu.mailgun.org
Priority: 10
```

#### CNAME Record (Email Tracking)
```
Type: CNAME
Name: email.mail.unimogcommunityhub.com
Value: eu.mailgun.org
```

#### DMARC Record (Authentication Policy)
```
Type: TXT
Name: _dmarc.mail.unimogcommunityhub.com
Value: v=DMARC1; p=none; pct=100; fo=1; ri=3600; rua=mailto:de080fcf@dmarc.mailgun.org,mailto:50bc94ff@inbox.ondmarc.com; ruf=mailto:de080fcf@dmarc.mailgun.org,mailto:50bc94ff@inbox.ondmarc.com;
```

### Step 4: Zone File Import Process

To speed up DNS record addition, we used GoDaddy's zone file import feature:

1. Created zone file with all Mailgun records
2. Saved as `.txt` file (GoDaddy requirement)
3. Imported via GoDaddy DNS management
4. All 5 email records added simultaneously

**Zone File Format Used**:
```
$ORIGIN unimogcommunityhub.com.
$TTL 3600

; Mailgun Email DNS Records
s1._domainkey.mail    IN    TXT    "k=rsa; p=..."
mail                  IN    TXT    "v=spf1 include:mailgun.org ~all"
mail                  IN    MX     10 mxa.eu.mailgun.org.
mail                  IN    MX     10 mxb.eu.mailgun.org.
email.mail            IN    CNAME  eu.mailgun.org.
_dmarc.mail           IN    TXT    "v=DMARC1; p=none;..."
```

### Step 5: Environment Variables Configuration

**Netlify Environment Variables Updated**:
```
VITE_APP_URL=https://unimogcommunityhub.com
MAILGUN_DOMAIN=mail.unimogcommunityhub.com
MAILGUN_API_KEY=[new-api-key-for-unimog-domain]
```

**Mailgun API Key**:
- Created new API key specifically for UnimogCommunityHub
- Named: "UnimogCommunityHub API Key"
- Kept separate from video course projects

### Step 6: Code Updates

**Files Modified**:
- `README.md` - Updated live site URL
- `docs/GIT_WORKFLOW.md` - Updated production URLs
- `src/config/env.ts` - Already had correct fallback domain

**Files Already Correct**:
- `supabase/functions/send-email/index.ts` - MAILGUN_DOMAIN already set to "unimogcommunityhub.com"

## 🔍 Troubleshooting Issues Encountered

### Issue 1: "DNS zone already exists on NS1"
**Cause**: Domain was previously managed by Lovable.com  
**Solution**: Switched nameservers back to GoDaddy

### Issue 2: "Add new record" greyed out in GoDaddy
**Cause**: Domain using external nameservers  
**Solution**: Changed to GoDaddy default nameservers

### Issue 3: Zone file import rejected
**Cause**: GoDaddy expects `.txt` extension, not `.zone`  
**Solution**: Created file with `.txt` extension

### Issue 4: DMARC not verifying
**Cause**: Needed subdomain-specific DMARC record  
**Solution**: Added `_dmarc.mail` record in addition to root `_dmarc`

## ✅ Verification Steps

### DNS Propagation Check
```bash
# Check with Google DNS
host unimogcommunityhub.com 8.8.8.8
# Result: unimogcommunityhub.com has address 75.2.60.5

# Check MX records
dig +short mail.unimogcommunityhub.com MX
# Result: 10 mxa.eu.mailgun.org. / 10 mxb.eu.mailgun.org.
```

### Site Accessibility
```bash
# Direct IP test with host header
curl -H "Host: unimogcommunityhub.com" https://75.2.60.5 -I -k
# Result: HTTP/2 200 (site working)
```

## 📊 Final DNS Configuration

### Current DNS Records in GoDaddy

| Type | Name | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| A | @ | 75.2.60.5 | 600s | Netlify hosting |
| CNAME | www | unimogcommunityhub.com | 1hr | WWW redirect |
| TXT | s1._domainkey.mail | [DKIM key] | 1hr | Email authentication |
| TXT | mail | v=spf1 include:mailgun.org ~all | 1hr | SPF record |
| MX | mail | mxa.eu.mailgun.org (10) | 1hr | Mail routing |
| MX | mail | mxb.eu.mailgun.org (10) | 1hr | Mail routing |
| CNAME | email.mail | eu.mailgun.org | 1hr | Email tracking |
| TXT | _dmarc | [root DMARC] | 1hr | Root domain DMARC |
| TXT | _dmarc.mail | [mail DMARC] | 1hr | Mail subdomain DMARC |

## ⏱️ Timeline

- **DNS Setup**: 30 minutes
- **Email Configuration**: 45 minutes
- **Documentation**: 15 minutes
- **Total Setup Time**: ~1.5 hours
- **DNS Propagation**: 2-4 hours globally
- **SSL Certificate**: Auto-provisions after DNS propagation

## 🎯 Results

✅ **Domain Live**: https://unimogcommunityhub.com  
✅ **SSL Certificate**: Auto-provisioned by Netlify  
✅ **Email System**: Configured with Mailgun EU servers  
✅ **Documentation**: Updated with new domain  
✅ **Environment Variables**: Configured in Netlify  

## 📝 Maintenance Notes

### Regular Checks
- Monitor Mailgun dashboard for email deliverability
- Check SSL certificate renewal (auto-renews via Let's Encrypt)
- Verify DNS records haven't changed unexpectedly

### Future Considerations
- Consider adding CAA records for additional security
- Monitor DMARC reports for email authentication issues
- Set up email aliases as needed (support@, admin@, etc.)

### Important URLs
- **Live Site**: https://unimogcommunityhub.com
- **Staging Site**: https://unimogcommunity-staging.netlify.app
- **Netlify Dashboard**: https://app.netlify.com
- **Mailgun Dashboard**: https://app.mailgun.com
- **GoDaddy DNS**: https://dcc.godaddy.com

## 🔐 Security Considerations

1. **API Keys**: All API keys stored securely in Netlify environment variables
2. **DMARC Policy**: Set to monitoring mode (p=none) initially
3. **SPF Record**: Configured to prevent email spoofing
4. **DKIM**: Ensures email authenticity
5. **SSL/TLS**: Automatic HTTPS enforcement via Netlify

## 📚 References

- [Netlify Custom Domain Documentation](https://docs.netlify.com/domains-https/custom-domains/)
- [Mailgun DNS Setup Guide](https://documentation.mailgun.com/en/latest/user_manual.html#verifying-your-domain)
- [GoDaddy DNS Management](https://www.godaddy.com/help/manage-dns-680)
- [DNS Propagation Checker](https://www.whatsmydns.net/)

---

**Document Created**: January 2025  
**Last Updated**: January 2025  
**Author**: Thabonel with Claude Code assistance